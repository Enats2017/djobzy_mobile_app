import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// type = "hide" | "show"
const HideShowConfirmModal = ({ visible, onClose, type, onConfirm, loading }) => {
    const insets = useSafeAreaInsets();
    const isHide = type === "hide";

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { paddingBottom: insets.bottom}]}>
                    {/* Close Icon */}
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>

                    {/* Icon */}
                    <View style={[styles.iconCircle, { backgroundColor: isHide ? "#FFF3CD" : "#D4EDDA" }]}>
                        <Ionicons
                            name={isHide ? "eye-off-outline" : "eye-outline"}
                            size={36}
                            color={isHide ? "#856404" : "#155724"}
                        />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>
                        {isHide ? "Hide Age?" : "Show Age?"}
                    </Text>

                    {/* Message */}
                    <Text style={styles.message}>
                        {isHide
                            ? "Are you sure you want to hide your Age? It will not be visible to others."
                            : "Are you sure you want to show your Age? It will be visible to others."}
                    </Text>

                    {/* Buttons */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>No, Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.confirmBtn, { backgroundColor: isHide ? "#856404" : "#155724" }]}
                            onPress={onConfirm}
                            disabled={loading}
                        >
                            <Text style={styles.confirmText}>
                                {loading ? "Please wait..." : isHide ? "Yes, Hide" : "Yes, Show"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default HideShowConfirmModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    container: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingTop: 20,
        paddingHorizontal: 20,
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