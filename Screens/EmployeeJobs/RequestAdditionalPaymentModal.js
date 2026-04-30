import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientButton from '../../components/GradientButton';
import { API_URL } from '../../api/ApiUrl';
import { toastError, toastSuccess } from '../../utils/toast';

const RequestAdditionalPaymentModal = ({
    visible,
    onClose,
    data,
    prpId,
    initialTotal = 0,
    initialHourly = 0,
}) => {
    const insets = useSafeAreaInsets();
    const [description, setDescription] = useState('');
    const [totalPrice, setTotalPrice] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [expectedTime, setExpectedTime] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    // console.log('prp id got ', prpId);
    // console.log('job data got ', data?.change_requests);

    const validate = () => {
        const newErrors = {};
        const total = parseFloat(totalPrice);
        const rate = parseFloat(hourlyRate);
        if (!description.trim()) {
            newErrors.description = 'Please describe the reason for additional payment.';
        }
        if (!totalPrice && !hourlyRate) {
            newErrors.amount = 'Please enter a total price and hourly rate.';
        }
        if (totalPrice && hourlyRate) {
            if (isNaN(total) || isNaN(rate)) {
                newErrors.amount = 'Please enter valid numbers.';
            } else if (rate > total) {
                newErrors.amount = 'Hourly rate cannot be more than total price';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSend = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_URL}/send-bid`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: prpId,
                    desc: description.trim(),
                    bid: totalPrice ? parseFloat(totalPrice) : 0,
                    hourly_rate: hourlyRate ? parseFloat(hourlyRate) : 0,
                    total_hour: 2,
                    old_request_id: '',
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toastSuccess('Your additional payment request has been sent.');
                handleClose();
            } else {
                toastError(data.message ?? 'Something went wrong. Please try again.');
            }
        } catch (error) {
            toastError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setDescription('');
        setTotalPrice('');
        setHourlyRate('');
        setErrors({});
        onClose();
    };

    const calculateExpectedTime = (totalVal, rateVal) => {
        if (totalVal === "" || rateVal === "") {
            setExpectedTime(0);
            setErrors({});
            return;
        }

        const total = parseFloat(totalVal);
        const rate = parseFloat(rateVal);

        if (isNaN(total) || isNaN(rate)) {
            setExpectedTime(0);
            return;
        }

        if (rate > total) {
            setErrors({ amount: 'Hourly rate cannot be more than total price' });
            setExpectedTime(0);
            return;
        }

        setErrors({});
        setExpectedTime(Math.ceil(total / rate));
    };

    const handleTotalChange = (value) => {
        const clean = value.replace(/[^0-9.]/g, '');
        setTotalPrice(clean);
        calculateExpectedTime(clean, hourlyRate);
    };

    const handleRateChange = (value) => {
        const clean = value.replace(/[^0-9.]/g, '');
        setHourlyRate(clean);
        calculateExpectedTime(totalPrice, clean);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Request an additional payment for the job</Text>
                        <TouchableOpacity style={styles.closeIcon} onPress={handleClose}>
                            <Ionicons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Description */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Describe the reason for additional pay request</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Short description of the task"
                                placeholderTextColor="#666666"
                                value={description}
                                onChangeText={(val) => {
                                    if (val.length <= 200) setDescription(val);
                                }}
                                multiline
                                textAlignVertical="top"
                                returnKeyType="done"
                            />
                            <Text style={styles.charCount}>{description.length} / 200</Text>
                            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                        </View>

                        {/* Initial Offer */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Initial offer</Text>
                            <View style={styles.row}>
                                <View style={[styles.offerBox, styles.rowItem]}>
                                    <Text style={styles.offerBoxLabel}>Total</Text>
                                    <View style={styles.offerBoxValue}>
                                        <Text style={styles.currency}>CAD </Text>
                                        <Text style={styles.currencyText}>
                                            {initialTotal}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.offerBox, styles.rowItem]}>
                                    <Text style={styles.offerBoxLabel}>Hourly</Text>
                                    <View style={styles.offerBoxValue}>
                                        <Text style={styles.currency}>CAD </Text>
                                        <Text style={styles.currencyText}>
                                            {initialHourly}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Changed Offer */}
                        {data?.change_requests?.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.label}>Previous bid</Text>
                                <View style={styles.row}>
                                    <View style={[styles.offerBox, styles.rowItem]}>
                                        <Text style={styles.offerBoxLabel}>Total</Text>
                                        <View style={styles.offerBoxValue}>
                                            <Text style={styles.currency}>CAD </Text>
                                            <Text style={styles.currencyText}>
                                                {data?.change_requests?.[0]?.fixed_rate}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.offerBox, styles.rowItem]}>
                                        <Text style={styles.offerBoxLabel}>Hourly</Text>
                                        <View style={styles.offerBoxValue}>
                                            <Text style={styles.currency}>CAD </Text>
                                            <Text style={styles.currencyText}>
                                                {data?.change_requests?.[0]?.hourly_rate}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>
                                        Total {data?.change_requests?.[0]?.fixed_rate} CAD 
                                        ({data?.change_requests?.[0]?.hourly_rate} CAD/h)
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Additional Payment */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Additional payment</Text>
                            <View style={styles.row}>
                                <View style={styles.rowItem}>
                                    <Text style={styles.inputLabel}>Total Price</Text>
                                    <View style={styles.inputWrapper}>
                                        <Text style={styles.inputPrefix}>CAD</Text>
                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="0"
                                            placeholderTextColor="#666666"
                                            value={totalPrice}
                                            onChangeText={handleTotalChange}
                                            keyboardType="decimal-pad"
                                            textAlign="right"
                                        />
                                    </View>
                                </View>

                                <View style={styles.rowItem}>
                                    <Text style={styles.inputLabel}>Hourly Rate</Text>
                                    <View style={styles.inputWrapper}>
                                        <Text style={styles.inputPrefix}>CAD</Text>
                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="0"
                                            placeholderTextColor="#666666"
                                            value={hourlyRate}
                                            onChangeText={handleRateChange}
                                            keyboardType="decimal-pad"
                                            textAlign="right"
                                        />
                                        <Text style={styles.inputSuffix}>/ hr</Text>
                                    </View>
                                </View>
                            </View>
                            {expectedTime > 0 && (
                                <Text style={styles.note}>
                                    <Text style={styles.bold}>{expectedTime} Hours </Text>
                                    is expected for the job to be done.
                                </Text>
                            )}
                            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                            <Text style={styles.hint}>This amount will be added to your initial payment</Text>
                        </View>

                        <View style={styles.btnWrapper}>
                            <GradientButton
                                title={data?.change_requests?.length > 0 ? "Request Pending" : "Send Request" }
                                onPress={handleSend}
                                activeOpacity={0.85}
                                disabled={loading || data?.change_requests?.length > 0}
                                loading={loading}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
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
        maxHeight: '85%',
        paddingHorizontal: 15,
        paddingTop: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    // ── Header
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
        gap: 10,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
        lineHeight: 24,
    },
    closeIcon: {
        flexShrink: 0,
    },

    // ── Sections
    section: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
        marginBottom: 5,
    },

    // ── Description
    textArea: {
        borderWidth: 1,
        borderColor: '#00000033',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
        lineHeight: 22,
        backgroundColor: '#fff',
        color: '#000',
        height: 130,
        fontFamily: 'Montserrat_500Medium',
    },
    charCount: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'right',
        marginTop: 4,
        fontFamily: 'Montserrat_400Regular',
    },

    // ── Row layout
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    rowItem: {
        flex: 1,
    },

    // ── Initial offer boxes (read-only display)
    offerBox: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    offerBoxLabel: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'Montserrat_400Regular',
        marginBottom: 2,
    },
    offerBoxValue: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: "space-between",
        gap: 5,
    },
    currency: {
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
        color: '#C96B59',
        lineHeight: 24
    },
    currencyText: {
        fontSize: 18,
        fontFamily: 'Montserrat_700Bold',
        color: '#303030',
        lineHeight: 24
    },

    bulletRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        paddingLeft: 4,
    },
    bulletDot: {
        width: 15,
        height: 5,
        borderRadius: 50,
        backgroundColor: "#C96B59",
        marginRight: 5,
        flexShrink: 0,
    },
    bulletText: {
        color: "#303030",
        fontSize: 13,
        fontFamily: "Montserrat_400Regular",
        lineHeight: 19,
        flex: 1,
    },

    // ── Additional payment inputs
    inputLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#666666',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00000033',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#fff',
        gap: 6,
    },
    inputPrefix: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#C96B59',
        lineHeight: 19,
    },
    inputField: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
        padding: 0,
        textAlign: 'right',
    },
    inputSuffix: {
        fontSize: 13,
        fontFamily: 'Montserrat_400Regular',
        color: '#303030',
    },
    note: {
        color: "#666666",
        fontSize: 12,
        fontStyle: "italic",
        fontFamily: "Montserrat_400Medium",
        marginTop: 7,
    },
    bold: {
        color: "#303030",
        fontStyle: "italic",
        fontSize: 13,
        fontFamily: "Montserrat_700Bold",
    },

    // ── Hint & errors
    hint: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        fontStyle: 'italic',
        color: '#888',
        marginTop: 8,
    },
    errorText: {
        color: '#ff0000',
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Montserrat_400Regular',
    },
});

export default RequestAdditionalPaymentModal;