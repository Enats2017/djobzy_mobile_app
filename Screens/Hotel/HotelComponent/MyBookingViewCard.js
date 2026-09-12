import React, { memo, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome6, Ionicons } from 'react-native-vector-icons';

const STATUS_CONFIG = {
    confirmed: { bg: '#46A282', icon: 'checkmark-circle', label: 'Confirmed' },
    cancelled: { bg: '#CE592C', icon: 'close-circle', label: 'Cancelled' },
};

function getStatusConfig(booking) {
    const isCancelled = booking?.payment_status !== 'paid' || booking?.is_booking_cancel === 1;
    return isCancelled ? STATUS_CONFIG.cancelled : STATUS_CONFIG.confirmed;
}

function canCancelBooking(booking) {
    // Mirrors blade: is_booking_cancel==0 && checking_date_passed==0
    const datePassed = booking?.checking_date_passed === 1 || booking?.checking_date_passed === true;
    return booking?.is_booking_cancel === 0 && !datePassed;
}

function MyBookingViewCard({ booking, onCancelPress }) {
    const statusConfig = getStatusConfig(booking);
    const showCancelButton = canCancelBooking(booking);
    const imageUri = booking?.images?.[0];

    const handleSeeMap = () => {
        if (!booking?.hotel_address) return;
        const query = encodeURIComponent(booking.hotel_address);
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    };

    const handleCancel = useCallback(() => {
        onCancelPress?.(booking);
    }, [booking, onCancelPress]);

    return (
        <View style={styles.card}>
            <View style={styles.imageWrap}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, styles.imageFallback]} />
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.hotelName} numberOfLines={1}>
                        {booking?.owner_name}
                    </Text>
                    <View style={[styles.statusPill, { backgroundColor: statusConfig.bg }]}>
                        <Ionicons name={statusConfig.icon} size={22} color="#fff" />
                        <Text style={styles.statusText}>{statusConfig.label}</Text>
                    </View>
                </View>

                <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={20} color="#D17B68" style={styles.addressIcon} />
                    <Text style={styles.addressText}>
                        {booking?.hotel_address}{' '}
                        <Text style={styles.seeMapText} onPress={handleSeeMap}>
                            See Map
                        </Text>
                    </Text>
                </View>

                <View style={styles.infoList}>
                    <InfoRow label="Room Type" value={booking?.hotel_name} />
                    <InfoRow label="Name" value={booking?.guest_name} />
                    <InfoRow label="Email" value={booking?.guest_email} />
                    <InfoRow
                        label="Check-In"
                        boldValue={booking?.check_in}
                    />
                    <InfoRow
                        label="Check-Out"
                        boldValue={booking?.check_out}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.footerRow}>
                    <View>
                        <Text style={styles.paidLabel}>Paid Amount</Text>
                        <Text style={styles.paidValue}>CAD {booking?.paid_amount}</Text>
                    </View>

                    {showCancelButton && (
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

function InfoRow({ label, value, boldValue }) {
    const hasBoldValue = boldValue !== undefined;
    if (!hasBoldValue && !value) return null;
    if (hasBoldValue && !boldValue) return null;

    return (
        <View style={styles.infoRow}>
            <FontAwesome6 name="check" size={16} color="#FFFFFF" style={styles.infoIcon} />
            <Text style={styles.infoText} numberOfLines={1}>
                <Text style={styles.infoLabel}>{label}: </Text>
                {hasBoldValue ? (
                    <>
                        <Text style={styles.infoValue}>{boldValue}</Text>
                    </>
                ) : (
                    <Text style={styles.infoValue}>{value}</Text>
                )}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        padding: 5,
        marginBottom: 15,
    },
    imageWrap: {
        borderRadius: 5,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 160,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    imageFallback: {
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    content: {
        paddingHorizontal: 6,
        paddingTop: 14,
        paddingBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    hotelName: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        lineHeight: 16,
        fontFamily: 'Montserrat_600SemiBold',
        marginRight: 8,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        paddingLeft: 5,
        paddingVertical: 4,
        borderRadius: 100,
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
        marginLeft: 4,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    addressIcon: {
        marginTop: 2,
        marginRight: 5,
    },
    addressText: {
        flex: 1,
        color: '#ffffff',
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        lineHeight: 12,
    },
    seeMapText: {
        color: '#CB7767',
        fontFamily: 'Montserrat_700Bold',
        textDecorationLine: 'underline',
    },
    infoList: {
        marginTop: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    infoIcon: {
        marginRight: 10
    },
    infoText: {
        flex: 1,
        fontSize: 12,
    },
    infoLabel: {
        color: '#ffffff',
        fontFamily: 'Montserrat_400Regular',
    },
    infoValue: {
        color: '#fff',
        fontFamily: 'Montserrat_600SemiBold',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#FFFFFF33',
        marginTop: 6,
        marginBottom: 14,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paidLabel: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_700Bold',
    },
    paidValue: {
        color: '#fff',
        fontSize: 20,
        lineHeight: 20,
        fontFamily: 'Montserrat_600SemiBold',
        marginTop: 5,
    },
    cancelButton: {
        backgroundColor: '#D17B68',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'Montserrat_700Bold',
    },
});

export default memo(MyBookingViewCard);