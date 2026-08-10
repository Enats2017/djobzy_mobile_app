import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    TextInput,
    Alert,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toastError, toastSuccess } from "../../../utils/toast";
import useSocialEvents from "../FeedEvent/useSocialEvents";
import GradientButton from "../../../components/GradientButton";
import BottomSheetIndicator from "../../../components/BottomSheetIndicator";
import ModalKeyboardContainer from "../../../components/ModalKeyboardContainer";

const REASONS = [
    "Spam",
    "Inappropriate Content",
    "Harassment or Abuse",
    "False Information",
    "Other",
];

export default function FeedReportModal({ visible, onClose, feedId, onHide }) {
    const insets = useSafeAreaInsets();
    const { reportFeed } = useSocialEvents();

    const [selectedReason, setSelectedReason] = useState("");
    const [otherText, setOtherText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const scrollRef = useRef(null);

    const isOther = selectedReason === "Other";
    const canSubmit = !!selectedReason && (!isOther || otherText.trim().length > 0);

    // "Other" reveals an autoFocus box at the very bottom of the scroll content.
    // The sheet shrinks above the keyboard, but the ScrollView keeps its offset,
    // so without this the new field renders below the fold. Delayed past the
    // keyboard animation so we scroll against the final, shorter viewport.
    useEffect(() => {
        if (!isOther) return;
        const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 350);
        return () => clearTimeout(t);
    }, [isOther]);

    const handleClose = useCallback(() => {
        setSelectedReason("");
        setOtherText("");
        onClose();
    }, [onClose]);

    const handleSubmit = useCallback(async () => {
        if (!canSubmit || submitting) return;

        setSubmitting(true);
        try {
            const res = await reportFeed(feedId, selectedReason, isOther ? otherText.trim() : "");
            if (res?.status === 200) {
                handleClose();
                onHide?.(feedId);
                toastSuccess(res.message || "Thank you for letting us know. We'll review this post shortly.");
            } else if (res?.status === 409) {
                handleClose();
                toastError("You've already reported this post.");
            } else {
                toastError(res?.message || "Failed to submit report. Please try again.");
            }
        } catch (err) {
            console.log("Report error:", err);
            toastError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }, [canSubmit, submitting, feedId, selectedReason, otherText, isOther]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <ModalKeyboardContainer>
                <View style={styles.overlay}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
                    <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                        <BottomSheetIndicator />

                        <View style={styles.topSection}>
                            <View style={styles.iconWrap}>
                                <Ionicons name="flag" size={28} color="#C96B59" />
                            </View>
                            <Text style={styles.title}>Report Post</Text>
                            <Text style={styles.subtitle}>
                                What is the reason for the report?
                            </Text>
                        </View>

                        <ScrollView
                            ref={scrollRef}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.reasonList}>
                                {REASONS.map((reason) => {
                                    const active = selectedReason === reason;
                                    return (
                                        <TouchableOpacity
                                            key={reason}
                                            style={[styles.reasonRow, active && styles.reasonRowActive]}
                                            activeOpacity={0.7}
                                            onPress={() => setSelectedReason(reason)}
                                        >
                                            <Text style={[styles.reasonText, active && styles.reasonTextActive]}>
                                                {reason}
                                            </Text>
                                            <View style={[styles.radio, active && styles.radioActive]}>
                                                {active && <View style={styles.radioDot} />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {isOther && (
                                <View style={styles.otherWrap}>
                                    <Text style={styles.otherLabel}>Please describe the issue</Text>
                                    <TextInput
                                        style={styles.otherInput}
                                        placeholder="Describe your issue here..."
                                        placeholderTextColor="#aaa"
                                        value={otherText}
                                        onChangeText={setOtherText}
                                        multiline
                                        maxLength={500}
                                        textAlignVertical="top"
                                        autoFocus
                                    />
                                    <Text style={styles.charCount}>
                                        {otherText.length}/500
                                    </Text>
                                </View>
                            )}

                            <GradientButton
                                title="Send Report"
                                onPress={handleSubmit}
                                disabled={!canSubmit || submitting}
                                activeOpacity={0.8}
                                loading={submitting}
                            />
                        </ScrollView>
                    </View>
                </View>
            </ModalKeyboardContainer>
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
        maxHeight: "85%",
    },

    topSection: {
        alignItems: "center",
        marginBottom: 20,
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#fdf0ed",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontFamily: "Montserrat_700Bold",
        color: "#303030",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
        color: "#6a6a6a",
        textAlign: "center",
    },

    reasonList: {
        gap: 8,
        marginBottom: 16,
    },
    reasonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#ebebeb",
        backgroundColor: "#fafafa",
    },
    reasonRowActive: {
        borderColor: "#C96B59",
        backgroundColor: "#FFF6F4",
    },
    reasonText: {
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        color: "#303030",
        flex: 1,
    },
    reasonTextActive: {
        color: "#C96B59",
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
    },
    radioActive: {
        borderColor: "#C96B59",
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#C96B59",
    },

    otherWrap: {
        marginBottom: 16,
    },
    otherLabel: {
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
        color: "#303030",
        marginBottom: 8,
    },
    otherInput: {
        borderWidth: 1.5,
        borderColor: "#ebebeb",
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
        color: "#303030",
        minHeight: 110,
        backgroundColor: "#fafafa",
    },
    charCount: {
        fontSize: 11,
        fontFamily: "Montserrat_400Regular",
        color: "#aaa",
        textAlign: "right",
        marginTop: 4,
    },
});
