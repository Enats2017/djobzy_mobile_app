import React, { useMemo, useCallback } from "react";
import { Text, StyleSheet } from "react-native";

function parseMessage(plainMessage, mentions = [], hashtags = []) {
    if (!plainMessage) return [];

    // Build lookup maps for O(1) access
    const mentionMap = {};
    mentions.forEach((m) => {
        mentionMap[m.username.toLowerCase()] = m;
    });

    const hashtagMap = {};
    hashtags.forEach((h) => {
        hashtagMap[h.tag.toLowerCase()] = h;
    });

    // Split by @word or #word tokens
    const tokenRegex = /(@[A-Za-z0-9._-]+|#[A-Za-z0-9._-]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(plainMessage)) !== null) {
        // Push plain text before this token
        if (match.index > lastIndex) {
            parts.push({
                text: plainMessage.slice(lastIndex, match.index),
                type: "text",
            });
        }

        const token = match[0];
        const isMention = token.startsWith("@");
        const slug = token.slice(1).toLowerCase(); // strip @ or #

        if (isMention && mentionMap[slug]) {
            parts.push({ text: token, type: "mention", data: mentionMap[slug] });
        } else if (!isMention && hashtagMap[slug]) {
            parts.push({ text: token, type: "hashtag", data: hashtagMap[slug] });
        } else {
            parts.push({ text: token, type: "text" });
        }

        lastIndex = match.index + match[0].length;
    }

    // Push remaining plain text
    if (lastIndex < plainMessage.length) {
        parts.push({ text: plainMessage.slice(lastIndex), type: "text" });
    }

    return parts;
}

export default function MentionAndHashtagText({ message, mentionsData, style, onMentionPress, onHashtagPress }) {
    const parsed = useMemo(() => {
        if (!mentionsData) {
            return [{ text: message, type: "text" }];
        }
        const data = typeof mentionsData === "string" ? JSON.parse(mentionsData) : mentionsData;
        const plainMessage = data.plain_message || message;
        return parseMessage(plainMessage, data.mentions || [], data.hashtags || []);
    }, [message, mentionsData]);

    return (
        <Text style={style}>
            {parsed.map((part, i) => {
                if (part.type === "mention") {
                    return (
                        <Text
                            key={i}
                            style={styles.mention}
                            onPress={() => onMentionPress?.(part.data)}
                        >
                            {part.text}
                        </Text>
                    );
                }
                if (part.type === "hashtag") {
                    return (
                        <Text
                            key={i}
                            style={styles.hashtag}
                            onPress={() => onHashtagPress?.(part.data)}
                        >
                            {part.text}
                        </Text>
                    );
                }
                return (
                    <Text key={i} style={styles.plain}>
                        {part.text}
                    </Text>
                );
            })}
        </Text>
    );
}

const styles = StyleSheet.create({
    plain: {},
    mention: {
        color: "#4a9eff",
        fontFamily: "Montserrat_600SemiBold",
    },
    hashtag: {
        color: "#4a9eff",
        fontFamily: "Montserrat_500Medium",
    },
});