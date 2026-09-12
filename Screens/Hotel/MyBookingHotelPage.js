import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useNotifications } from '../../context/MessageNotificationContext';
import EmployerFooter from '../../components/EmployerFooter';
import Footer from '../../components/Footer';
import { toastError, toastSuccess } from '../../utils/toast';
import HotelPageHeader from '../../components/HotelPageHeader';
import useHotelEvents from './HotelEvent/useHotelEvents';
import MyBookingViewCard from './HotelComponent/MyBookingViewCard';
import CancelBookingConfirmationModal from './HotelModals/CancelBookingConfirmationModal';

const MyBookingHotelPage = ({ route }) => {
    const navigation = useNavigation();
    const { admin } = useNotifications();
    const { getMyHotelBooking, getCancelBookingDetails, cancelHotelBooking } = useHotelEvents();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelTarget, setCancelTarget] = useState(null);
    const [refundData, setRefundData] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const json = await getMyHotelBooking();
            setBookings(json?.data ?? []);
        } catch (err) {
            toastError(err.message || 'Failed to load bookings.');
            console.log(err);

        } finally {
            setLoading(false);
        }
    }, [getMyHotelBooking]);

    useFocusEffect(
        useCallback(() => {
            fetchBookings();
        }, [])
    );

    const handleCancelPress = useCallback(async (booking) => {
        setCancelTarget(booking);
        setDetailsLoading(true);
        try {
            const res = await getCancelBookingDetails(booking.guest_id);
            if (res?.status) {
                setRefundData(res.data);
            } else {
                toastError(res?.message || 'Could not load refund details.');
                setCancelTarget(null);
            }
        } catch (err) {
            toastError(err.message || 'Could not load refund details.');
            setCancelTarget(null);
        } finally {
            setDetailsLoading(false);
        }
    }, [getCancelBookingDetails]);

    const handleCloseModal = useCallback(() => {
        if (cancelling) return;
        setCancelTarget(null);
        setRefundData(null);
    }, [cancelling]);

    const handleConfirmCancel = useCallback(async () => {
        if (!cancelTarget || !refundData) return;
        try {
            setCancelling(true);
            const res = await cancelHotelBooking(cancelTarget.guest_id, refundData.refund_amount, refundData.deduction_amount);
            // TODO: replace with real cancel-booking API call once exposed on useHotelEvents
            // await cancelHotelBooking(cancelTarget.id);

            // Update only the cancelled booking locally instead of refetching
            // the whole list — this way only that card re-renders.
            if (res?.status === 200) {
                setBookings((prev) =>
                    prev.map((b) =>
                        b.guest_id === cancelTarget.guest_id
                            ? { ...b, is_booking_cancel: 1 }
                            : b
                    )
                );
                setCancelTarget(null);
                toastSuccess(res?.message || 'Booking cancelled.');
                setRefundData(null);
            } else {
                toastError(res?.message || 'Failed to cancel booking.');
            }
        } catch (err) {
            toastError(err.message || 'Failed to cancel booking.');
        } finally {
            setCancelling(false);
        }
    }, [cancelTarget, refundData, cancelHotelBooking]);

    const renderItem = useCallback(
        ({ item }) => <MyBookingViewCard booking={item} onCancelPress={handleCancelPress} />,
        [handleCancelPress]
    );

    const keyExtractor = useCallback((item) => String(item.guest_id), []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <HotelPageHeader navigation={navigation} title="My Bookings" />

            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color="#D17B68" />
                    </View>
                ) : (
                    <FlatList
                        data={bookings}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        initialNumToRender={6}
                        maxToRenderPerBatch={6}
                        windowSize={7}
                        removeClippedSubviews
                        ListEmptyComponent={
                            <View style={styles.emptyWrap}>
                                <Text style={styles.emptyText}>No bookings yet.</Text>
                            </View>
                        }
                    />
                )}
            </View>

            {admin === 2 ? <EmployerFooter /> : <Footer />}

            <CancelBookingConfirmationModal
                visible={!!cancelTarget}
                loading={detailsLoading}
                cancelling={cancelling}
                refundData={refundData}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
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
        paddingHorizontal: 15,
    },
    listContent: {
        paddingTop: 12,
        paddingBottom: 100,
    },
    loadingWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyWrap: {
        paddingTop: 60,
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 14,
    },
});

export default MyBookingHotelPage;