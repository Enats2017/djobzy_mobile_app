import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientButton from "../../../components/GradientButton";
import BottomSheetIndicator from "../../../components/BottomSheetIndicator";

export default function FeedDeleteConfirmModal({ title, description, visible, onClose, onConfirm, loading }) {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                    <BottomSheetIndicator />
                    <View style={styles.iconWrap}>
                        <Ionicons name="trash-outline" size={32} color="#e05c3a" />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{description}</Text>

                    <View style={styles.btn}>
                        <GradientButton
                            title="Yes, Delete"
                            onPress={onConfirm}
                            disabled={loading}
                            loading={loading}
                        />
                    </View>

                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading} activeOpacity={0.7} >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.50)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 12,
        alignItems: "center",
        width: "100%",
    },
    iconWrap: {
        width: 70,
        height: 70,
        borderRadius: 100,
        backgroundColor: "#fdf0ed",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f5d5cc",
    },
    title: {
        fontSize: 20,
        fontFamily: "Montserrat_700Bold",
        color: "#1a1a1a",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        fontFamily: "Montserrat_400Regular",
        color: "#6a6a6a",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    cancelBtn: {
        paddingVertical: 12,
    },
    cancelBtnText: {
        fontSize: 15,
        fontFamily: "Montserrat_400Regular",
        color: "#9a9a9a",
    },
    btn: {
        width: "100%",
    },
});
