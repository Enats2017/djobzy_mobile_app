import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PaymentRequestConfirmationModal = ({ visible, type, onConfirm, onCancel, loading }) => {
    const insets = useSafeAreaInsets();

    const isAccept = type === 'accept';

    const message = isAccept
        ? 'Are you sure you want to accept the request to change the payment?'
        : 'Are you sure you want to decline the request to change the payment?';

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
                    {/* Close Icon */}
                    <TouchableOpacity style={styles.closeIcon} onPress={onCancel}>
                        <Ionicons name="close" size={22} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.btnRow}>
                        {/* No */}
                        <TouchableOpacity
                            style={[styles.btn, styles.noBtn]}
                            onPress={onCancel}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.noBtnText}>No</Text>
                        </TouchableOpacity>

                        {/* Yes */}
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                isAccept ? styles.acceptBtn : styles.declineBtn,
                                loading && { opacity: 0.7 }
                            ]}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.yesBtnText}>Yes</Text>
                            )}
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        width: '100%',
        paddingHorizontal: 15,
        paddingTop: 14,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    closeIcon: {
        alignSelf: 'flex-end',
        marginBottom: 6,
    },
    message: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 28,
        paddingHorizontal: 10,
    },
    btnRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    btn: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },

    // No button — neutral grey
    noBtn: {
        backgroundColor: '#F0F0F0',
    },
    noBtnText: {
        fontSize: 15,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
    },

    acceptBtn: {
        backgroundColor: '#39a881',
    },

    declineBtn: {
        backgroundColor: '#EF4444',
    },

    yesBtnText: {
        fontSize: 15,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#fff',
    },
});

export default PaymentRequestConfirmationModal;