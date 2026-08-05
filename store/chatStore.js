import { create } from "zustand";
import { CHAT_API_URL } from "../api/ApiUrl";

/**
 * Single source of truth for chat.
 *
 * Both ChatList and ChatRoom read from here and dispatch into here; neither
 * fetches on its own and neither polls. Real-time events from Echo land in the
 * `apply*` reducers, which are deliberately pure-ish and keyed by peer id so a
 * message arriving for a room that is not currently open still updates the
 * conversation list.
 *
 * Message arrays are stored chronologically (oldest first), which is the order
 * FlashList renders and the order the UI reads.
 */

const PAGE_LIMIT = 10; // conversations per page
const PAGE_SIZE = 30; // messages per page

// Broadcast payload `type` values — mirrors the constants on the backend User model.
export const BROADCAST_TYPE = {
  BLOCK_UNBLOCK: 1,
  NEW_PRIVATE_CONVERSATION: 2,
  ADDED_TO_GROUP: 3,
  PRIVATE_MESSAGE_READ: 4,
  MESSAGE_DELETED: 5,
  MESSAGE_NOTIFICATION: 6,
  CHAT_REQUEST: 7,
  CHAT_REQUEST_ACCEPTED: 8,
};

const emptyRoom = () => ({
  loading: false,
  loadingMore: false,
  hasMore: true,
  oldestId: null,
  loaded: false,
  userInfo: null,
});

/** Merge a message into a chronological list, deduping by server id then client id. */
const mergeMessage = (list, incoming) => {
  const byId = incoming.id != null && list.some((m) => String(m.id) === String(incoming.id));
  if (byId) {
    return list.map((m) => (String(m.id) === String(incoming.id) ? { ...m, ...incoming } : m));
  }

  if (incoming._clientId) {
    const idx = list.findIndex((m) => m._clientId && m._clientId === incoming._clientId);
    if (idx !== -1) {
      const next = [...list];
      next[idx] = { ...next[idx], ...incoming };
      return next;
    }
  }

  return [...list, incoming];
};

