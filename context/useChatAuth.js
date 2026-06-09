// hooks/useChatAuth.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, CHAT_API_URL } from '../api/ApiUrl';
import { logProfileData } from 'react-native-calendars/src/Profiler';
import { useNotifications } from './MessageNotificationContext';

export const useChatAuth = () => {
    const [chatToken, setChatToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const {user} = useNotifications();

    useEffect(() => {
        initChatAuth();
    }, []);
    const initChatAuth = async () => {
        try {
            // Check if we already have a valid chat token stored
            const stored = await AsyncStorage.getItem("chat_token");
            if (stored) {
                setChatToken(stored);
                setLoading(false);
                return;
            }
            const newToken = await refreshChatToken();
        } catch (e) {
            console.error('[initChatAuth] Chat auth failed:', e);
        } finally {
            setLoading(false);
        }
    };

    const refreshChatToken = async () => {
        try {
            //Step 1: get one-time token from main project
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                return;
            }

            const res = await fetch(`${API_URL}/chat-token`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const data = await res.json();
            console.log(`[refreshChatToken] ${data.token}`);
            // Step 2: auto-login to chat project
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
            console.log('[ChatResponse]', chatData);
            const chat_token = chatData.data?.token;
            if (!chat_token) {
                console.error('[refreshChatToken] Chat token missing in response');
                return;
            }
            await AsyncStorage.setItem('chat_token', chat_token);
            setChatToken(chat_token);
            return chat_token;
        } catch (error) {
            console.error('[refreshChatToken] Error occurred:', error);
        }
    };

    return { user, chatToken, loading, refreshChatToken };
};