import { useRef, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../api/ApiUrl";

const BATCH_SIZE = 5;

export default function useMarkFeedSeen() {
    // IDs waiting to be sent
    const pendingRef = useRef(new Set());
    // IDs already sent — never re-send these
    const sentRef = useRef(new Set());

    const flush = useCallback(async () => {
        if (pendingRef.current.size === 0) return;

        const batch = Array.from(pendingRef.current);
        pendingRef.current = new Set();

        try {
            const token = await AsyncStorage.getItem("token");
            await fetch(`${API_URL}/feed/mark-seen`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    feed_ids: batch,
                }),
            });

            batch.forEach((id) => sentRef.current.add(id));
        } catch (err) {
            batch.forEach((id) => {
                if (!sentRef.current.has(id)) {
                    pendingRef.current.add(id);
                }
            });
            console.log("Mark seen error:", err);
        }
    }, []);

    const markSeen = useCallback((feedId) => {
        if (!feedId) return;
        if (sentRef.current.has(feedId)) return;
        if (pendingRef.current.has(feedId)) return;

        pendingRef.current.add(feedId);

        if (pendingRef.current.size >= BATCH_SIZE) {
            flush();
        }
    }, [flush]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (pendingRef.current.size > 0) {
                flush();
            }
        }, 8000);

        return () => {
            clearInterval(interval);
            flush();
        };
    }, [flush]);

    return { markSeen };
}
