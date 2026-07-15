import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetIndicator from "../../../components/BottomSheetIndicator";

export default function FeedPostDropdownModal({ visible, onClose, onReport, onDelete, feedId, isOwner = false }) {
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
                <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
                    <BottomSheetIndicator />
                    {isOwner ? (
                        <TouchableOpacity
                            style={styles.option}
                            activeOpacity={0.7}
                            onPress={() => {
                                onClose();
                                setTimeout(() => onDelete?.(feedId), 300);
                            }}
                        >
                            <View style={[styles.optionIcon, { backgroundColor: "#fdecec" }]}>
                                <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                            </View>

                            <View style={styles.optionBody}>
                                <Text style={[styles.optionLabel, { color: "#d32f2f" }]}>
                                    Delete Post
                                </Text>
                                <Text style={styles.optionSub}>
                                    Permanently remove this post
                                </Text>
                            </View>

                            <Ionicons name="chevron-forward" size={18} color="#ccc" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.option}
                            activeOpacity={0.7}
                            onPress={() => {
                                onClose();
                                setTimeout(() => onReport(feedId), 300);
                            }}
                        >
                            <View style={styles.optionIcon}>
                                <Ionicons name="flag-outline" size={20} color="#e05c3a" />
                            </View>

                            <View style={styles.optionBody}>
                                <Text style={styles.optionLabel}>
                                    Report Post
                                </Text>
                                <Text style={styles.optionSub}>
                                    Let us know what's wrong
                                </Text>
                            </View>

                            <Ionicons name="chevron-forward" size={18} color="#ccc" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingHorizontal: 18,
        paddingTop: 12,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
    },
    optionIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#fdf0ed",
        alignItems: "center",
        justifyContent: "center",
    },
    optionBody: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 15,
        fontFamily: "Montserrat_600SemiBold",
        color: "#1a1a1a",
    },
    optionSub: {
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
        color: "#9a9a9a",
        marginTop: 2,
    },
});
