import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";

function formatCount(num) {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return `${num}`;
}

export default function FeedActions({ liked, likesCount, shares, comments, onLike, onShare, onComment, onSend, onReport, isOwner }) {

    return (
        <View style={styles.actionsRow}>
            <View style={styles.leftActions}>
                {!isOwner && (
                    <TouchableOpacity style={styles.actionItem} onPress={onLike}>
                        <Ionicons
                            name={liked ? "heart" : "heart-outline"}
                            size={22}
                            color={liked ? "#ff4d4f" : "#c3c3c3"}
                        />
                        <Text style={styles.countText}>{formatCount(likesCount)}</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.actionItem} onPress={onShare}>
                    <FontAwesome name="share-square-o" size={19} color="#c3c3c3" />
                    <Text style={styles.countText}>{formatCount(shares)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={onComment}>
                    <FontAwesome name="comment-o" size={20} color="#c3c3c3" />
                    <Text style={styles.countText}>{formatCount(comments)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={onSend}>
                    <Feather name="send" size={18} color="#c3c3c3" />
                    <Text style={styles.countText}>Send</Text>
                </TouchableOpacity>
            </View>

            {!isOwner && (
                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.iconBtn} onPress={onReport}>
                        <Feather name="info" size={16} color="#c3c3c3" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4,
    },
    leftActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
    },
    actionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    countText: {
        color: "#ffffff",
        fontSize: 14,
        lineHeight: 19,
        fontFamily: "Montserrat_400Regular",
    },
    rightActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
        alignItems: "center",
        justifyContent: "center",
    },
});