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
import { useNavigation } from "@react-navigation/native";
import { useNotifications } from "../../context/MessageNotificationContext";
import { useChatAuth } from "../../context/useChatAuth";
import { useChatStore } from "../../store/chatStore";
import EmployerFooter from "../../components/EmployerFooter";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import { FormatChatTime } from "./ChatComponent/ChatFormatTime";
import NoConversation from "./ChatComponent/NoConversation";
import { chatEvents } from "./Services/chatEvents";

const ChatRow = React.memo(({ item, onPress }) => {
  const name = item.user?.name ?? "Unknown User";
  const photo = item.user?.photo_url ?? null;
  const lastMessage =
    item.message_type !== 0 && item.message_type !== undefined
      ? "Sent a file"
      : item.message;
  // Coerced because the API sends this as a string from a SQL sum().
  const unreadCount = Number(item.unread_count ?? 0) || 0;

  // onPress is bound to this row's peer id by the parent, so React.memo holds.
  const handlePress = useCallback(() => onPress(item), [onPress, item]);

  return (
    <TouchableOpacity style={styles.row} onPress={handlePress}>
      <Image source={{ uri: photo }} style={styles.avatar} />
      <View style={styles.rowText}>
        <View style={styles.rowTop}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.time}>
            <FormatChatTime time={item.created_at} />
          </Text>
        </View>
        <View style={styles.rowBottom}>
          {item.feed_id ? (
            <Text numberOfLines={1} style={styles.subtitle}>
              {lastMessage ? lastMessage.split(/<br\s*\/?>/i)[0].trim() : ""}
            </Text>
          ) : (
            <Text numberOfLines={1} style={styles.subtitle}>{lastMessage}</Text>
          )}
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
  const { chatToken } = useChatAuth();

  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchTimeoutRef = useRef(null);
  const momentumRef = useRef(true);

  // Conversations live in the store and are kept current by the socket — this
  // screen never fetches on a timer.
  const conversations = useChatStore((s) => s.conversations);
  const loading = useChatStore((s) => s.conversationsLoading);
  const loaded = useChatStore((s) => s.conversationsLoaded);
  const isFetchingMore = useChatStore((s) => s.conversationsFetchingMore);
  const hasMore = useChatStore((s) => s.conversationsHasMore);
  const fetchConversations = useChatStore((s) => s.fetchConversations);
  const removeConversation = useChatStore((s) => s.removeConversation);

  useEffect(() => {
    if (!chatToken || loaded) return;
    fetchConversations({ reset: true });
  }, [chatToken, loaded, fetchConversations]);

  useEffect(() => {
    const unsub = chatEvents.on("conversation:deleted", (deletedUserId) => {
      removeConversation(deletedUserId);
    });
    return unsub;
  }, [removeConversation]);

  const handleSearchTextChange = useCallback(
    (text) => {
      setSearchText(text);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        momentumRef.current = true;
        fetchConversations({ reset: true, search: text, filter: activeFilter });
      }, 500);
    },
    [activeFilter, fetchConversations]
  );

  useEffect(
    () => () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    },
    []
  );

  const handleFilterSelect = useCallback(
    (filter) => {
      const next = activeFilter === filter ? null : filter;
      setActiveFilter(next);
      momentumRef.current = true;
      fetchConversations({ reset: true, search: searchText, filter: next });
    },
    [activeFilter, searchText, fetchConversations]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    momentumRef.current = true;
    try {
      await fetchConversations({ reset: true, search: searchText, filter: activeFilter });
    } finally {
      setIsRefreshing(false);
    }
  }, [searchText, activeFilter, fetchConversations]);

  const handleEndReached = useCallback(() => {
    if (momentumRef.current || !hasMore || isFetchingMore || loading) return;
    momentumRef.current = true;
    fetchConversations({ reset: false, search: searchText, filter: activeFilter });
  }, [hasMore, isFetchingMore, loading, searchText, activeFilter, fetchConversations]);

  // One stable callback for every row, so ChatRow's memo is never invalidated.
  const openRoom = useCallback(
    (item) => {
      navigation.navigate("ChatRoom", {
        userId: item.user?.id,
        userName: item.user?.name,
        userPhoto: item.user?.photo_url,
        isGroup: false,
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => (item.user?.id ? <ChatRow item={item} onPress={openRoom} /> : null),
    [openRoom]
  );

  const keyExtractor = useCallback(
    (item, index) => (item.user?.id != null ? `u-${item.user.id}` : `i-${index}`),
    []
  );

  const handleScrollBeginDrag = useCallback(() => {
    momentumRef.current = false;
  }, []);

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

        {loading && !loaded ? (
          <View style={styles.centered}>
            <Loading />
          </View>
        ) : conversations.length === 0 ? (
          <NoConversation />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            onEndReachedThreshold={0.1}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews
            onScrollBeginDrag={handleScrollBeginDrag}
            onMomentumScrollBegin={handleScrollBeginDrag}
            onEndReached={handleEndReached}
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
