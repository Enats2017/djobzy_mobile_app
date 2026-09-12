import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, Octicons } from 'react-native-vector-icons';
import GradientButton from '../../../components/GradientButton';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CancelBookingConfirmationModal({
    visible,
    loading,
    cancelling,
    refundData,
    onClose,
    onConfirm,
}) {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 16 }]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Cancellation Instructions</Text>
                        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                            <Ionicons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingWrap}>
                            <ActivityIndicator size="large" color="#D17B68" />
                        </View>
                    ) : refundData ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.subtitle}>
                                Please review the refund policy before proceeding. Cancelling may result in
                                charges based on how close it is to your check-in date.
                            </Text>
                            <Text style={styles.sectionLabel}>Refund Calculation Summary</Text>
                            <View style={styles.summaryBox}>
                                <SummaryRow
                                    label="Total Amount Paid"
                                    value={`CAD ${refundData.total_paid}`}
                                />
                                <SummaryRow
                                    label="Refund Percentage"
                                    value={`${refundData.refund_percent}%`}
                                />
                                <SummaryRow
                                    label="Deduction Percentage"
                                    value={`${refundData.deduction_percent}%`}
                                />
                                <SummaryRow
                                    label="Deduction Amount"
                                    value={`CAD ${refundData.deduction_amount}`}
                                    valueColor="#D17B68"
                                />
                                <SummaryRow
                                    label="Refund Amount"
                                    value={`CAD ${refundData.refund_amount}`}
                                    valueColor="#2E9E6D"
                                    bold
                                    highlight
                                    last
                                />
                            </View>

                            <View style={styles.notesBox}>
                                <Text style={styles.notesTitle}>Important Notes</Text>
                                <NoteItem text="Refunds will be processed to the original payment method only." />
                                <NoteItem
                                    text="Processing time for refunds may take"
                                    boldText=" 5–7 working days."
                                />
                                <NoteItem text="Any service or convenience fees are" boldText=" non-refundable." />
                                <NoteItem text="Once cancellation is confirmed, it" boldText=" cannot be undone." />
                            </View>

                            <View style={styles.confirmButtonWrap}>
                                <GradientButton
                                    onPress={onConfirm}
                                    activeOpacity={0.85}
                                    title={cancelling ? 'Cancelling...' : 'Yes, Proceed with Cancellation'}
                                    disabled={cancelling}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.goBackButton}
                                onPress={onClose}
                                disabled={cancelling}
                            >
                                <Text style={styles.goBackText}>No, Go Back</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    ) : null}
                </View>
            </View>
        </Modal>
    );
}

function SummaryRow({ label, value, valueColor, bold, highlight, last }) {
    return (
        <View
            style={[
                styles.summaryRow,
                !last && styles.summaryRowBorder,
                highlight && styles.summaryRowHighlight,
            ]}
        >
            <Text style={[styles.summaryLabel, bold && styles.summaryLabelBold]}>{label}</Text>
            <Text
                style={[
                    styles.summaryValue,
                    bold && styles.summaryValueBold,
                    valueColor ? { color: valueColor } : null,
                ]}
            >
                {value}
            </Text>
        </View>
    );
}

function NoteItem({ text, boldText }) {
    return (
        <Text style={styles.noteText}>
            <Octicons name="dot-fill" size={13} color="#303030" />  {text}
            {boldText ? <Text style={styles.noteBold}>{boldText}</Text> : null}
        </Text>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#fff",
        width: "100%",
        maxHeight: "85%",
        paddingHorizontal: 15,
        paddingTop: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontFamily: "Montserrat_600SemiBold",
        color: '#D17B68',
    },
    closeIcon: {
        flexShrink: 0,
    },
    loadingWrap: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: '#000',
        lineHeight: 19,
        marginBottom: 16,
        fontFamily: "Montserrat_400Regular",
    },
    sectionLabel: {
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
        color: '#303030',
        marginBottom: 8,
    },
    summaryBox: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: '#FAFAFA',
    },
    summaryRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    summaryRowHighlight: {
        backgroundColor: '#EAF8F1',
    },
    summaryLabel: {
        fontSize: 13,
        color: '#000',
    },
    summaryLabelBold: {
        color: '#303030',
        fontFamily: "Montserrat_600SemiBold",
    },
    summaryValue: {
        fontSize: 13,
        color: '#303030',
        fontFamily: "Montserrat_500Medium",
    },
    summaryValueBold: {
        fontSize: 14,
        fontFamily: "Montserrat_700Bold",
    },
    notesBox: {
        backgroundColor: '#FDEDE8',
        borderWidth: 1,
        borderColor: '#F3D3C8',
        borderRadius: 10,
        padding: 14,
        marginBottom: 18,
    },
    notesTitle: {
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
        color: '#D17B68',
        marginBottom: 8,
    },
    noteText: {
        fontSize: 12.5,
        color: '#000',
        lineHeight: 19,
        fontFamily: "Montserrat_400Regular",
    },
    noteBold: {
        fontFamily: "Montserrat_600SemiBold",
        color: '#000',
    },
    goBackButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
    },
    goBackText: {
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
        color: '#303030',
    },
    confirmButtonWrap: {
        flex: 1,
        marginBottom: 13,
    },
});