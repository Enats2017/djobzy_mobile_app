import React, { useEffect } from "react";
import { ChatAuthProvider, useChatAuth } from "./useChatAuth";
import { useChatRealtime } from "../Screens/Chat/Services/useChatRealtime";
import { chatEvents } from "../Screens/Chat/Services/chatEvents";
import { navigate } from "../NavigationService";
import Toast from "react-native-toast-message";

/**
 * Owns the chat socket for the app.
 *
 * Split into two components so the realtime hook sits *inside* ChatAuthProvider
 * and can read the token from context.
 */
const ChatRealtimeMount = ({ children }) => {
  const { chatToken, user, refreshChatToken } = useChatAuth();

  useChatRealtime({
    token: chatToken,
    userId: user?.id,
    refreshToken: refreshChatToken,
  });

  // In-app toast for messages. useChatRealtime only emits this event for
  // conversations the user is *not* currently viewing, so the room on screen
  // stays quiet while every other chat still announces itself.
  useEffect(() => {
    return chatEvents.on("message:notify", (payload) => {
      const senderName = payload?.sender?.name;
      const preview =
        payload?.message_type !== 0 && payload?.message_type !== undefined
          ? "Sent an attachment"
          : (payload?.message ?? "").split(/<br\s*\/?>/i)[0].trim();

      Toast.show({
        type: "info",
        text1: senderName ? `${senderName} have sent you message` : "You have a new message",
        text2: preview,
        position: "top",
        onPress: () => {
          Toast.hide();
          navigate("ChatRoom", { userId: payload.from_id, isGroup: false });
        },
      });
    });
  }, []);

  return children;
};

export const ChatProvider = ({ children }) => (
  <ChatAuthProvider>
    <ChatRealtimeMount>{children}</ChatRealtimeMount>
  </ChatAuthProvider>
);

export default ChatProvider;
