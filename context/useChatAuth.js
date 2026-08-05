// context/useChatAuth.js
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, CHAT_API_URL } from '../api/ApiUrl';
import { useNotifications } from './MessageNotificationContext';

/**
 * Chat authentication, held once for the whole app.
 *
 * This used to be a bare hook, which meant every consumer (ChatList, ChatRoom,
 * ChatRoomHeader) ran its own bootstrap and kept its own copy of the token —
 * three token fetches and three sources of truth. It is now a context, so the
 * token is fetched once and shared.
 */

const ChatAuthContext = createContext({
    user: null,
    chatToken: null,
    loading: true,
    refreshChatToken: async () => null,
});

export const ChatAuthProvider = ({ children }) => {
    const [chatToken, setChatToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useNotifications();

    // Collapses concurrent refreshes (e.g. two 401s at once) into one request.
    const refreshInFlight = useRef(null);

    const refreshChatToken = useCallback(async () => {
        if (refreshInFlight.current) return refreshInFlight.current;

        refreshInFlight.current = (async () => {
            try {
                // Step 1: one-time token from the main project
                const token = await AsyncStorage.getItem('token');
                if (!token) return null;

                const res = await fetch(`${API_URL}/chat-token`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                const data = await res.json();

                // Step 2: auto-login to the chat project
                const chatRes = await fetch(`${CHAT_API_URL}/auto-login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        email: data.email,
                        token: data.token,
                    }),
                });
                const chatData = await chatRes.json();

                const chat_token = chatData.data?.token;
                if (!chat_token) {
                    console.error('[refreshChatToken] Chat token missing in response');
                    return null;
                }

                await AsyncStorage.setItem('chat_token', chat_token);
                setChatToken(chat_token);
                return chat_token;
            } catch (error) {
                console.error('[refreshChatToken] Error occurred:', error);
                return null;
            } finally {
                refreshInFlight.current = null;
            }
        })();

        return refreshInFlight.current;
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const stored = await AsyncStorage.getItem('chat_token');
                if (stored) {
                    if (!cancelled) setChatToken(stored);
                    return;
                }
                await refreshChatToken();
            } catch (e) {
                console.error('[initChatAuth] Chat auth failed:', e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [refreshChatToken]);

    return (
        <ChatAuthContext.Provider value={{ user, chatToken, loading, refreshChatToken }}>
            {children}
        </ChatAuthContext.Provider>
    );
};

export const useChatAuth = () => useContext(ChatAuthContext);