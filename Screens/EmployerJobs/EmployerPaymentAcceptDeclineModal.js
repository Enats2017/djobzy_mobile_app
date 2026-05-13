import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from "../../components/GradientButton";
import PaymentRequestConfirmationModal from './PaymentRequestConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../api/ApiUrl';
import * as Linking from "expo-linking";
import { toastError, toastSuccess } from '../../utils/toast';

const EmployerPaymentAcceptDeclineModal = ({ visible, onClose, onReopen, onRefresh, gigProp, newRequest }) => {
    const insets = useSafeAreaInsets();
    // console.log('adfaldfahdlfjhald jhalfdj fhald ', gigProp);
    // console.log('adfaldfahdlfjhald jhalfdj fhald ', newRequest);
    const [confirmType, setConfirmType] = useState(null);
    const [loading, setLoading] = useState(false);
    const confirmVisible = confirmType !== null;

    const handleAcceptPress = () => {
        setConfirmType('accept');
        onClose();
    };

    const handleDeclinePress = () => {
        setConfirmType('decline');
        onClose();
    };
    const handleCancel = () => {
        setConfirmType(null);
        if (onReopen) {
            onReopen();
        }
    }

    const handleConfirm = async () => {
        if (confirmType === 'accept') {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem("token");
                const response = await fetch(`${API_URL}/accept-additional-payment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: gigProp?.gid,
                        app_redirect_url: Linking.createURL("payment-success")
                    }),
                });

                const data = await response.json();
                console.log("Payment Response:", data);

                if (data?.status) {
                    const paymentUrl = `${data?.data?.payment_url}?pt=${token}`;
                    if (paymentUrl) {
                        setLoading(false);
                        setConfirmType(null);
                        Linking.openURL(paymentUrl);
                    } else {
                        toastError("Payment URL not received.");
                    }
                } else {
                    toastError(data?.message || "Something went wrong.");
                }
            } catch (error) {
                console.log("Promote Error:", error);
                toastError("Network error.");
            } finally {
                setLoading(false);
            }
        } else {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem("token");
                const response = await fetch(`${API_URL}/decline-additional-payment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: newRequest?.id,
                        type: 2,
                    }),
                });

                const data = await response.json();
                console.log("Payment Decline Response:", data);

                if (data?.status === 200) {
                    setConfirmType(null);
                    toastSuccess("Request declined successfully");
                    onClose();
                    onRefresh?.();
                } else {
                    toastError(data?.message || "Something went wrong.");
                }
            } catch (error) {
                console.log("Promote Error:", error);
                toastError("Network error.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 16}]}>

                        {/* Close Icon */}
                        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                            <Ionicons name="close" size={22} color="#000" />
                        </TouchableOpacity>

                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* Illustration Banner */}
                            <View style={styles.banner}>
                                <View style={styles.bannerIconWrapper}>
                                    <Ionicons name="receipt-outline" size={52} color="#4A8C8C" />
                                </View>
                            </View>

                            {/* Title */}
                            <Text style={styles.title}>
                                Your Employee Requested a Payment Change For The Job{' '}
                                <Text style={styles.titleBold}>"{gigProp?.subject}"</Text>
                            </Text>

                            {/* Current Amount */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Current Amount</Text>
                                <View style={styles.row}>
                                    <View style={[styles.amountBox, styles.rowItem]}>
                                        <Text style={styles.amountBoxLabel}>Total</Text>
                                        <Text style={styles.amountBoxValue}>{gigProp?.bid_price} CAD</Text>
                                    </View>
                                    <View style={[styles.amountBox, styles.rowItem]}>
                                        <Text style={styles.amountBoxLabel}>Hourly</Text>
                                        <Text style={styles.amountBoxValue}>{gigProp?.prop_hourly_rate} CAD</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Requested Amount */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Requested Amount</Text>
                                <View style={styles.row}>
                                    <View style={[styles.amountBox, styles.amountBoxDark, styles.rowItem]}>
                                        <Text style={[styles.amountBoxLabel, styles.amountBoxLabelDark]}>Total</Text>
                                        <Text style={[styles.amountBoxValue, styles.amountBoxValueDark]}>
                                            {newRequest?.fixed_rate} CAD
                                        </Text>
                                    </View>
                                    <View style={[styles.amountBox, styles.rowItem]}>
                                        <Text style={styles.amountBoxLabel}>Hourly</Text>
                                        <Text style={styles.amountBoxValue}>{newRequest?.hourly_rate} CAD</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Accept Button */}
                            <GradientButton
                                title="Accept"
                                onPress={handleAcceptPress}
                            />

                            {/* Decline Button */}
                            <TouchableOpacity
                                style={styles.declineBtn}
                                onPress={handleDeclinePress}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.declineBtnText}>Decline</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <PaymentRequestConfirmationModal
                visible={confirmVisible}
                type={confirmType}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                loading={loading}
            />
        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        width: '100%',
        maxHeight: '88%',
        paddingHorizontal: 15,
        paddingTop: 14,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    // ── Close
    closeIcon: {
        alignSelf: 'flex-end',
        marginBottom: 6,
    },

    // ── Banner
    banner: {
        backgroundColor: '#f7ecd8',
        borderRadius: 60,
        height: 120,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerIconWrapper: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    title: {
        fontSize: 15,
        fontFamily: 'Montserrat_500Medium',
        color: '#303030',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    titleBold: {
        fontFamily: 'Montserrat_700Bold',
        color: '#303030',
    },

    section: {
        marginBottom: 18,
    },
    sectionLabel: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    rowItem: {
        flex: 1,
    },

    amountBox: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    amountBoxDark: {
        backgroundColor: '#303030',
    },
    amountBoxLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        color: '#303030',
        marginBottom: 4,
    },
    amountBoxLabelDark: {
        color: '#fff',
    },
    amountBoxValue: {
        fontSize: 18,
        fontFamily: 'Montserrat_700Bold',
        color: '#303030',
    },
    amountBoxValueDark: {
        color: '#fff',
    },

    // ── Decline button
    declineBtn: {
        paddingTop: 16,
        alignItems: 'center',
    },
    declineBtnText: {
        fontSize: 18,
        fontFamily: 'Montserrat_700Bold',
        color: '#6c9ba1',
    },
});

export default EmployerPaymentAcceptDeclineModal;