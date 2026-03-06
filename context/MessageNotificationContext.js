import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../api/ApiUrl";

const MessageNotificationContext = createContext();

export const MessageNotificationProvider = ({ children }) => {
    const [messageCount, setMessageCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(0);
    const [notificationCounts, setNotificationCounts] = useState(0);

    const loadUser = async () => {
        try {
            const userStr = await AsyncStorage.getItem("user");
            if (!userStr) {
                setUser(null);
                setAdmin(0);
                return;
            }

            const parsedUser = JSON.parse(userStr);
            setUser(parsedUser);
            setAdmin(parsedUser?.admin ?? 0);
        } catch (e) {
            console.error("Failed to load user", e);
            setUser(null);
            setAdmin(0);
        }
    };

    const fetchMessageNotifications = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`${API_URL}/message-notification`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await res.json();
            setMessageCount(data?.total_unread ?? 0);
            setNotifications(data?.messages ?? []);
        } catch (e) {
            console.error("Notification fetch failed", e);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`${API_URL}/app-notification`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await res.json();
            setNotificationCounts(data?.unreadCount ?? 0);
        } catch (e) {
            console.error("Notification fetch failed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
        fetchMessageNotifications();
        fetchNotifications();
        const interval = setInterval(fetchMessageNotifications, 50000);
        return () => clearInterval(interval);
    }, []);

    return (
        <MessageNotificationContext.Provider
            value={{
                messageCount,
                notificationCounts,
                notifications,
                loading,
                user,
                admin,
                refreshNotifications: fetchMessageNotifications,
                refreshUser: loadUser,
            }}
        >
            {children}
        </MessageNotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(MessageNotificationContext);
