import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import SearchBar from "../../components/SearchBar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useNotifications } from "../../context/MessageNotificationContext";
import { useChatAuth } from "../../context/useChatAuth";
import EmployerFooter from "../../components/EmployerFooter";
import Footer from "../../components/Footer";
import { CHAT_API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import { FormatChatTime } from "./ChatComponent/ChatFormatTime";
import NoConversation from "./ChatComponent/NoConversation";
import { chatEvents } from "./Services/chatEvents";

const PAGE_LIMIT = 10;
const POLL_INTERVAL = 5000;

const ChatRow = React.memo(({ item, onPress }) => {
  const name = item.user?.name ?? "Unknown User";
  const photo = item.user?.photo_url ?? null;
  const lastMessage =
    item.message_type !== 0 && item.message_type !== undefined
      ? "Sent a file"
      : item.message;
  const time = item.created_at;
  const unreadCount = item.unread_count ?? 0;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Image
        source={{ uri: photo }}
        style={styles.avatar}
        key={item.user?.id}
      />
      <View style={styles.rowText}>
        <View style={styles.rowTop}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.time}>
            <FormatChatTime time={time} />
          </Text>
        </View>
        <View style={styles.rowBottom}>
          <Text numberOfLines={1} style={styles.subtitle}>{lastMessage}</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ChatList = () => {
  const navigation = useNavigation();
  const { admin } = useNotifications();
  const { chatToken, refreshChatToken } = useChatAuth();

  const [conversations, setConversations] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);

  const searchTimeoutRef = useRef(null);
  const momentumRef = useRef(true);
  const hasFetched = useRef(false);
  const loadingRef = useRef(false);
  const isFetchingMoreRef = useRef(false);
  const pollTimerRef = useRef(null);
  const searchTextRef = useRef("");
  const activeFilterRef = useRef(null);

  const fetchConversations = useCallback(async (token, offsetNum = 0, isInitialOrRefresh = false, search = "", filter = null) => {
    if (loadingRef.current || isFetchingMoreRef.current) return;
    if (isInitialOrRefresh) {
      if (!isRefreshing) {
        setLoading(true);
        loadingRef.current = true;
      }
    } else {
      setIsFetchingMore(true);
      isFetchingMoreRef.current = true;
    }

    try {
      const params = new URLSearchParams({ offset: offsetNum });
      if (search.trim()) params.append("search", search);
      if (filter === "archived") {
        params.append("isArchived", 1);
      } else if (filter) {
        params.append("filter", filter);
      }

      const res = await fetch(`${CHAT_API_URL}/conversations?${params}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      if (res.status === 401) {
        const newToken = await refreshChatToken();
        if (newToken) fetchConversations(newToken, offsetNum, isInitialOrRefresh, search, filter);
        return;
      }

      const data = await res.json();
      const newConversations = data?.data?.conversations ?? [];

      setConversations((prev) => {
        if (isInitialOrRefresh) return newConversations;
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...newConversations.filter((item) => !ids.has(item.id))];
      });
      setHasMore(newConversations.length === PAGE_LIMIT);
      setOffset(offsetNum);
    } catch (e) {
      console.error("fetchConversations error:", e);
    } finally {
      setLoading(false);
      loadingRef.current = false;
      setIsRefreshing(false);
      setIsFetchingMore(false);
      isFetchingMoreRef.current = false;
    }
  },
    [isRefreshing, refreshChatToken]
  );

  useEffect(() => {
    if (chatToken && !hasFetched.current) {
      hasFetched.current = true;
      fetchConversations(chatToken, 0, true, "", null);
    }
  }, [chatToken]);
  useEffect(() => {
    const unsub = chatEvents.on("conversation:deleted", (deletedUserId) => {
      setConversations((prev) =>
        prev.filter((c) => c.user?.id != deletedUserId)
      );
    });
    return () => unsub(); // cleanup on unmount
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!chatToken) return;
      const poll = async () => {
        if (searchTextRef.current.trim() || activeFilterRef.current) return;
        if (loadingRef.current || isFetchingMoreRef.current) return;

        try {
          const res = await fetch(`${CHAT_API_URL}/conversations?offset=0`, {
            headers: { Authorization: `Bearer ${chatToken}`, Accept: "application/json" },
          });
          if (!res.ok) return;

          const data = await res.json();
          const fresh = data?.data?.conversations ?? [];
          if (!fresh.length) return;

          setConversations((prev) => {
            const prevMap = new Map(prev.map((c) => [c.user?.id, c])); // key by user id, not conversation id

            const merged = fresh.map((c) => {
              const existing = prevMap.get(c.user?.id); // look up by user id
              if (
                existing &&
                existing.message === c.message &&
                existing.unread_count === c.unread_count
              ) {
                return existing;
              }
              return c;
            });

            // Exclude by user id — stable across new messages
            const freshUserIds = new Set(fresh.map((c) => c.user?.id));
            const rest = prev.filter((c) => !freshUserIds.has(c.user?.id));
            return [...merged, ...rest];
          });
        } catch (e) {
          console.error("poll error:", e);
        }
      };

      pollTimerRef.current = setInterval(poll, POLL_INTERVAL);
      return () => clearInterval(pollTimerRef.current);
    }, [chatToken])
  );

  // Keep refs in sync
  useEffect(() => { searchTextRef.current = searchText; }, [searchText]);
  useEffect(() => { activeFilterRef.current = activeFilter; }, [activeFilter]);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (chatToken) {
        momentumRef.current = true;
        fetchConversations(chatToken, 0, true, text, activeFilter);
      }
    }, 500);
  };

  const handleFilterSelect = (filter) => {
    const next = activeFilter === filter ? null : filter;
    setActiveFilter(next);
    if (chatToken) {
      momentumRef.current = true;
      fetchConversations(chatToken, 0, true, searchText, next);
    }
  };

  const handleRefresh = () => {
    if (!chatToken) return;
    setIsRefreshing(true);
    momentumRef.current = true;
    fetchConversations(chatToken, 0, true, searchText, activeFilter);
  };

  const renderItem = useCallback(({ item }) => {
    const id = item.user?.id;
    if (!id) return null;
    return (
      <ChatRow
        item={item}
        onPress={() =>
          navigation.navigate("ChatRoom", {
            userId: id,
            userName: item.user?.name,
            userPhoto: item.user?.photo_url,
            isGroup: false,
          })
        }
      />
    );
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <PageNameHeaderBar title="Chat" navigation={navigation} />
        <View style={{ paddingBottom: 10 }}>
          <SearchBar
            value={searchText}
            onChangeText={handleSearchTextChange}
            showDots={false}
            activeFilter={activeFilter}
            onFilterSelect={handleFilterSelect}
          />
        </View>

        {loading && !isRefreshing ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Loading />
          </View>
        ) : conversations.length === 0 ? (
          <NoConversation />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
            renderItem={renderItem}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            onEndReachedThreshold={0.1}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews
            onScrollBeginDrag={() => { momentumRef.current = false; }}
            onMomentumScrollBegin={() => { momentumRef.current = false; }}
            onEndReached={() => {
              if (
                !momentumRef.current &&
                hasMore &&
                !isFetchingMoreRef.current &&
                !loadingRef.current &&
                chatToken
              ) {
                fetchConversations(chatToken, offset + PAGE_LIMIT, false, searchText, activeFilter);
                momentumRef.current = true;
              }
            }}
            ListFooterComponent={
              isFetchingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              ) : null
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      {admin === 2 ? <EmployerFooter /> : <Footer />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  rowText: { flex: 1 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  time: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    flex: 1,
  },
  badge: {
    backgroundColor: "#ff7a00",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  footerLoader: {
    paddingVertical: 10,
  },
});

export default ChatList;