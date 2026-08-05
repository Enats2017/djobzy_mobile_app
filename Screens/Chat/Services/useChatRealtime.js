import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useChatStore, BROADCAST_TYPE } from "../../../store/chatStore";
import { connectEcho, disconnectEcho, resumeEcho, onConnectionState } from "./chatEcho";
import { leaveChatRoom } from "./chatPresence";
import { chatEvents } from "./chatEvents";

/**
 * Owns the chat socket for the whole app.
 *
 * Mounted once (from ChatProvider), it subscribes to the authenticated user's
 * private channel — the same `private-user.{id}` the web client already uses —
 * and routes every broadcast into the store. Nothing polls.
 */
export const useChatRealtime = ({ token, userId, refreshToken }) => {
  const wasDisconnectedRef = useRef(false);
  const channelRef = useRef(null);

  // Keep the store's auth in sync so its actions can fetch on their own.
  useEffect(() => {
    useChatStore.getState().setAuth({ token, userId, refreshToken });
  }, [token, userId, refreshToken]);

  // ---- socket + channel subscription ----------------------------------
  useEffect(() => {
    if (!token || !userId) return;

    const echo = connectEcho(token, () => {
      // Channel auth was rejected — refresh the token; the effect re-runs and
      // rebuilds the socket with the new one.
      refreshToken?.();
    });
    if (!echo) return;

    const store = useChatStore.getState();
    const channel = echo.private(`user.${userId}`);
    channelRef.current = channel;

    const handleUserEvent = (payload) => {
      if (!payload) return;

      switch (payload.type) {
        case BROADCAST_TYPE.NEW_PRIVATE_CONVERSATION:
        case BROADCAST_TYPE.CHAT_REQUEST: {
          const isNew = useChatStore.getState().applyIncomingMessage(payload);

          // In-app notification is suppressed only for the room currently open;
          // every other conversation notifies as normal. The unread badge and
          // last-message preview were already updated above either way.
          const activePeerId = useChatStore.getState().activePeerId;
          const fromSelf = String(payload.from_id) === String(userId);
          const isActiveRoom = String(activePeerId) === String(payload.from_id);

          if (isNew && !fromSelf && !isActiveRoom) {
            chatEvents.emit("message:notify", payload);
          }
          break;
        }

        case BROADCAST_TYPE.PRIVATE_MESSAGE_READ:
          useChatStore.getState().applyReadReceipt(payload);
          break;

        case BROADCAST_TYPE.MESSAGE_DELETED:
          useChatStore.getState().applyMessageDeleted(payload);
          break;

        case BROADCAST_TYPE.BLOCK_UNBLOCK:
          chatEvents.emit("user:block-changed", payload);
          break;

        default:
          break;
      }
    };

    // Laravel broadcasts the FQCN as the Pusher event name. The leading dot
    // tells Echo's event formatter to use the name verbatim instead of
    // prefixing its default `App.Events` namespace. Bind exactly once —
    // `.App\Events\UserEvent` and `UserEvent` both resolve to this same event,
    // so listening for both would double-count unread badges.
    channel.listen(".App\\Events\\UserEvent", handleUserEvent);

    channel.error?.((err) => {
      console.warn("[useChatRealtime] channel error", err);
      // Subscription failed — fall back to a one-time REST refresh so the UI
      // is not left stale while the socket retries.
      store.resyncAfterReconnect();
    });

    return () => {
      try {
        echo.leave(`user.${userId}`);
      } catch (e) {
        console.warn("[useChatRealtime] leave failed", e);
      }
      channelRef.current = null;
    };
  }, [token, userId, refreshToken]);

  // ---- connection state -> store + reconnect resync --------------------
  useEffect(() => {
    return onConnectionState((state) => {
      useChatStore.getState().setConnectionState(state);

      if (state === "unavailable" || state === "failed" || state === "disconnected") {
        wasDisconnectedRef.current = true;
      }

      // Recovered after a drop — pull anything the socket missed.
      if (state === "connected" && wasDisconnectedRef.current) {
        wasDisconnectedRef.current = false;
        useChatStore.getState().resyncAfterReconnect();
      }
    });
  }, []);

  // ---- app foreground / background -------------------------------------
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        resumeEcho();
        // The OS may have frozen the socket without a clean close; resync.
        useChatStore.getState().resyncAfterReconnect();
        return;
      }

      if (next === "background" || next === "inactive") {
        // Backgrounding means the user is no longer "in" the room, so pushes
        // for it must resume immediately even though the screen is still mounted.
        const { token: t } = useChatStore.getState();
        leaveChatRoom(t);
      }
    });

    return () => sub.remove();
  }, []);

  // ---- teardown on logout ----------------------------------------------
  useEffect(() => {
    if (token) return;
    disconnectEcho();
    useChatStore.getState().reset();
  }, [token]);

  useEffect(() => () => disconnectEcho(), []);
};
