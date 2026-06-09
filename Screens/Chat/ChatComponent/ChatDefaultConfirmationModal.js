import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const CONFIRMATION_CONFIG = {
    delete: {
        iconName: "trash-outline",
        iconBg: "#FDECEA",
        iconColor: "#C0392B",
        title: "Delete Conversation?",
        message:
            "This conversation will be permanently deleted and cannot be recovered. Are you sure you want to continue?",
        confirmBg: "#C0392B",
        confirmText: "Yes, Delete",
        cancelText: "No, Keep It",
    },
    block: {
        iconName: "ban-outline",
        iconBg: "#FFF3CD",
        iconColor: "#856404",
        title: "Block User?",
        message:
            "Blocking this user will prevent them from messaging you. You can unblock them anytime from your settings.",
        confirmBg: "#856404",
        confirmText: "Yes, Block",
        cancelText: "No, Cancel",
    },
    unblock: {
        iconName: "checkmark-circle-outline",
        iconBg: "#E8F8F5",
        iconColor: "#2E7D32",
        title: "Unblock User?",
        message:
            "This user will be able to send messages to you again.",
        confirmBg: "#2E7D32",
        confirmText: "Yes, Unblock",
        cancelText: "No, Keep Blocked",
    },
    clear: {
        iconName: "refresh-outline",
        iconBg: "#E8F4FD",
        iconColor: "#1A6FA8",
        title: "Clear Chat?",
        message:
            "All messages in this conversation will be cleared. This action cannot be undone.",
        confirmBg: "#1A6FA8",
        confirmText: "Yes, Clear",
        cancelText: "No, Keep It",
    },
};

const ChatDefaultConfirmationModal = ({ visible, onClose, type, onConfirm, loading }) => {
    const insets = useSafeAreaInsets();
    const config = CONFIRMATION_CONFIG[type] || CONFIRMATION_CONFIG.delete;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>

                    {/* Close Icon */}
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={22} color="#555" />
                    </TouchableOpacity>

                    {/* Icon Circle */}
                    <View style={[styles.iconCircle, { backgroundColor: config.iconBg }]}>
                        <Ionicons name={config.iconName} size={36} color={config.iconColor} />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{config.title}</Text>

                    {/* Message */}
                    <Text style={styles.message}>{config.message}</Text>

                    {/* Buttons */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>{config.cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.confirmBtn, { backgroundColor: config.confirmBg }]}
                            onPress={onConfirm}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.confirmText}>
                                {loading ? "Please wait..." : config.confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    container: {
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 24,
        alignItems: "center",
    },
    closeIcon: {
        alignSelf: "flex-end",
        marginBottom: 8,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: "Montserrat_700Bold",
        color: "#000",
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
        lineHeight: 21,
        fontFamily: "Montserrat_500Medium",
        marginBottom: 24,
    },
    btnRow: {
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
    },
    cancelText: {
        fontSize: 14,
        color: "#000",
        fontFamily: "Montserrat_600SemiBold",
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    confirmText: {
        fontSize: 14,
        color: "#fff",
        fontFamily: "Montserrat_600SemiBold",
    },
});

export default ChatDefaultConfirmationModal;
