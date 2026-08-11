import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  AppState,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useShallow } from "zustand/react/shallow";
import { useChatAuth } from "../../context/useChatAuth";
import { useChatStore } from "../../store/chatStore";
import { enterChatRoom, leaveChatRoom } from "./Services/chatPresence";
import ChatGroupMessagesByDate from "./ChatComponent/ChatGroupMessagesByDate";
import ChatRoomHeader from "./ChatComponent/ChatRoomHeader";
import ChatMessageItem from "./ChatComponent/ChatMessageItem";
import ChatInputBar from "./ChatComponent/ChatInputBar";
import { useKeyboardState } from "../../utils/useKeyboardState";
import { toastError, toastSuccess } from "../../utils/toast";

const EMPTY_MESSAGES = [];

export default function ChatRoom() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId: peerId, userName } = route.params ?? {};
  const { user, chatToken } = useChatAuth();

  const [inputText, setInputText] = useState("");
  const [replyMessage, setReplyMessage] = useState(null);
  const [sending, setSending] = useState(false);

  const keyboard = useKeyboardState();

  // Subscribe narrowly: this screen re-renders on its own room only, never on
  // conversation-list churn from other chats.
  const messages = useChatStore((s) => s.messages[peerId] ?? EMPTY_MESSAGES);
  const room = useChatStore(
    useShallow((s) => ({
      loading: s.rooms[peerId]?.loading ?? false,
      loadingMore: s.rooms[peerId]?.loadingMore ?? false,
      hasMore: s.rooms[peerId]?.hasMore ?? true,
      loaded: s.rooms[peerId]?.loaded ?? false,
      userInfo: s.rooms[peerId]?.userInfo ?? null,
    }))
  );

  // Actions are stable references on the store — safe to read once.
  const fetchRoom = useChatStore((s) => s.fetchRoom);
  const loadOlderMessages = useChatStore((s) => s.loadOlderMessages);
  const sendText = useChatStore((s) => s.sendText);
  const sendFilesAction = useChatStore((s) => s.sendFiles);
  const deleteMessageAction = useChatStore((s) => s.deleteMessage);
  const setActivePeerId = useChatStore((s) => s.setActivePeerId);
  const markRead = useChatStore((s) => s.markRead);

  // ---- load history ------------------------------------------------------
  useEffect(() => {
    if (!chatToken || !peerId) return;
    // Silent when we already have cached messages: the list stays on screen and
    // refreshes underneath instead of flashing a spinner on re-entry.
    fetchRoom(peerId, { silent: room.loaded });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatToken, peerId]);

  // ---- presence: suppress notifications for this room only ---------------
  useFocusEffect(
    useCallback(() => {
      if (!peerId) return;

      setActivePeerId(peerId);
      if (chatToken) enterChatRoom(peerId, chatToken);
      markRead(peerId);

      // Backgrounding clears presence (so pushes resume immediately), which
      // means returning to the foreground on this same screen has to re-assert
      // it — useFocusEffect does not re-run on an app state change.
      const sub = AppState.addEventListener("change", (next) => {
        if (next === "active" && chatToken) enterChatRoom(peerId, chatToken);
      });

      return () => {
        sub.remove();
        setActivePeerId(null);
        // Scoped to this peer: navigating A -> B can deliver A's blur after
        // B's focus, and an unscoped leave would cancel B's presence.
        leaveChatRoom(chatToken, peerId);
      };
    }, [peerId, chatToken, setActivePeerId, markRead])
  );

  // ---- send --------------------------------------------------------------
  const handleSend = useCallback(async () => {
    const text = inputText;
    if (!text.trim() || sending) return;

    // Clear the composer immediately — the optimistic message is already in the
    // store, so the user never sees their text sitting in the box.
    setInputText("");
    const reply = replyMessage;
    setReplyMessage(null);

    setSending(true);
    try {
      await sendText(peerId, text, reply);
    } finally {
      setSending(false);
    }
  }, [inputText, sending, replyMessage, peerId, sendText]);

  /**
   * Returns the send outcome to the composer, which uses it to decide whether a
   * typed message alongside the attachment should follow it out.
   */
  const handleSendFiles = useCallback(
    async (files, onDone) => {
      // The optimistic bubbles are already in the list, so the preview strip has
      // done its job and is cleared straight away rather than duplicating them.
      onDone();
      const result = await sendFilesAction(peerId, files);
      if (result?.message) toastError(result.message);
      return result;
    },
    [peerId, sendFilesAction]
  );

  const handleDelete = useCallback(
    async (message) => {
      const result = await deleteMessageAction(peerId, message, false);
      result.ok ? toastSuccess(result.message) : toastError(result.message);
    },
    [peerId, deleteMessageAction]
  );

  const handleDeleteForEveryone = useCallback(
    async (message) => {
      const result = await deleteMessageAction(peerId, message, true);
      result.ok ? toastSuccess(result.message) : toastError(result.message);
    },
    [peerId, deleteMessageAction]
  );

  const handleReply = useCallback((message) => setReplyMessage(message), []);
  const handleCancelReply = useCallback(() => setReplyMessage(null), []);

  const handleRefresh = useCallback(
    () => fetchRoom(peerId, { silent: true }),
    [peerId, fetchRoom]
  );

  // ---- list --------------------------------------------------------------
  const groupedData = useMemo(() => ChatGroupMessagesByDate(messages), [messages]);

  const displayName = room.userInfo?.name ?? userName ?? "User";

  const renderItem = useCallback(
    ({ item }) => (
      <ChatMessageItem
        item={item}
        myId={user?.id}
        onDelete={handleDelete}
        onReply={handleReply}
        otherUserName={displayName}
        onDeleteFromEveryone={handleDeleteForEveryone}
      />
    ),
    [user?.id, handleDelete, handleReply, displayName, handleDeleteForEveryone]
  );

  const keyExtractor = useCallback(
    (item) => (item.id != null ? String(item.id) : `day-${item.day}`),
    []
  );

  const handleStartReached = useCallback(() => {
    if (room.hasMore && !room.loadingMore) loadOlderMessages(peerId);
  }, [room.hasMore, room.loadingMore, loadOlderMessages, peerId]);

  const ListHeaderComponent = useMemo(
    () =>
      room.loadingMore ? (
        <View style={styles.loadMoreWrap}>
          <ActivityIndicator color="#e87b7b" size="small" />
        </View>
      ) : null,
    [room.loadingMore]
  );

  /**
   * FlashList v2 anchors the list itself: it keeps the bottom pinned when the
   * user is already near the bottom, and holds scroll position when older
   * messages are prepended. That replaces the old manual scrollToEnd timer,
   * which is what caused the jumping — and it means scrolling up to read
   * history is no longer interrupted by incoming messages.
   */
  const maintainVisibleContentPosition = useMemo(
    () => ({
      autoscrollToBottomThreshold: 0.2,
      startRenderingFromBottom: true,
      animateAutoScrollToBottom: true,
    }),
    []
  );

  const showSpinner = room.loading && !room.loaded;

  // Android only: iOS gets the same lift from KeyboardAvoidingView below, and
  // applying both would double-count. The reported height already spans the
  // navigation-bar area, which is why ChatInputBar drops its safe-area inset to
  // 0 while the keyboard is visible instead of adding to this.
  const keyboardPad = Platform.OS === "android" ? keyboard.height : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ChatRoomHeader
        navigation={navigation}
        displayName={displayName}
        displayPhoto={room.userInfo?.photo_url ?? null}
        isOnline={room.userInfo?.is_online ?? false}
        lastSeen={room.userInfo?.last_seen}
        userId={peerId}
        chatToken={chatToken}
        isBlockedByAuthUser={room.userInfo?.is_blocked_by_auth_user}
        refreshChat={handleRefresh}
      />

      {/*
        This app runs edge-to-edge (app.json `edgeToEdgeEnabled: true`), and
        under edge-to-edge Android IGNORES windowSoftInputMode=adjustResize —
        the window never resizes, so nothing lifts the input on its own.

        So we lift it ourselves by the measured keyboard height. Unlike the
        original KeyboardAvoidingView behavior="height", this is driven by a
        single value that is reset to 0 on keyboardDidHide and on unmount, so
        the space is always released — that was the dead-gap bug.

        iOS is not affected by edge-to-edge and animates smoothly with the
        native padding behaviour, so it keeps using KeyboardAvoidingView.
      */}
      <KeyboardAvoidingView
        style={[styles.flex, { paddingBottom: keyboardPad }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={Platform.OS === "ios"}
        keyboardVerticalOffset={0}
      >
        {showSpinner ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#e87b7b" size="large" />
          </View>
        ) : (
          <FlashList
            data={groupedData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            onStartReached={handleStartReached}
            onStartReachedThreshold={0.3}
            ListHeaderComponent={ListHeaderComponent}
            maintainVisibleContentPosition={maintainVisibleContentPosition}
          />
        )}

        <ChatInputBar
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          onSendFiles={handleSendFiles}
          sending={sending}
          isBlockedByAuthUser={room.userInfo?.is_blocked_by_auth_user}
          replyMessage={replyMessage}
          onCancelReply={handleCancelReply}
          keyboardVisible={keyboard.visible}
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
