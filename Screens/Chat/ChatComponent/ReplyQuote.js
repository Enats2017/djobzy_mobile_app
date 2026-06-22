import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const FILE_TYPES = {
    image: {
        exts: ["jpg", "jpeg", "png", "gif"],
        text: "Photo",
        icon: "image-outline",
    },
    video: {
        exts: ["mp4", "mkv", "avi", "mov"],
        text: "Video",
        icon: "videocam-outline",
    },
};

const getExt = (name = "") =>
    name.split(".").pop()?.toLowerCase();

const getReplyPreview = (msg) => {
    if (!msg) return {};

    const isFile = msg.message_type !== 0;

    if (!isFile) {
        return {
            text: msg.message ?? "",
            icon: null,
        };
    }

    const ext = getExt(msg.file_name);

    const type =
        Object.values(FILE_TYPES).find((t) =>
            t.exts.includes(ext)
        ) || {
            text: msg.file_name || "Document",
            icon: "document-text-outline",
        };

    return type;
};

const getReplyAuthorName = (msg, myId, otherUserName) => {
    const isMine = Number(msg?.from_id) === Number(myId);
    return isMine ? "You" : otherUserName || "User";
};

const ReplyQuote = ({
    replyMessage,
    isOutgoing,
    myId,
    otherUserName,
}) => {
    if (!replyMessage) return null;

    const { text, icon } = getReplyPreview(replyMessage);

    return (
        <View
            style={[
                styles.quoteWrap,
                isOutgoing
                    ? styles.quoteWrapOut
                    : styles.quoteWrapIn,
            ]}
        >
            <View
                style={[
                    styles.quoteBar,
                    isOutgoing && styles.quoteBarOut,
                ]}
            />

            <View style={styles.quoteContent}>
                <Text
                    numberOfLines={1}
                    style={[
                        styles.quoteAuthor,
                        isOutgoing && styles.quoteAuthorOut,
                    ]}
                >
                    {getReplyAuthorName(
                        replyMessage,
                        myId,
                        otherUserName
                    )}
                </Text>

                <View style={styles.previewRow}>
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={14}
                            color={
                                isOutgoing
                                    ? "rgba(255,255,255,0.85)"
                                    : "rgba(255,255,255,0.6)"
                            }
                            style={{ marginRight: 4 }}
                        />
                    )}

                    <Text
                        numberOfLines={1}
                        style={[
                            styles.quoteText,
                            isOutgoing && styles.quoteTextOut,
                        ]}
                    >
                        {text}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default ReplyQuote;

const styles = StyleSheet.create({
    quoteWrap: {
        flexDirection: "row",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 6,
    },

    quoteWrapIn: {
        backgroundColor: "rgba(255,255,255,0.06)",
    },

    quoteWrapOut: {
        backgroundColor: "rgba(0,0,0,0.12)",
    },

    quoteBar: {
        width: 3,
        backgroundColor: "#8A99A8",
    },

    quoteBarOut: {
        backgroundColor: "rgba(255,255,255,0.6)",
    },

    quoteContent: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 8,
    },

    quoteAuthor: {
        color: "#5B8DEF",
        fontSize: 12,
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 2,
    },

    quoteAuthorOut: {
        color: "rgba(255,255,255,0.95)",
    },

    previewRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    quoteText: {
        flex: 1,
        color: "rgba(255,255,255,0.6)",
        fontSize: 12,
        fontFamily: "Montserrat_500Medium",
    },

    quoteTextOut: {
        color: "rgba(255,255,255,0.85)",
    },
});