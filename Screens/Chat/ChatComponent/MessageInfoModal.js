import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatInfoTime = (utcString) => {
    if (!utcString) return "—";
    const m = moment(utcString); // auto-converts to local time on .format()
    const today = moment().startOf("day");
    const isToday = m.isSame(today, "day");
    const isYesterday = m.isSame(today.clone().subtract(1, "day"), "day");

    const timePart = m.format("hh:mm A");
    if (isToday) return `Today, ${timePart}`;
    if (isYesterday) return `Yesterday, ${timePart}`;
    return m.format("MMM D, YYYY, hh:mm A");
};

const MessageInfoModal = ({ visible, item, onClose }) => {
    if (!item) return null;
    const insets = useSafeAreaInsets();

    const isFile = item.message_type !== 0 && item.message_type !== undefined;
    const isRead = item.status == 1;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={[styles.card, { paddingBottom: insets.bottom + 16 }]} onPress={() => { }}>
                    {/* header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Message info</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* message preview */}
                    <View style={styles.previewWrap}>
                        <View style={styles.previewBubble}>
                            <Text style={styles.previewText} numberOfLines={3}>
                                {isFile ? (item.file_name ?? "Attachment") : item.message}
                            </Text>
                        </View>
                        <Text style={styles.previewTime}>
                            {moment(item.created_at).format("hh:mm A")}
                        </Text>
                    </View>

                    {/* status rows */}
                    <View style={styles.statusList}>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusIconWrap, isRead && styles.statusIconWrapActive]}>
                                <MaterialIcons
                                    name="done-all"
                                    size={16}
                                    color={isRead ? "#5B8DEF" : "rgba(255,255,255,0.3)"}
                                />
                            </View>
                            <View style={styles.statusTextWrap}>
                                <Text style={styles.statusLabel}>Read</Text>
                                <Text style={styles.statusTime}>
                                    {isRead ? formatInfoTime(item.updated_at) : "Not read yet"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.statusRow}>
                            <View style={[styles.statusIconWrap, styles.statusIconWrapActive]}>
                                <MaterialIcons name="check" size={16} color="#3DB87A" />
                            </View>
                            <View style={styles.statusTextWrap}>
                                <Text style={styles.statusLabel}>Delivered</Text>
                                <Text style={styles.statusTime}>
                                    {formatInfoTime(item.created_at)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default MessageInfoModal;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    card: {
        width: "100%",
        backgroundColor: "#2a2a2a",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        overflow: "hidden",
        maxHeight: "70%"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.08)",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
    },
    closeBtn: { padding: 2 },

    previewWrap: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 12,
        alignItems: "flex-end",
    },
    previewBubble: {
        backgroundColor: "#e87b7b",
        borderRadius: 14,
        borderBottomRightRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxWidth: "85%",
    },
    previewText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        lineHeight: 18,
    },
    previewTime: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 10,
        marginTop: 4,
        fontFamily: "Montserrat_500Medium",
    },

    statusList: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
    },
    statusIconWrap: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: "rgba(255,255,255,0.06)",
        alignItems: "center", justifyContent: "center",
    },
    statusIconWrapActive: {
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    statusTextWrap: { flex: 1 },
    statusLabel: {
        color: "#fff",
        fontSize: 13.5,
        fontFamily: "Montserrat_500Medium",
    },
    statusTime: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        marginTop: 2,
        fontFamily: "Montserrat_500Medium",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.06)",
        marginLeft: 42,
    },
});