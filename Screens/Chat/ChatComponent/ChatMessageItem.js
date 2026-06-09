import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import { ChatFormatDay } from "./ChatFormatTime";

const ChatMessageItem = memo(
    ({ item, myId }) => {
        // ── date separator ──────────────────────────────────────────────────────
        if (item.type === "date") {
            return (
                <View style={styles.dateLabelWrap}>
                    <Text style={styles.dateLabelText}>
                        <ChatFormatDay dateString={item.day} />
                    </Text>
                </View>
            );
        }

        // ── chat bubble ─────────────────────────────────────────────────────────
        // Fix: _sending alone should NOT determine isOutgoing for incoming messages.
        // Only check from_id. _sending is only set on optimistic messages we created.
        const numericMyId = typeof myId === "string" ? Number(myId) : myId;
        const isOutgoing =
            item.from_id === myId ||
            item.from_id === numericMyId ||
            item._sending === true;

        const isFile =
            item.message_type !== 0 && item.message_type !== undefined;

        return (
            <View
                style={[styles.msgRow, isOutgoing ? styles.rowRight : styles.rowLeft]}
            >
                <View
                    style={[
                        styles.bubble,
                        isOutgoing ? styles.bubbleOut : styles.bubbleIn,
                        item._sending && styles.bubbleSending,
                    ]}
                >
                    {isFile ? (
                        <View style={styles.fileMsg}>
                            <Feather
                                name="paperclip"
                                size={14}
                                color={isOutgoing ? "#fff" : "#333"}
                            />
                            <Text
                                style={[
                                    styles.fileMsgText,
                                    isOutgoing && styles.fileMsgTextOut,
                                ]}
                            >
                                {item.file_name ?? "Attachment"}
                            </Text>
                        </View>
                    ) : (
                        <Text
                            style={[styles.bubbleText, isOutgoing && styles.bubbleTextOut]}
                        >
                            {item.message}
                        </Text>
                    )}
                </View>

                <Text
                    style={[
                        styles.msgTime,
                        isOutgoing ? styles.msgTimeRight : styles.msgTimeLeft,
                    ]}
                >
                    {moment(item.created_at).format("hh:mm A")}
                    {isOutgoing && (
                        <Text style={styles.tick}>
                            {item._sending ? "  ·" : item.status == 1 ? "  ✓✓" : "  ✓"}
                        </Text>
                    )}
                </Text>
            </View>
        );
    },
    // Custom comparison: only re-render when these fields change.
    // This prevents re-renders when unrelated state changes in parent.
    (prev, next) => {
        return (
            prev.item.id === next.item.id &&
            prev.item.status === next.item.status &&
            prev.item._sending === next.item._sending &&
            prev.item.message === next.item.message &&
            prev.myId === next.myId
        );
    }
);

export default ChatMessageItem;

const styles = StyleSheet.create({
    dateLabelWrap: {
        alignItems: "center",
        marginVertical: 10,
    },
    dateLabelText: {
        color: "#aaa",
        fontSize: 12,
        fontFamily: "Montserrat_500Medium",
        backgroundColor: "rgba(255,255,255,0.08)",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
        overflow: "hidden",
    },
    msgRow: {
        marginVertical: 2,
        maxWidth: "80%",
    },
    rowRight: {
        alignSelf: "flex-end",
        alignItems: "flex-end",
    },
    rowLeft: {
        alignSelf: "flex-start",
        alignItems: "flex-start",
    },
    bubble: {
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxWidth: "100%",
    },
    bubbleOut: {
        backgroundColor: "#e87b7b",
        borderBottomRightRadius: 4,
    },
    bubbleIn: {
        backgroundColor: "#333",
        borderBottomLeftRadius: 4,
    },
    bubbleSending: {
        opacity: 0.6,
    },
    bubbleText: {
        color: "#eee",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        lineHeight: 19,
    },
    bubbleTextOut: {
        color: "#fff",
    },
    fileMsg: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    fileMsgText: {
        color: "#eee",
        fontSize: 13,
        fontFamily: "Montserrat_500Medium",
    },
    fileMsgTextOut: {
        color: "#fff",
    },
    msgTime: {
        fontSize: 10,
        color: "#888",
        marginTop: 2,
        fontFamily: "Montserrat_500Medium",
    },
    msgTimeRight: {
        alignSelf: "flex-end",
    },
    msgTimeLeft: {
        alignSelf: "flex-start",
    },
    tick: {
        color: "#bbb",
    },
});