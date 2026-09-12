import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useNotifications } from '../../context/MessageNotificationContext';
import EmployerFooter from '../../components/EmployerFooter';
import Footer from '../../components/Footer';
import { toastError, toastSuccess } from '../../utils/toast';
import HotelPageHeader from '../../components/HotelPageHeader';
import useHotelEvents from './HotelEvent/useHotelEvents';
import FeedDeleteConfirmModal from '../SocialMediaPage/FeedModals/FeedDeleteConfirmModal';
import { globalEvent, EVENTS } from '../../utils/ustomGlobalEmitEvent';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../../components/GradientButton';
import BorderButton from '../../components/BorderButton';
import HotelFacilitiesAndServiceSection from './HotelComponent/HotelFacilitiesAndServiceSection';
const parseJsonField = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

export default function HotelRoomDetailPage({ route }) {
    const navigation = useNavigation();
    const { admin } = useNotifications();
    const { getHotelBooking, deleteHotelRoom } = useHotelEvents();
    const hotelId = route?.params?.hotelId ?? null;
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;
            const fetchBooking = async () => {
                if (!hotelId) {
                    toastError('Missing room id.');
                    setLoading(false);
                    return;
                }
                try {
                    setLoading(true);
                    const json = await getHotelBooking(hotelId);
                    if (isMounted) setBooking(json.result);
                } catch (err) {
                    toastError(err.message || 'Failed to load room details.');
                    if (isMounted) navigation.goBack();
                } finally {
                    if (isMounted) setLoading(false);
                }
            };

            fetchBooking();
            return () => {
                isMounted = false;
            };
        }, [hotelId])
    );

    const handleEdit = () => {
        navigation.navigate('CreateHotelRoom', { bookingId: hotelId });
    };

    const handleDelete = useCallback(async () => {
        setDeleteLoading(true);
        try {
            const res = await deleteHotelRoom(hotelId);
            if (res?.status === 200) {
                globalEvent.emit(EVENTS.ROOM_DELETED, hotelId);
                setDeleteVisible(false);
                navigation.goBack();
                toastSuccess("Hotel Room deleted successfully");
            } else {
                console.warn("Share failed:", res?.message);
            }
        } catch (err) {
            console.warn("Share error:", err);
        } finally {
            setDeleteLoading(false);
        }
    }, [hotelId]);

    const facilities = parseJsonField(booking?.facility_category);
    const refundRules = parseJsonField(booking?.refund_rules);
    const images = Array.isArray(booking?.images) ? booking.images : [];
    return (
        <SafeAreaView style={styles.safeArea}>
            <HotelPageHeader navigation={navigation} title="Room Details" />

            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color="#D17B68" />
                    </View>
                ) : !booking ? (
                    <View style={styles.loadingWrap}>
                        <Text style={styles.emptyText}>Room details unavailable.</Text>
                    </View>
                ) : (
                    <>
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Room Overview */}
                            <Text style={styles.label}>Room Type</Text>
                            <View style={styles.titleRow}>
                                <Text style={styles.roomTitle} numberOfLines={2}>
                                    {booking.room_type}
                                </Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        booking.status === 'Inactive' && styles.statusBadgeInactive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            booking.status === 'Inactive' && styles.statusTextInactive,
                                        ]}
                                    >
                                        {booking.status || 'Active'}
                                    </Text>
                                </View>
                            </View>

                            {!!booking.description && (
                                <Text style={styles.overviewDescription} numberOfLines={3}>
                                    {booking.description}
                                </Text>
                            )}

                            <Text style={[styles.label, { marginTop: 15 }]}>Number of Rooms</Text>
                            <Text style={styles.value}>{booking.number_of_rooms}</Text>

                            <View style={styles.divider} />

                            {/* Pricing */}
                            <Text style={styles.sectionTitle}>Pricing</Text>
                            <View style={styles.priceGrid}>
                                <View style={styles.priceCard}>
                                    <Text style={styles.priceLabel}>Room price (Weekdays)</Text>
                                    <Text style={styles.priceValue}>
                                        CAD {Number(booking.customer_weekday_rate).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.priceCard}>
                                    <Text style={styles.priceLabel}>Room price (Fri & Sat)</Text>
                                    <Text style={styles.priceValue}>
                                        CAD {Number(booking.customer_weekend_rate).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.priceCard}>
                                    <Text style={styles.priceLabel}>Amount you'll get (Weekdays)</Text>
                                    <Text style={styles.priceValue}>
                                        CAD {Number(booking.weekday_rate).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.priceCard}>
                                    <Text style={styles.priceLabel}>Amount you'll get (Fri & Sat)</Text>
                                    <Text style={styles.priceValue}>
                                        CAD {Number(booking.weekend_rate).toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            {/* Cancellation Policy */}
                            {refundRules.length > 0 ? (
                                <View style={styles.cancelCard}>
                                    <Text style={styles.cancelTitle}>Cancellation Policy</Text>
                                    {refundRules.map((rule, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.cancelRow,
                                                index === refundRules.length - 1 && { borderBottomWidth: 0 },
                                            ]}
                                        >
                                            <Text style={styles.cancelText}>
                                                {rule.before} days before check-in
                                            </Text>
                                            <Text style={styles.cancelRefund}>{rule.refund}% refund</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.sectionTitle}>Cancellation Policy</Text>
                                    <Text style={styles.emptyText}>No cancellation policy set.</Text>
                                </>
                            )}

                            {/* Facilities & Services */}
                            <Text style={styles.sectionTitle}>Facilities & Services</Text>
                            <HotelFacilitiesAndServiceSection facilities={facilities} />

                            {/* Discount */}
                            {!!booking.discount && (
                                <>
                                    <Text style={styles.sectionTitle}>Discount</Text>
                                    <Text style={styles.value}>
                                        {booking.discount}% off
                                        {booking.discount_from
                                            ? `  (${formatDateDisplay(booking.discount_from)} - ${formatDateDisplay(
                                                booking.discount_to
                                            )})`
                                            : ''}
                                    </Text>
                                </>
                            )}

                            <View style={styles.divider} />

                            {/* Room Description */}
                            <Text style={styles.sectionTitle}>Room Description</Text>
                            <Text style={styles.description}>
                                {booking.description || 'No description added.'}
                            </Text>

                            {/* Room Photos */}
                            <Text style={styles.sectionTitle}>Room Photos</Text>
                            {images.length > 0 ? (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingRight: 8 }}
                                >
                                    {images.map((uri, index) => (
                                        <Image key={index} source={{ uri }} style={styles.thumb} />
                                    ))}
                                </ScrollView>
                            ) : (
                                <Text style={styles.emptyText}>No photos uploaded.</Text>
                            )}
                        </ScrollView>

                        <View style={styles.actionsBar}>
                            <GradientButton title='Edit Details' onPress={handleEdit} />

                            <TouchableOpacity
                                style={[styles.actionBtn, styles.deleteBtn]}
                                onPress={() => setDeleteVisible(true)}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.deleteBtnText}>Delete Room</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>

            {admin === 2 ? <EmployerFooter /> : <Footer />}

            <FeedDeleteConfirmModal
                title="Delete Hotel Room?"
                description="This action cannot be undone. Your room will be permanently removed."
                visible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />
        </SafeAreaView>
    );
}

