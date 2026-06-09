import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useChatAuth } from "../../context/useChatAuth";
import { CHAT_API_URL } from "../../api/ApiUrl";
import ChatGroupMessagesByDate from "./ChatComponent/ChatGroupMessagesByDate";
import ChatRoomHeader from "./ChatComponent/ChatRoomHeader";
import ChatMessageItem from "./ChatComponent/ChatMessageItem";
import ChatInputBar from "./ChatComponent/ChatInputBar";

const POLL_INTERVAL = 5000;
const PAGE_SIZE = 30;

export default function ChatRoom() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, userName } = route.params ?? {};
  const { user, chatToken, refreshChatToken } = useChatAuth();

  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const flashListRef = useRef(null);
  const oldestIdRef = useRef(null);
  const pollTimerRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  const prevMessageCountRef = useRef(0);
  const isPrependRef = useRef(false);
  const getToken = useCallback(async () => {
    return chatToken ?? (await refreshChatToken());
  }, [chatToken, refreshChatToken]);

  const authHeaders = useCallback((token) => ({
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  }), []);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => {
      flashListRef.current?.scrollToEnd({ animated });
    }, 100);
  }, []);

  const markAsRead = useCallback(
    async (token, convs) => {
      try {
        const unreadIds = convs
          .filter((m) => m.status === 0 && m.from_id !== user?.id)
          .map((m) => m.id);
        if (!unreadIds.length) return;
        await fetch(`${CHAT_API_URL}/read-message`, {
          method: "POST",
          headers: authHeaders(token),
          body: JSON.stringify({ ids: unreadIds, is_group: 0 }),
        });
      } catch (e) {
        console.error("markAsRead error", e);
      }
    },
    [user?.id, authHeaders]
  );

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${CHAT_API_URL}/users/${userId}/conversation`, {
        headers: authHeaders(token),
      });

      if (res.status === 401) {
        const newToken = await refreshChatToken();
        if (newToken) fetchMessages();
        return;
      }

      const data = await res.json();
      const convs = data?.data?.conversations ?? [];
      setUserInfo(data?.data?.user ?? null);
      if (convs.length > 0) {
        oldestIdRef.current = convs[convs.length - 1].id;
        setHasMore(convs.length >= PAGE_SIZE);
      } else {
        setHasMore(false);
      }

      const chronological = [...convs].reverse();
      prevMessageCountRef.current = chronological.length;
      setMessages(chronological);
      markAsRead(token, convs);
      isFirstLoadRef.current = true;
    } catch (e) {
      console.error("fetchMessages error", e);
    } finally {
      setLoading(false);
    }
  }, [userId, getToken, authHeaders, refreshChatToken, markAsRead]);

  const pollNewMessages = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${CHAT_API_URL}/users/${userId}/conversation`, {
        headers: authHeaders(token),
      });
      if (!res.ok) return;

      const data = await res.json();
      const convs = data?.data?.conversations ?? [];
      if (!convs.length) return;

      setMessages((prev) => {
        const latestKnownId = prev.length > 0 ? prev[prev.length - 1].id : 0;
        const fresh = convs.filter((m) => m.id > latestKnownId);
        if (!fresh.length) return prev;
        return [...prev, ...fresh.reverse()];
      });

      markAsRead(token, convs);
    } catch (e) {
      console.error("pollNewMessages error", e);
    }
  }, [userId, getToken, authHeaders, markAsRead]);

  const loadOlderMessages = useCallback(async () => {
    if (loadingMore || !hasMore || !oldestIdRef.current) return;
    try {
      setLoadingMore(true);
      const token = await getToken();
      const res = await fetch(`${CHAT_API_URL}/users/${userId}/conversation?before=${oldestIdRef.current}`,
        { headers: authHeaders(token) }
      );
      const data = await res.json();
      const older = data?.data?.conversations ?? [];
      if (!older.length) {
        setHasMore(false);
        return;
      }

      oldestIdRef.current = older[older.length - 1].id;
      setHasMore(older.length >= PAGE_SIZE);
      const chronologicalOlder = [...older].reverse();

      // Set the flag BEFORE setState so the useEffect sees it synchronously
      isPrependRef.current = true;
      setMessages((prev) => [...chronologicalOlder, ...prev]);
    } catch (e) {
      console.error("loadOlderMessages error", e);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, userId, getToken, authHeaders]);

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text || sending) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      from_id: user?.id,
      to_id: userId,
      message: text,
      message_type: 0,
      status: 0,
      created_at: new Date().toISOString(),
      _sending: true,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInputText("");
    scrollToBottom(true);

    try {
      setSending(true);
      const token = await getToken();
      const res = await fetch(`${CHAT_API_URL}/send-message`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          to_id: String(userId),
          message: text,
          message_type: 0,
        }),
      });

      const data = await res.json();
      const sent = data?.data?.message ?? null;

      setMessages((prev) => prev.map((m) => m.id === tempId ? { ...(sent ?? m), _sending: false } : m));
    } catch (e) {
      console.error("sendMessage error", e);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  }, [inputText, sending, user?.id, userId, getToken, authHeaders, scrollToBottom]);

  useEffect(() => {
    if (!chatToken) return;
    fetchMessages();
  }, [chatToken]);

  useEffect(() => {
    if (loading) return;
    pollTimerRef.current = setInterval(pollNewMessages, POLL_INTERVAL);
    return () => clearInterval(pollTimerRef.current);
  }, [loading, pollNewMessages]);

  useEffect(() => {
    if (messages.length === 0) return;
    if (messages.length > prevMessageCountRef.current) {
      if (isPrependRef.current) {
        isPrependRef.current = false;
      } else {
        scrollToBottom(true);
      }
    }

    prevMessageCountRef.current = messages.length;
  }, [messages.length, scrollToBottom]);

  const groupedData = useMemo(
    () => ChatGroupMessagesByDate(messages),
    [messages]
  );

  const renderItem = useCallback(({ item }) =>
    <ChatMessageItem item={item} myId={user?.id} />,
    [user?.id]
  );

  const keyExtractor = useCallback((item) => item.id?.toString() ?? item.day, []);

  const handleScroll = useCallback(({ nativeEvent }) => {
    if (nativeEvent.contentOffset.y < 300 && hasMore && !loadingMore) {
      loadOlderMessages();
    }
  }, [hasMore, loadingMore, loadOlderMessages]);

  const ListHeaderComponent = useMemo(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadMoreWrap}>
        <ActivityIndicator color="#e87b7b" size="small" />
      </View>
    );
  }, [loadingMore]);

  const isOnline = userInfo?.is_online ?? false;
  const displayName = userInfo?.name ?? userName ?? "User";
  const displayPhoto = userInfo?.photo_url ?? null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <ChatRoomHeader
        navigation={navigation}
        displayName={displayName}
        displayPhoto={displayPhoto}
        isOnline={isOnline}
        lastSeen={userInfo?.last_seen}
        userId={userId}
        chatToken={chatToken}
        isBlockedByAuthUser={userInfo?.is_blocked_by_auth_user}
        refreshChat={fetchMessages}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#e87b7b" size="large" />
          </View>
        ) : (
          <FlashList
            ref={flashListRef}
            data={groupedData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={60}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            onScroll={handleScroll}
            scrollEventThrottle={200}
            ListHeaderComponent={ListHeaderComponent}
            maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
            onLayout={() => {
              if (isFirstLoadRef.current) {
                scrollToBottom(false);
                isFirstLoadRef.current = false;
              }
            }}
          />
        )}

        <ChatInputBar
          value={inputText}
          onChangeText={setInputText}
          onSend={sendMessage}
          sending={sending}
          isBlockedByAuthUser={userInfo?.is_blocked_by_auth_user}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
    backgroundColor: "#222222",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  loadMoreWrap: {
    paddingVertical: 12,
    alignItems: "center",
  },
});