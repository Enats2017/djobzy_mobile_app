import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../api/ApiUrl";

const MessageNotificationContext = createContext();

export const MessageNotificationProvider = ({ children }) => {
    const [messageCount, setMessageCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        fetchMessageNotifications();
        const interval = setInterval(fetchMessageNotifications, 50000);
        return () => clearInterval(interval);
    }, []);

    return (
        <MessageNotificationContext.Provider
            value={{
                messageCount,
                loading,
                notifications,
                refreshNotifications: fetchMessageNotifications,
            }}
        >
            {children}
        </MessageNotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(MessageNotificationContext);
