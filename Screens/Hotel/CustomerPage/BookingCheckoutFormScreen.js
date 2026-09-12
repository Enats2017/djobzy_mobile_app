import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    TextInput,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { toastError, toastSuccess } from '../../../utils/toast';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotifications } from '../../../context/MessageNotificationContext';
import EmployerFooter from '../../../components/EmployerFooter';
import Footer from '../../../components/Footer';
import HotelPageHeader from '../../../components/HotelPageHeader';
import useHotelEvents from '../HotelEvent/useHotelEvents';
import GradientButton from '../../../components/GradientButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pluralize = (count, singular, plural) => (count === 1 ? singular : plural);

const formatShortDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

// "John Smith" -> { firstName: "John", lastName: "Smith" }
const splitFullName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };
    const parts = fullName.trim().split(/\s+/);
    return {
        firstName: parts[0] || '',
        lastName: parts[1] || '',
    };
};

const PRIVACY_POLICY_URL = 'https://djobzy.com/privacy-policy';

const FormField = ({ label, value, onChangeText, placeholder, keyboardType, multiline }) => (
    <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
            style={[styles.input, multiline && styles.inputMultiline]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#B0B0B0"
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
        />
    </View>
);

const BookingCheckoutFormScreen = ({ route }) => {
    const navigation = useNavigation();
    const { admin, user } = useNotifications();
    const { getCustomerDetail, redirectHotelPayment } = useHotelEvents();
    const roomId = route?.params?.roomId ?? null;
    const booking = route?.params?.booking ?? null;
    const address = route?.params?.address ?? null;
    const rawDraft = route?.params?.draft ?? null;
    const draft = rawDraft
        ? {
            ...rawDraft,
            checkInDate: new Date(rawDraft.checkInDate),
            checkOutDate: new Date(rawDraft.checkOutDate),
        }
        : null;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [notes, setNotes] = useState('');
    const [agreeToUpdates, setAgreeToUpdates] = useState(false);

    const fetchUserDetails = async (isMounted) => {
        try {
            setLoading(true);
            const json = await getCustomerDetail();
            const record = json?.user;

            if (isMounted && record) {
                const { firstName: fn, lastName: ln } = splitFullName(record.full_name || record.name);
                setFirstName(fn);
                setLastName(ln);
                setEmail(record.email || '');
                setPhone(record.mobile_number || '');
                setCountry(record.name || '');
            }
        } catch (err) {
            toastError(err.message || 'Failed to load your details.');
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;
            fetchUserDetails(isMounted);
            return () => {
                isMounted = false;
            };
        }, [])
    );

    const openMap = () => {
        // Wire up to your existing map-scroll or external maps link as needed.
    };

    const openPrivacyPolicy = () => {
        Linking.openURL(PRIVACY_POLICY_URL).catch(() => {
            toastError('Could not open the Privacy Policy page.');
        });
    };

    const handlePayNow = async () => {
        if (!firstName.trim()) {
            toastError('Please enter your first name.');
            return;
        }
        if (!lastName.trim()) {
            toastError('Please enter your last name.');
            return;
        }
        if (!phone.trim()) {
            toastError('Please enter your phone number.');
            return;
        }
        if (!email.trim()) {
            toastError('Please enter your email address.');
            return;
        }
        if (!agreeToUpdates) {
            toastError('Please agree to the terms to proceed.');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                user_id: user?.id,
                room_type: booking.room_type,
                room_id: roomId,
                check_in_date: formatShortDate(draft.checkInDate),
                check_in_time: "",
                check_out_date: formatShortDate(draft.checkOutDate),
                check_out_time: "",
                selection: `${draft.numRooms} Room(s) for ${draft.adults} Adult(s)`,
                active_price: Number(draft.totalCost).toFixed(2),
                final_amount: Number(draft.grandTotal).toFixed(2),
                discount: Number(draft.discountAmount).toFixed(2),
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                email: email,
                country: country,
                notes: notes,
            };
            const token = await AsyncStorage.getItem("token");
            const res = await redirectHotelPayment(payload);
            if (res?.status !== 200 || !res?.payment_url) {
                toastError(res?.message || 'Something went wrong.');
                return;
            }
            const paymentUrl = `${res?.payment_url}?pt=${token}`;
            await Linking.openURL(paymentUrl);
        } catch (err) {
            toastError(err.message || 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <HotelPageHeader navigation={navigation} title="Guest Details" />
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color="#D17B68" />
                    </View>
                ) : (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.fieldSection}>
                            <FormField label="First Name" value={firstName} onChangeText={setFirstName} placeholder="First Name" />
                            <FormField label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Last Name" />
                            <FormField
                                label="Phone Number"
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Phone Number"
                                keyboardType="phone-pad"
                            />
                            <FormField
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email Address"
                                keyboardType="email-address"
                            />
                            <FormField label="Country/Region" value={country} onChangeText={setCountry} placeholder="Country/Region" />
                            <FormField
                                label="Additional Notes for Hotel"
                                value={notes}
                                onChangeText={setNotes}
                                placeholder=""
                                multiline
                            />

                            <View style={styles.consentRow}>
                                <TouchableOpacity
                                    style={[styles.checkbox, agreeToUpdates && styles.checkboxChecked]}
                                    onPress={() => setAgreeToUpdates((v) => !v)}
                                    activeOpacity={0.7}
                                >
                                    {agreeToUpdates && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                                </TouchableOpacity>
                                <Text style={styles.consentText}>
                                    I agree to receive updates and promotions about Djobzy and its affiliates
                                    or business partners via various channels, including WhatsApp. Opt out
                                    anytime. Read more in the{' '}
                                    <Text style={styles.consentLink} onPress={openPrivacyPolicy}>
                                        Privacy Policy
                                    </Text>.
                                </Text>
                            </View>

                            <View style={styles.payBtn}>
                                <GradientButton
                                    title='Pay Now'
                                    onPress={handlePayNow}
                                    disabled={submitting}
                                    loading={submitting}
                                />
                            </View>
                        </View>

                        {/* ---- Booking summary (same info as the confirmation modal) ---- */}
                        {!!booking && (
                            <View style={styles.summaryCard}>
                                <Image source={{ uri: booking.images?.[0] }} style={styles.summaryImage} resizeMode="cover" />

                                <View style={styles.summaryContent}>
                                    <Text style={styles.summaryTitle}>{booking.room_type}</Text>

                                    {!!address && (
                                        <View style={styles.addressRow}>
                                            <MaterialCommunityIcons name="office-building-outline" size={20} color="#fff" />
                                            <Text style={styles.addressText}>{address}</Text>
                                        </View>
                                    )}

                                    {!!draft && (
                                        <>
                                            <Text style={styles.sectionTitle}>Your Booking Details:</Text>

                                            <View style={styles.datesRow}>
                                                <View style={styles.dateBox}>
                                                    <Text style={styles.dateLabel}>Check-In</Text>
                                                    <Text style={styles.dateValue}>{formatShortDate(draft.checkInDate)}</Text>
                                                </View>
                                                <View style={styles.dateBox}>
                                                    <Text style={styles.dateLabel}>Check-Out</Text>
                                                    <Text style={styles.dateValue}>{formatShortDate(draft.checkOutDate)}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.selectionBox}>
                                                <Text style={styles.selectionLabel}>You Selected</Text>
                                                <Text style={styles.selectionValue}>
                                                    {draft.numRooms} {pluralize(draft.numRooms, 'Room', 'Rooms')} for {draft.adults} {pluralize(draft.adults, 'Adult', 'Adults')}
                                                </Text>
                                            </View>

                                            <View style={styles.totalCostRow}>
                                                <Text style={styles.totalCostLabel}>Total Cost:</Text>
                                                <Text style={styles.totalCostValue}>${Number(draft.totalCost).toFixed(2)}</Text>
                                            </View>

                                            <View style={styles.dashedDivider} />

                                            <View style={styles.breakdownRow}>
                                                <Text style={styles.breakdownLabel}>Taxes and charges</Text>
                                                <Text style={styles.breakdownValue}>+ ${Number(draft.taxesAndCharges).toFixed(2)}</Text>
                                            </View>
                                            {draft.discountAmount > 0 && (
                                                <View style={styles.breakdownRow}>
                                                    <Text style={styles.breakdownLabel}>Discount</Text>
                                                    <Text style={styles.breakdownValue}>- ${Number(draft.discountAmount).toFixed(2)}</Text>
                                                </View>
                                            )}

                                            <View style={styles.dashedDivider} />

                                            <View style={styles.totalCostRow}>
                                                <Text style={styles.grandTotalLabel}>Total</Text>
                                                <Text style={styles.grandTotalValue}>${Number(draft.grandTotal).toFixed(2)}</Text>
                                            </View>
                                        </>
                                    )}
                                </View>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>

            {admin === 2 ? <EmployerFooter /> : <Footer />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingVertical: 20,
        paddingBottom: 80,
    },
    fieldSection: {
        paddingHorizontal: 15,
    },
    fieldBlock: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Montserrat_500Medium',
        color: '#000000',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#c5c5c5',
        borderRadius: 5,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        lineHeight: 19,
        fontFamily: 'Montserrat_400Regular',
        color: '#000000',
    },
    inputMultiline: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    consentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#C5C5C5',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: '#3F8E7A',
        borderColor: '#3F8E7A',
    },
    consentText: {
        flex: 1,
        fontSize: 11.5,
        fontFamily: 'Montserrat_400Regular',
        color: '#303030',
        lineHeight: 17,
    },
    consentLink: {
        color: '#D17B68',
        fontFamily: 'Montserrat_600SemiBold',
    },
    payBtn: {
        marginBottom: 24,
    },
    summaryCard: {
        padding: 15,
        overflow: 'hidden',
        backgroundColor: '#303030',
    },
    summaryImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    summaryContent: {
        paddingTop: 15,
    },
    summaryTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 15,
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#ffffff',
        lineHeight: 18,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    datesRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    dateBox: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
    },
    dateLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        color: '#000',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
    },
    selectionBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    selectionLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        color: '#000',
        marginBottom: 4,
    },
    selectionValue: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
    },
    totalCostRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    totalCostLabel: {
        fontSize: 16,
        fontFamily: 'Montserrat_500Medium',
        color: '#FFFFFF',
    },
    totalCostValue: {
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
    },
    dashedDivider: {
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderBottomColor: '#ffffff',
        marginBottom: 10,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    breakdownLabel: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_500Medium',
        color: '#ffffff',
    },
    breakdownValue: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_500Medium',
        color: '#ffffff',
    },
    grandTotalLabel: {
        fontSize: 15,
        fontFamily: 'Montserrat_500Medium',
        color: '#FFFFFF',
    },
    grandTotalValue: {
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold',
        color: '#D38979',
    },
});

export default BookingCheckoutFormScreen;