import React from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientButton from '../../../components/GradientButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pluralize = (count, singular, plural) => (count === 1 ? singular : plural);

const formatShortDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const BookingConfirmationModal = ({
    visible,
    onClose,
    booking,
    address,
    draft,
    onPay,
}) => {
    const {
        checkInDate,
        checkOutDate,
        numRooms = 1,
        adults = 1,
        childrens = 1,
        totalCost = 0,
        taxesAndCharges = 0,
        discountAmount = 0,
        grandTotal = 0,
    } = draft ?? {};

    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <Pressable style={styles.backdropTouchable} activeOpacity={1} onPress={onClose} />
                <View style={styles.sheetWrapper}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="close" size={20} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={[styles.sheet, { paddingBottom: insets.bottom }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.imageWrap}>
                                <Image source={{ uri: booking?.images?.[0] }} style={styles.image} resizeMode="cover" />
                            </View>

                            <View style={styles.content}>
                                <Text style={styles.title}>{booking?.room_type}</Text>

                                {!!address?.address && (
                                    <View style={styles.addressRow}>
                                        <MaterialCommunityIcons name="office-building-outline" size={16} color="#4A4A4A" />
                                        <Text style={styles.addressText}>
                                            {address.address}
                                        </Text>
                                    </View>
                                )}

                                <Text style={styles.sectionTitle}>Your Booking Details</Text>

                                <View style={styles.datesRow}>
                                    <View style={styles.dateBox}>
                                        <Text style={styles.dateLabel}>Check-In</Text>
                                        <Text style={styles.dateValue}>{formatShortDate(checkInDate)}</Text>
                                    </View>
                                    <View style={styles.dateBox}>
                                        <Text style={styles.dateLabel}>Check-Out</Text>
                                        <Text style={styles.dateValue}>{formatShortDate(checkOutDate)}</Text>
                                    </View>
                                </View>

                                <View style={styles.selectionBox}>
                                    <Text style={styles.selectionLabel}>You Selected</Text>
                                    <Text style={styles.selectionValue}>
                                        {numRooms} {pluralize(numRooms, 'Room', 'Rooms')} for {adults} {pluralize(adults, 'Adult', 'Adults')} and {childrens} {pluralize(childrens, 'Children', 'Childrens')}
                                    </Text>
                                </View>

                                <View style={styles.totalCostRow}>
                                    <Text style={styles.totalCostLabel}>Total Cost:</Text>
                                    <Text style={styles.totalCostValue}>${totalCost.toFixed(2)}</Text>
                                </View>

                                <View style={styles.dashedDivider} />

                                <View style={styles.breakdownRow}>
                                    <Text style={styles.breakdownLabel}>Taxes and charges</Text>
                                    <Text style={styles.breakdownValue}>+ ${taxesAndCharges.toFixed(2)}</Text>
                                </View>
                                {discountAmount > 0 && (
                                    <View style={styles.breakdownRow}>
                                        <Text style={styles.breakdownLabel}>Discount</Text>
                                        <Text style={styles.breakdownValue}>- ${discountAmount.toFixed(2)}</Text>
                                    </View>
                                )}

                                <View style={styles.dashedDivider} />

                                <View style={styles.totalCostRow}>
                                    <Text style={styles.grandTotalLabel}>Total</Text>
                                    <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
                                </View>

                                <GradientButton title='Pay' onPress={() => onPay(draft)} />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default BookingConfirmationModal;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    backdropTouchable: {
        ...StyleSheet.absoluteFillObject,
    },
    sheetWrapper: {
        position: 'relative',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        maxHeight: SCREEN_HEIGHT * 0.9,
        overflow: 'hidden',
    },
    imageWrap: {
        position: 'relative',
        width: '100%',
        height: 210,
        padding: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: '#edecef',
        borderRadius: 10,
    },
    closeBtn: {
        position: 'absolute',
        top: -40,
        right: 10,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 10,
        paddingTop: 15,
        paddingBottom: 30,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginBottom: 8,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        marginBottom: 20,
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#000000',
        lineHeight: 19,
    },
    seeMapText: {
        color: '#D17B68',
        fontFamily: 'Montserrat_600SemiBold',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginBottom: 10,
    },
    datesRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    dateBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#dadada',
        borderRadius: 10,
        padding: 10,
    },
    dateLabel: {
        fontSize: 12,
        lineHeight: 17,
        fontFamily: 'Montserrat_400Regular',
        color: '#000000',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
    },
    timeValue: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#999999',
    },
    selectionBox: {
        borderWidth: 1,
        borderColor: '#dadada',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    selectionLabel: {
        fontSize: 12,
        lineHeight: 17,
        fontFamily: 'Montserrat_400Regular',
        color: '#000000',
        marginBottom: 4,
    },
    selectionValue: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
    },
    totalCostRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalCostLabel: {
        fontSize: 16,
        fontFamily: 'Montserrat_500Medium',
        color: '#000000',
    },
    totalCostValue: {
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
    },
    dashedDivider: {
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderBottomColor: '#000000',
        marginBottom: 12,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    breakdownLabel: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_400Regular',
        color: '#000000',
    },
    breakdownValue: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_400Regular',
        color: '#000000',
    },
    grandTotalLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#000000',
    },
    grandTotalValue: {
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold',
        color: '#D17B68',
    },
    payBtn: {
        borderRadius: 12,
        height: 45,
        alignItems: 'center',
        marginTop: 10,
        justifyContent: "center",
    },

    payLoginBtn: {
        backgroundColor: '#3F8E7A',
    },
    payBtnText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold',
    },
});