const THUMB_SIZE = 130;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
    },
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingVertical: 20,
        paddingBottom: 10,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    roomTitle: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginRight: 10,
    },
    statusBadge: {
        backgroundColor: '#46A2821A',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 4,
    },
    statusText: {
        color: '#46A282',
        fontSize: 10,
        lineHeight: 15,
        fontFamily: 'Montserrat_700Bold',
    },
    statusBadgeInactive: {
        backgroundColor: '#FBE4E4',
    },
    statusTextInactive: {
        color: '#E14C4C',
    },
    overviewDescription: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#303030',
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#0000001e',
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginBottom: 10,
    },
    label: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        color: '#000000',
    },
    value: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
    },
    priceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    priceCard: {
        width: '48.5%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    priceLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        color: '#000000',
    },
    priceValue: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#CB7767',
    },
    cancelCard: {
        backgroundColor: '#CB77671A',
        borderRadius: 10,
        padding: 14,
        marginVertical: 15,
    },
    cancelTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginBottom: 8,
    },
    cancelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(209,123,104,0.2)',
    },
    cancelText: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#0000000',
    },
    cancelRefund: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#CB7767',
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBEBEB',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginRight: 10,
        marginBottom: 10,
    },
    chipText: {
        color: '#333333',
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
    },
    description: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#303030',
        lineHeight: 22,
        marginBottom: 15,
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: '#F0F0F0',
    },
    emptyText: {
        fontSize: 13,
        fontFamily: 'Montserrat_400Regular',
        color: '#B0B0B0',
    },
    actionsBar: {
        gap: 10,
        paddingTop: 12,
        paddingBottom: 90,
    },
    actionBtn: {
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    deleteBtn: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E94235',
    },
    deleteBtnText: {
        color: '#E94235',
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'Montserrat_700Bold',
    },
});