export const useChatStore = create((set, get) => ({
  // ---- auth ------------------------------------------------------------
  token: null,
  userId: null,
  refreshToken: null,

  setAuth: ({ token, userId, refreshToken }) =>
    set((s) => ({
      token: token ?? s.token,
      userId: userId ?? s.userId,
      refreshToken: refreshToken ?? s.refreshToken,
    })),

  // ---- connection ------------------------------------------------------
  connectionState: "disconnected",
  setConnectionState: (connectionState) => set({ connectionState }),

  // ---- conversation list ----------------------------------------------
  conversations: [],
  conversationsLoaded: false,
  conversationsLoading: false,
  conversationsFetchingMore: false,
  conversationsHasMore: true,
  conversationsOffset: 0,
  // Last search/filter used, so a reconnect resync re-runs the query the user
  // is actually looking at instead of resetting them to the unfiltered list.
  conversationsQuery: { search: "", filter: null },

  // ---- rooms -----------------------------------------------------------
  messages: {}, // { [peerId]: Message[] } oldest-first
  rooms: {}, // { [peerId]: roomMeta }
  activePeerId: null,

  /**
   * Authenticated fetch that transparently refreshes an expired chat token once.
   */
  apiFetch: async (path, options = {}, retry = true) => {
    const { token, refreshToken } = get();
    const activeToken = token;

    const isForm = options.body instanceof FormData;

    const res = await fetch(`${CHAT_API_URL}/${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${activeToken}`,
        Accept: "application/json",
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(options.headers ?? {}),
      },
    });

    if (res.status === 401 && retry && refreshToken) {
      const fresh = await refreshToken();
      if (fresh) {
        set({ token: fresh });
        return get().apiFetch(path, options, false);
      }
    }

    return res;
  },

  // ---------------------------------------------------------------------
  // Conversation list
  // ---------------------------------------------------------------------
  fetchConversations: async ({ reset = true, search = "", filter = null } = {}) => {
    const state = get();
    if (!state.token) return;
    if (reset ? state.conversationsLoading : state.conversationsFetchingMore) return;

    const offset = reset ? 0 : state.conversationsOffset + PAGE_LIMIT;

    set(
      reset
        ? { conversationsLoading: true, conversationsQuery: { search, filter } }
        : { conversationsFetchingMore: true }
    );

    try {
      const params = new URLSearchParams({ offset: String(offset) });
      if (search.trim()) params.append("search", search);
      if (filter === "archived") params.append("isArchived", "1");
      else if (filter) params.append("filter", filter);

      const res = await get().apiFetch(`conversations?${params}`);
      if (!res.ok) return;

      const data = await res.json();
      const fresh = data?.data?.conversations ?? [];

      set((s) => ({
        conversations: reset
          ? fresh
          : (() => {
              const seen = new Set(s.conversations.map((c) => c.user?.id));
              return [...s.conversations, ...fresh.filter((c) => !seen.has(c.user?.id))];
            })(),
        conversationsHasMore: fresh.length === PAGE_LIMIT,
        conversationsOffset: offset,
        conversationsLoaded: true,
      }));
    } catch (e) {
      console.error("[chatStore] fetchConversations", e);
    } finally {
      set(reset ? { conversationsLoading: false } : { conversationsFetchingMore: false });
    }
  },

  /** Drop a conversation locally after it is deleted server-side. */
  removeConversation: (peerId) =>
    set((s) => {
      const messages = { ...s.messages };
      const rooms = { ...s.rooms };
      delete messages[peerId];
      delete rooms[peerId];
      return {
        conversations: s.conversations.filter((c) => String(c.user?.id) !== String(peerId)),
        messages,
        rooms,
      };
    }),

  // ---------------------------------------------------------------------
  // Room
  // ---------------------------------------------------------------------
  fetchRoom: async (peerId, { silent = false } = {}) => {
    if (!peerId || !get().token) return;

    set((s) => ({
      rooms: {
        ...s.rooms,
        [peerId]: { ...(s.rooms[peerId] ?? emptyRoom()), loading: !silent },
      },
    }));

    try {
      const res = await get().apiFetch(`users/${peerId}/conversation`);
      if (!res.ok) return;

      const data = await res.json();
      const convs = data?.data?.conversations ?? [];
      const chronological = [...convs].reverse();

      set((s) => ({
        messages: { ...s.messages, [peerId]: chronological },
        rooms: {
          ...s.rooms,
          [peerId]: {
            ...(s.rooms[peerId] ?? emptyRoom()),
            loading: false,
            loaded: true,
            hasMore: convs.length >= PAGE_SIZE,
            oldestId: convs.length ? convs[convs.length - 1].id : null,
            userInfo: data?.data?.user ?? s.rooms[peerId]?.userInfo ?? null,
          },
        },
      }));

      get().markRead(peerId);
    } catch (e) {
      console.error("[chatStore] fetchRoom", e);
      set((s) => ({
        rooms: { ...s.rooms, [peerId]: { ...(s.rooms[peerId] ?? emptyRoom()), loading: false } },
      }));
    }
  },

  loadOlderMessages: async (peerId) => {
    const meta = get().rooms[peerId];
    if (!meta || meta.loadingMore || !meta.hasMore || !meta.oldestId) return;

    set((s) => ({
      rooms: { ...s.rooms, [peerId]: { ...s.rooms[peerId], loadingMore: true } },
    }));

    try {
      const res = await get().apiFetch(`users/${peerId}/conversation?before=${meta.oldestId}`);
      if (!res.ok) return;

      const data = await res.json();
      const older = data?.data?.conversations ?? [];

      if (!older.length) {
        set((s) => ({
          rooms: { ...s.rooms, [peerId]: { ...s.rooms[peerId], hasMore: false, loadingMore: false } },
        }));
        return;
      }

      set((s) => ({
        messages: {
          ...s.messages,
          [peerId]: [...[...older].reverse(), ...(s.messages[peerId] ?? [])],
        },
        rooms: {
          ...s.rooms,
          [peerId]: {
            ...s.rooms[peerId],
            loadingMore: false,
            hasMore: older.length >= PAGE_SIZE,
            oldestId: older[older.length - 1].id,
          },
        },
      }));
    } catch (e) {
      console.error("[chatStore] loadOlderMessages", e);
      set((s) => ({
        rooms: { ...s.rooms, [peerId]: { ...s.rooms[peerId], loadingMore: false } },
      }));
    }
  },

  markRead: async (peerId) => {
    const { userId, messages } = get();
    const list = messages[peerId] ?? [];

    const unreadIds = list
      .filter((m) => m.status === 0 && String(m.from_id) !== String(userId) && !m._clientId)
      .map((m) => m.id);

    // Clear the badge immediately — the server call only persists it.
    if (unreadIds.length) {
      set((s) => ({
        conversations: s.conversations.map((c) =>
          String(c.user?.id) === String(peerId) ? { ...c, unread_count: 0 } : c
        ),
      }));
    } else {
      return;
    }

    try {
      await get().apiFetch("read-message", {
        method: "POST",
        body: JSON.stringify({ ids: unreadIds, is_group: 0 }),
      });

      set((s) => ({
        messages: {
          ...s.messages,
          [peerId]: (s.messages[peerId] ?? []).map((m) =>
            unreadIds.includes(m.id) ? { ...m, status: 1 } : m
          ),
        },
      }));
    } catch (e) {
      console.error("[chatStore] markRead", e);
    }
  },

  // ---------------------------------------------------------------------
  // Sending
  // ---------------------------------------------------------------------
  sendText: async (peerId, text, replyMessage = null) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const { userId } = get();
    const clientId = `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const optimistic = {
      id: clientId,
      _clientId: clientId,
      _sending: true,
      from_id: userId,
      to_id: peerId,
      message: trimmed,
      message_type: 0,
      status: 0,
      created_at: new Date().toISOString(),
      reply_to: replyMessage?.id ?? null,
      reply_message: replyMessage ?? null,
    };

    set((s) => ({
      messages: { ...s.messages, [peerId]: [...(s.messages[peerId] ?? []), optimistic] },
    }));
    get().bumpConversation(peerId, optimistic, { incrementUnread: false });

    try {
      const res = await get().apiFetch("send-message", {
        method: "POST",
        body: JSON.stringify({
          to_id: String(peerId),
          message: trimmed,
          message_type: 0,
          reply_to: replyMessage?.id ?? null,
        }),
      });

      const data = await res.json();
      const sent = data?.data?.message ?? null;

      if (!res.ok || !sent) throw new Error(data?.message ?? "send failed");

      set((s) => ({
        messages: {
          ...s.messages,
          [peerId]: (s.messages[peerId] ?? []).map((m) =>
            m._clientId === clientId
              ? {
                  ...sent,
                  _clientId: clientId,
                  _sending: false,
                  reply_message: sent.reply_message ?? replyMessage,
                }
              : m
          ),
        },
      }));
    } catch (e) {
      console.error("[chatStore] sendText", e);
      set((s) => ({
        messages: {
          ...s.messages,
          [peerId]: (s.messages[peerId] ?? []).map((m) =>
            m._clientId === clientId ? { ...m, _sending: false, _failed: true } : m
          ),
        },
      }));
    }
  },

  sendFiles: async (peerId, files) => {
    if (!files?.length) return;

    const { userId } = get();

    const optimistic = files.map((file) => ({
      id: file.tempId,
      _clientId: file.tempId,
      _sending: true,
      _localUri: file.uri,
      from_id: userId,
      to_id: peerId,
      message: null,
      message_type: -1,
      file_name: file.name,
      attachment: file.uri,
      created_at: new Date().toISOString(),
    }));

    set((s) => ({
      messages: { ...s.messages, [peerId]: [...(s.messages[peerId] ?? []), ...optimistic] },
    }));

    await Promise.allSettled(
      files.map(async (file) => {
        try {
          const form = new FormData();
          form.append("file[]", {
            uri: file.uri,
            name: file.name,
            type: file.mimeType ?? "application/octet-stream",
          });

          const uploadRes = await get().apiFetch("file-upload", { method: "POST", body: form });
          if (!uploadRes.ok) throw new Error(`upload failed (${uploadRes.status})`);

          const uploaded = (await uploadRes.json())?.data?.[0];
          if (!uploaded) throw new Error("upload returned no data");

          const sendRes = await get().apiFetch("send-message", {
            method: "POST",
            body: JSON.stringify({
              to_id: String(peerId),
              message: uploaded.attachment,
              message_type: uploaded.message_type,
              file_name: uploaded.file_name,
              unique_code: uploaded.unique_code,
            }),
          });

          const sent = (await sendRes.json())?.data?.message;
          if (!sent) throw new Error("send returned no message");

          set((s) => ({
            messages: {
              ...s.messages,
              [peerId]: (s.messages[peerId] ?? []).map((m) =>
                m._clientId === file.tempId
                  ? { ...sent, _clientId: file.tempId, _sending: false, _localUri: file.uri }
                  : m
              ),
            },
          }));

          get().bumpConversation(peerId, sent, { incrementUnread: false });
        } catch (e) {
          console.error("[chatStore] sendFiles", file.name, e);
          set((s) => ({
            messages: {
              ...s.messages,
              [peerId]: (s.messages[peerId] ?? []).map((m) =>
                m._clientId === file.tempId ? { ...m, _sending: false, _failed: true } : m
              ),
            },
          }));
        }
      })
    );
  },

  deleteMessage: async (peerId, message, forEveryone = false) => {
    if (!message?.id) return { ok: false, message: "Missing message." };

    const list = get().messages[peerId] ?? [];
    const idx = list.findIndex((m) => String(m.id) === String(message.id));
    const previousMessageId = idx > 0 ? list[idx - 1].id : null;

    const path = forEveryone
      ? `conversations/${message.id}/delete`
      : `conversations/message/${message.id}/delete`;

    try {
      const res = await get().apiFetch(path, {
        method: "POST",
        body: JSON.stringify({ previousMessageId }),
      });
      const data = await res.json();

      if (!res.ok) return { ok: false, message: data?.message ?? "Failed to delete message." };

      set((s) => ({
        messages: {
          ...s.messages,
          [peerId]: (s.messages[peerId] ?? []).filter(
            (m) => String(m.id) !== String(message.id)
          ),
        },
      }));

      return { ok: true, message: data?.message ?? "Message deleted successfully." };
    } catch (e) {
      console.error("[chatStore] deleteMessage", e);
      return { ok: false, message: "Something went wrong. Please try again." };
    }
  },

  // ---------------------------------------------------------------------
  // Conversation-list maintenance
  // ---------------------------------------------------------------------
  /**
   * Move a peer's conversation to the top with a new last message.
   * Always runs, including for the room the user is currently viewing — the
   * unread badge and preview must stay correct; only the *notification* is
   * suppressed elsewhere.
   */
  bumpConversation: (peerId, message, { incrementUnread = false, user = null } = {}) =>
    set((s) => {
      const idx = s.conversations.findIndex((c) => String(c.user?.id) === String(peerId));

      if (idx === -1) {
        // Unknown peer (first ever message) — insert a stub; the next list
        // fetch will fill in anything missing.
        if (!user) return {};
        return {
          conversations: [
            {
              id: message.id,
              user,
              message: message.message,
              message_type: message.message_type,
              created_at: message.created_at,
              unread_count: incrementUnread ? 1 : 0,
            },
            ...s.conversations,
          ],
        };
      }

      const existing = s.conversations[idx];

      // The API derives unread_count with MySQL `sum(...)`, which PDO returns
      // as a *string* ("0", "1"). Adding to it without coercing concatenates —
      // "0" + 1 = "01", then "011" — so coerce before counting.
      const currentUnread = Number(existing.unread_count ?? 0) || 0;

      const updated = {
        ...existing,
        id: message.id ?? existing.id,
        message: message.message,
        message_type: message.message_type,
        created_at: message.created_at,
        unread_count: incrementUnread ? currentUnread + 1 : currentUnread,
      };

      const next = [...s.conversations];
      next.splice(idx, 1);
      return { conversations: [updated, ...next] };
    }),

  // ---------------------------------------------------------------------
  // Real-time reducers — fed by useChatRealtime
  // ---------------------------------------------------------------------
  /** A new message arrived over the socket. Returns true if it was new. */
  applyIncomingMessage: (payload) => {
    const { userId, activePeerId } = get();
    const peerId = String(payload.from_id) === String(userId) ? payload.to_id : payload.from_id;

    const existing = get().messages[peerId] ?? [];
    const alreadyKnown = existing.some((m) => String(m.id) === String(payload.id));

    if (!alreadyKnown) {
      set((s) => ({
        messages: { ...s.messages, [peerId]: mergeMessage(s.messages[peerId] ?? [], payload) },
      }));
    }

    const isViewing = String(activePeerId) === String(peerId);

    get().bumpConversation(peerId, payload, {
      incrementUnread: !isViewing && String(payload.from_id) !== String(userId),
      user: payload.sender
        ? {
            id: payload.sender.id,
            name: payload.sender.name,
            photo_url: payload.sender.photo_url,
          }
        : null,
    });

    // Reading the room we are looking at keeps the peer's ticks accurate.
    if (isViewing && String(payload.from_id) !== String(userId)) {
      get().markRead(peerId);
    }

    return !alreadyKnown;
  },

  applyReadReceipt: (payload) => {
    const ids = (payload.ids ?? []).map(String);
    if (!ids.length) return;

    set((s) => {
      const messages = { ...s.messages };
      for (const peerId of Object.keys(messages)) {
        let touched = false;
        const next = messages[peerId].map((m) => {
          if (ids.includes(String(m.id)) && m.status !== 1) {
            touched = true;
            return { ...m, status: 1 };
          }
          return m;
        });
        if (touched) messages[peerId] = next;
      }
      return { messages };
    });
  },

  applyMessageDeleted: (payload) => {
    const id = payload?.id;
    if (id == null) return;

    set((s) => {
      const messages = { ...s.messages };
      for (const peerId of Object.keys(messages)) {
        const next = messages[peerId].filter((m) => String(m.id) !== String(id));
        if (next.length !== messages[peerId].length) messages[peerId] = next;
      }
      return { messages };
    });
  },

  /**
   * Called after the socket reconnects: re-sync anything missed while down.
   * Cheap because it only refetches the list plus the open room.
   */
  resyncAfterReconnect: async () => {
    const { activePeerId, conversationsLoaded, conversationsQuery } = get();
    if (conversationsLoaded) {
      await get().fetchConversations({ reset: true, ...conversationsQuery });
    }
    if (activePeerId) await get().fetchRoom(activePeerId, { silent: true });
  },

  setActivePeerId: (activePeerId) => set({ activePeerId }),

  reset: () =>
    set({
      conversations: [],
      conversationsLoaded: false,
      conversationsOffset: 0,
      conversationsHasMore: true,
      messages: {},
      rooms: {},
      activePeerId: null,
    }),
}));
