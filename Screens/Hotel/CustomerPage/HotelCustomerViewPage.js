import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
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
import AttachmentImagePreviewModal from '../../EditProfilePage/data/AttachmentImagePreviewModal';
import HotelFacilitiesAndServiceSection from '../HotelComponent/HotelFacilitiesAndServiceSection';
import BookingHotelSummaryCard from '../HotelComponent/BookingHotelSummaryCard';
import Map from '../../../components/Map';
import HotelImagePreviewModal from '../HotelComponent/HotelImagePreviewModal';
import HotelSimilarRoomsSection from '../HotelComponent/HotelSimilarRoomsSection';
import HotelRefundPolicyCard from '../HotelComponent/HotelRefundPolicyCard';
import QuestionMark from '../../../components/QuestionMark';
import { tooltipMessage } from '../../../components/TooltipMessage';
import BookingConfirmationModal from '../HotelModals/BookingConfirmationModal';

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

const RoomImageGallery = ({ images, onPressImage }) => {
    if (!images.length) return null;

    const visible = images.slice(0, 3);
    const remainingCount = images.length - 3;

    return (
        <View style={styles.galleryRow}>
            <TouchableOpacity
                style={styles.galleryMain}
                activeOpacity={0.9}
                onPress={() => onPressImage(0)}
            >
                <Image source={{ uri: visible[0] }} style={styles.galleryImage} resizeMode="cover" />
            </TouchableOpacity>

            <View style={styles.galleryCol}>
                {visible[1] && (
                    <TouchableOpacity
                        style={styles.galleySmall}
                        activeOpacity={0.9}
                        onPress={() => onPressImage(1)}
                    >
                        <Image source={{ uri: visible[1] }} style={styles.galleryImage} resizeMode="cover" />
                    </TouchableOpacity>
                )}

                {visible[2] && (
                    <TouchableOpacity
                        style={styles.galleySmall}
                        activeOpacity={0.9}
                        onPress={() => onPressImage(2)}
                    >
                        <Image source={{ uri: visible[2] }} style={styles.galleryImage} resizeMode="cover" />
                        {remainingCount > 0 && (
                            <View style={styles.galleryOverlay}>
                                <Ionicons name="images-outline" size={14} color="#FFFFFF" />
                                <Text style={styles.galleryOverlayText}>{remainingCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const HotelCutsomerViewPage = ({ route }) => {
    const navigation = useNavigation();
    const { admin } = useNotifications();
    const { customerHotelView, checkAvailability } = useHotelEvents();
    const roomId = route?.params?.roomId ?? null;
    const checkInDate = route?.params?.checkInDate ?? null;
    const checkOutDate = route?.params?.checkOutDate ?? null;

    const [booking, setBooking] = useState(null);
    const [pricing, setPricing] = useState(null);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [bookingDraft, setBookingDraft] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const [mapSectionY, setMapSectionY] = useState(0);

    const fetchHotelDetails = async (isMounted) => {
        if (!roomId) {
            toastError('Missing room id.');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const json = await customerHotelView(roomId, checkInDate, checkOutDate);
            if (isMounted) {
                setBooking(json.result?.booking ?? null);
                setPricing(json.result ?? null);
                setAddress(json.result?.address ?? null);
            }
        } catch (err) {
            toastError(err.message || 'Failed to load room details.');
            if (isMounted) navigation.goBack();
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;
            fetchHotelDetails(isMounted);
            return () => {
                isMounted = false;
            };
        }, [roomId])
    );

    const facilities = parseJsonField(booking?.facility_category);
    const refundRules = parseJsonField(booking?.refund_rules);
    const images = Array.isArray(booking?.images) ? booking.images : [];
    const originalPrice = booking ? Number(booking.customer_weekday_rate) : 0;
    const activePrice = pricing ? Number(pricing.active_price) : originalPrice;
    const discountActive = !!pricing?.discount_active;
    const discountPercent = booking?.discount ?? 0;
    const savedAmount = discountActive ? Math.max(originalPrice - activePrice, 0) : 0;

    const openPreview = (index) => {
        setPreviewIndex(index);
        setPreviewVisible(true);
    };

    const openMap = () => {
        if (!address?.latitude || !address?.longitude) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`;
        Linking.openURL(url).catch(() => { });
    };

    const scrollToMap = () => {
        scrollViewRef.current?.scrollTo({ y: mapSectionY, animated: true });
    };

    const latitude = address?.latitude ? parseFloat(address.latitude) : null;
    const longitude = address?.longitude ? parseFloat(address.longitude) : null;

    return (
        <SafeAreaView style={styles.safeArea}>
            <HotelPageHeader navigation={navigation} title="Hotel Details" />
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
                            ref={scrollViewRef}
                            style={{ flex: 1 }}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.hotelDetailSection}>
                                <RoomImageGallery images={images} onPressImage={openPreview} />

                                <View style={styles.titleRow}>
                                    <Text style={styles.roomTitle} numberOfLines={2}>
                                        {booking.room_type}
                                    </Text>
                                    <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7}>
                                        <Ionicons name="share-social-outline" size={15} color="#000000" />
                                        <Text style={styles.shareText}>Share</Text>
                                    </TouchableOpacity>
                                </View>

                                {!!address?.address && (
                                    <View style={styles.addressRow}>
                                        <MaterialCommunityIcons name="office-building-outline" size={18} color="#4A4A4A" />
                                        <Text style={styles.addressText}>
                                            {address.address}{' '}
                                            <Text style={styles.seeMapText} onPress={scrollToMap}>
                                                See Map
                                            </Text>
                                        </Text>
                                    </View>
                                )}

                                {!!booking.description && (
                                    <>
                                        <Text style={styles.sectionTitle}>About Us</Text>
                                        <Text style={styles.description}>{booking.description}</Text>
                                    </>
                                )}
                                <View style={styles.facilitiesSection}>
                                    <Text style={styles.sectionTitle}>Facilities & Services</Text>
                                    <HotelFacilitiesAndServiceSection facilities={facilities} />
                                </View>

                                <View style={styles.facilitiesSection}>
                                    <Text style={styles.sectionTitle}>Refund Policy</Text>
                                    <HotelRefundPolicyCard rules={refundRules} onInfoPress={() => {/* show explainer if you want */ }} />
                                </View>
                                {/* {latitude != null && longitude != null && (
                                    <View
                                        style={styles.mapsection}
                                        onLayout={(event) => setMapSectionY(event.nativeEvent.layout.y)}
                                    >
                                        <Text style={styles.sectionTitle}>Location</Text>
                                        <Map latitude={latitude} longitude={longitude} zoom={0.01} />
                                    </View>
                                )} */}
                            </View>

                            <BookingHotelSummaryCard
                                title={booking.room_type}
                                roomId={booking.id}
                                activePrice={Number(pricing.active_price)}
                                weekdayRate={Number(booking.customer_weekday_rate)}
                                weekendRate={Number(booking.customer_weekend_rate)}
                                discountPercent={Number(booking.discount) || 0}
                                discountFrom={booking.discount_from}
                                discountTo={booking.discount_to}
                                taxesAndCharges={0}
                                initialCheckIn={checkInDate ? new Date(checkInDate) : null}
                                initialCheckOut={checkOutDate ? new Date(checkOutDate) : null}
                                checkAvailability={checkAvailability}
                                onBook={(draft) => {
                                    setBookingDraft(draft);
                                    setConfirmVisible(true);
                                }}
                            />

                            <HotelSimilarRoomsSection
                                rooms={pricing?.similar_rooms ?? []}
                                onViewRoom={(room) => {
                                    navigation.push('HotelCustomerView', {
                                        roomId: room.id,
                                        checkInDate,
                                        checkOutDate,
                                    });
                                }}
                            />

                            <BookingConfirmationModal
                                visible={confirmVisible}
                                onClose={() => setConfirmVisible(false)}
                                booking={booking}
                                address={address}
                                draft={bookingDraft}
                                onPay={(draft) => {
                                    navigation.push('CustomerCheckoutForm', {
                                        roomId: roomId,
                                        booking,
                                        address: address?.address ?? null,
                                        draft: {
                                            ...draft,
                                            checkInDate: draft.checkInDate.toISOString(),
                                            checkOutDate: draft.checkOutDate.toISOString(),
                                        },
                                    });
                                    setConfirmVisible(false);
                                }}
                            />
                        </ScrollView>
                    </>
                )}
            </View>

            {admin === 2 ? <EmployerFooter /> : <Footer />}

            <HotelImagePreviewModal
                visible={previewVisible}
                images={images}
                initialIndex={previewIndex}
                onClose={() => setPreviewVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    hotelDetailSection: {
        paddingHorizontal: 15,
    },
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingVertical: 20,
        paddingBottom: 100,
    },
    galleryRow: {
        flexDirection: 'row',
        gap: 8,
        height: 220,
        marginBottom: 18,
    },
    galleryMain: {
        flex: 1.4,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#EFEFEF',
    },
    galleryCol: {
        flex: 1,
        gap: 8,
    },
    galleySmall: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#EFEFEF',
    },
    galleryImage: {
        width: '100%',
        height: '100%',
    },
    galleryOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    galleryOverlayText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    roomTitle: {
        flex: 1,
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
        marginRight: 10,
    },
    shareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e1e1e',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 5,
    },
    shareText: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#1e1e1e',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    activePrice: {
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold',
        color: '#1A1A1A',
    },
    originalPrice: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#B0B0B0',
        textDecorationLine: 'line-through',
    },
    discountLabel: {
        fontSize: 12.5,
        fontFamily: 'Montserrat_500Medium',
        color: '#999999',
    },
    saveBadge: {
        backgroundColor: '#E4F6EE',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    saveBadgeText: {
        color: '#2FA96A',
        fontSize: 11.5,
        fontFamily: 'Montserrat_600SemiBold',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 20,
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#303030',
        lineHeight: 19,
    },
    seeMapText: {
        color: '#CB7767',
        fontFamily: 'Montserrat_600SemiBold',
    },
    sectionTitle: {
        fontSize: 18,
        lineHeight: 18,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#303030',
        lineHeight: 20,
        marginBottom: 20,
    },
    facilitiesSection: {
        marginBottom: 15,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
        color: '#B0B0B0',
    },
});

export default HotelCutsomerViewPage;