import { useState, useRef, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../api/ApiUrl";

const DEBOUNCE_MS = 350;
const MIN_CHARS = 2;

export default function useMentionHashtag() {
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionType, setSuggestionType] = useState(null);
    const [loading, setLoading] = useState(false);

    const debounceTimer = useRef(null);
    // Tracks cursor position — updated via onSelectionChange on TextInput
    const cursorPosRef = useRef(0);
    // Tracks the text value so insertSuggestion can read it synchronously
    const textRef = useRef("");

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
        setSuggestionType(null);
    }, []);

    // Call this from TextInput's onSelectionChange
    const onSelectionChange = useCallback((e) => {
        cursorPosRef.current = e.nativeEvent.selection.end;
    }, []);

    const onChangeText = useCallback((text, setMessage) => {
        textRef.current = text;
        setMessage(text);

        const cursor = cursorPosRef.current;
        const textBeforeCursor = text.substring(0, cursor);

        const mentionMatch = textBeforeCursor.match(/@([A-Za-z0-9._-]{2,})$/);
        const hashtagMatch = textBeforeCursor.match(/#([A-Za-z0-9._-]{2,})$/);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (mentionMatch || hashtagMatch) {
            const keyword = mentionMatch ? mentionMatch[1] : hashtagMatch[1];
            const type = mentionMatch ? "mention" : "hashtag";

            debounceTimer.current = setTimeout(async () => {
                try {
                    setLoading(true);
                    const token = await AsyncStorage.getItem("token");
                    const res = await fetch(`${API_URL}/filter-feed-suggestions`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ keyword, tag_type: type }),
                    });
                    const data = await res.json();
                    if (data.status === 200) {
                        setSuggestions(data.results || []);
                        setSuggestionType(type);
                    }
                } catch (err) {
                    console.log("Suggestion fetch error:", err);
                } finally {
                    setLoading(false);
                }
            }, DEBOUNCE_MS);
        } else {
            clearSuggestions();
        }
    }, [clearSuggestions]);

    const insertSuggestion = useCallback((item, setMessage) => {
        const text = textRef.current;
        const cursor = cursorPosRef.current;
        const textBeforeCursor = text.substring(0, cursor);
        const textAfterCursor = text.substring(cursor);

        const triggerChar = suggestionType === "mention" ? "@" : "#";
        const lastTriggerIndex = textBeforeCursor.lastIndexOf(triggerChar);

        if (lastTriggerIndex === -1) return;
        const tag = suggestionType === "mention" ? `@${item.username} ` : `#${item.tag} `;
        const newText = textBeforeCursor.substring(0, lastTriggerIndex) + tag + textAfterCursor;
        textRef.current = newText;
        setMessage(newText);
        clearSuggestions();
    }, [suggestionType, clearSuggestions]);

    return {
        suggestions,
        suggestionType,
        loading,
        onChangeText,
        onSelectionChange,
        insertSuggestion,
        clearSuggestions,
    };
}