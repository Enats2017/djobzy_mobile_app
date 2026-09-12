import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import GradientButton from '../../../components/GradientButton';
import { toastError } from '../../../utils/toast';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ROOM_OPTIONS = [1, 2, 3, 4, 5];
const ADULT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const CHILDRENS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const formatDate = (date) => {
    if (!date) return null;
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

// yyyy-mm-dd key, matching the web's availabilityCache[checkIn] keying
const toDateKey = (date) => {
    const d = startOfDay(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Generic dropdown — used for both "No. Rooms" and "Adults"
const DropdownField = ({ label, icon, value, suffix, options, onSelect }) => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TouchableOpacity
                style={styles.inputBox}
                activeOpacity={0.7}
                onPress={() => setVisible(true)}
            >
                {icon && (
                    <View style={styles.inputIconLeft}>
                        <Ionicons name={icon} size={16} color="#9A9AA0" />
                    </View>
                )}
                <Text style={styles.inputText}>
                    {value} {suffix}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9A9AA0" />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.dropdownSheet}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => String(item)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownOption}
                                    onPress={() => {
                                        onSelect(item);
                                        setVisible(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownOptionText,
                                            item === value && styles.dropdownOptionTextActive,
                                        ]}
                                    >
                                        {item} {suffix}
                                    </Text>
                                    {item === value && (
                                        <Ionicons name="checkmark" size={16} color="#D17B68" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const BookingHotelSummaryCard = ({
    title,
    roomId,
    activePrice = 0,
    weekdayRate = 0,
    weekendRate = 0,
    discountPercent = 0,
    discountFrom = null,
    discountTo = null,
    taxesAndCharges = 0,
    initialCheckIn = null,
    initialCheckOut = null,
    checkAvailability,
    onBook,
}) => {
    const [checkInDate, setCheckInDate] = useState(initialCheckIn ? startOfDay(initialCheckIn) : null);
    const [checkOutDate, setCheckOutDate] = useState(initialCheckOut ? startOfDay(initialCheckOut) : null);
    const [showCheckIn, setShowCheckIn] = useState(false);
    const [showCheckOut, setShowCheckOut] = useState(false);
    const [numRooms, setNumRooms] = useState(1);
    const [adults, setAdults] = useState(1);
    const [childrens, setChildrens] = useState(1);

    const availabilityCacheRef = useRef({});
    const [availabilityVersion, setAvailabilityVersion] = useState(0); // bump to force recompute
    const [bookButtonDisabled, setBookButtonDisabled] = useState(false);
    const [bookButtonText, setBookButtonText] = useState('Book Your Stay Now');

    // Holds the latest checkAvailability fn without making the effect below
    // re-fire just because the parent re-rendered and passed a new function
    // reference (common when the hook doesn't memoize its returned functions).
    const checkAvailabilityRef = useRef(checkAvailability);
    useEffect(() => {
        checkAvailabilityRef.current = checkAvailability;
    }, [checkAvailability]);

    const handleCheckInChange = (event, selectedDate) => {
        setShowCheckIn(Platform.OS === 'ios');
        if (event.type === 'dismissed' || !selectedDate) return;

        const newCheckIn = startOfDay(selectedDate);
        setCheckInDate(newCheckIn);

        // Web only clears check-out if it's strictly BEFORE the new check-in —
        // same-day checkout is allowed.
        if (checkOutDate && startOfDay(checkOutDate) < newCheckIn) {
            setCheckOutDate(null);
        }
    };

    const handleCheckOutChange = (event, selectedDate) => {
        setShowCheckOut(Platform.OS === 'ios');
        if (event.type === 'dismissed' || !selectedDate) return;
        setCheckOutDate(startOfDay(selectedDate));
    };

    // Checkout's minimum matches check-in itself (same-day allowed), not check-in + 1
    const minCheckOutDate = checkInDate || new Date();

    // ---- Pricing (mirrors calculatePrice()) ----
    const pricing = useMemo(() => {
        if (!checkInDate) {
            return { totalCost: 0, firstDayRate: activePrice, nights: 0 };
        }

        const start = startOfDay(checkInDate);
        const end = checkOutDate ? startOfDay(checkOutDate) : null;

        let days = end ? Math.ceil((end - start) / MS_PER_DAY) : 1;
        if (days <= 0) days = 1;

        const checkInKey = toDateKey(start);
        const cached = availabilityCacheRef.current[checkInKey];

        let total = 0;
        let firstDayRate = 0;

        for (let i = 0; i < days; i++) {
            const d = addDays(start, i);
            let rate;

            if (i === 0 && cached?.price !== undefined) {
                rate = cached.price;
            } else {
                const day = d.getDay();
                const isWeekend = day === 5 || day === 6; // Friday, Saturday
                rate = isWeekend ? weekendRate : weekdayRate;
            }

            if (i === 0) firstDayRate = rate;
            total += rate;
        }

        total *= numRooms;

        return { totalCost: total, firstDayRate, nights: days };
        // availabilityVersion is a dependency purely to force recompute once the
        // async availability check resolves and populates the cache.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkInDate, checkOutDate, numRooms, weekdayRate, weekendRate, activePrice, availabilityVersion]);

    // ---- Discount (mirrors the unchanged discount block) ----
    const discountAmount = useMemo(() => {
        if (!checkInDate || !discountFrom || !discountTo || discountPercent <= 0) return 0;
        const start = startOfDay(checkInDate);
        const from = startOfDay(new Date(discountFrom));
        const to = startOfDay(new Date(discountTo));
        if (start >= from && start <= to) {
            return (pricing.totalCost * discountPercent) / 100;
        }
        return 0;
    }, [checkInDate, discountFrom, discountTo, discountPercent, pricing.totalCost]);

    const grandTotal = pricing.totalCost + taxesAndCharges - discountAmount;

    // ---- Availability (mirrors checkAvailabilityForCheckIn / applyAvailabilityUI) ----
    useEffect(() => {
        if (!checkInDate || !checkAvailabilityRef.current) return;
        let cancelled = false;
        setBookButtonDisabled(true);
        setBookButtonText('Checking availability...');
        const applyAvailabilityUI = (res) => {
            if (cancelled) return;
            if (res.is_available === false || res.available <= 0) {
                setBookButtonDisabled(true);
                setBookButtonText('Fully Booked');
                return;
            }

            if (numRooms > res.available) {
                toastError(`Only ${res.available} room(s) are available on the selected date. Please reduce the number of rooms.`);
                setNumRooms(res.available);
            }

            setBookButtonDisabled(false);
            setBookButtonText('Book Your Stay Now');
        };

        const run = async () => {
            // Inside the availability useEffect, right after computing `key`:
            const key = toDateKey(checkInDate);
            const cached = availabilityCacheRef.current[key];
            if (cached) {
                applyAvailabilityUI(cached);
                return;
            }

            try {
                const res = await checkAvailabilityRef.current(roomId, key);
                if (cancelled) return;
                availabilityCacheRef.current[key] = res;
                setAvailabilityVersion((v) => v + 1);
                applyAvailabilityUI(res);
            } catch (err) {
                console.log('[availability] API error:', err);
            }
        };

        run();

        return () => {
            cancelled = true;
        };
        // Re-checks on check-in, check-out, rooms, or adults changing — same trigger set as web.
    }, [checkInDate, checkOutDate, numRooms, adults, roomId]);

    const handleBookPress = () => {
        if (!checkInDate || !checkOutDate) {
            toastError('Please fill the check-in and check-out dates to proceed.');
            return;
        }
        if (bookButtonDisabled) return;

        onBook?.({
            checkInDate,
            checkOutDate,
            numRooms,
            adults,
            childrens,
            totalCost: pricing.totalCost,
            taxesAndCharges,
            discountAmount,
            grandTotal,
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <View style={styles.perRoomWrap}>
                    <Text style={styles.perRoomLabel}>per room</Text>
                    <Text style={styles.perRoomValue}>CAD {Number(pricing.firstDayRate).toFixed(2)}</Text>
                </View>
            </View>

            {/* Check In */}
            <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Check In</Text>
                <TouchableOpacity
                    style={styles.inputBox}
                    activeOpacity={0.7}
                    onPress={() => setShowCheckIn(true)}
                >
                    <Text style={[styles.inputText, !checkInDate && styles.placeholderText]}>
                        {formatDate(checkInDate) || 'Select date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color="#303030" />
                </TouchableOpacity>
            </View>

            {showCheckIn && (
                <DateTimePicker
                    value={checkInDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    minimumDate={new Date()}
                    onChange={handleCheckInChange}
                />
            )}

            {/* Check Out */}
            <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Check Out</Text>
                <TouchableOpacity
                    style={styles.inputBox}
                    activeOpacity={0.7}
                    onPress={() => setShowCheckOut(true)}
                >
                    <Text style={[styles.inputText, !checkOutDate && styles.placeholderText]}>
                        {formatDate(checkOutDate) || 'Select date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color="#303030" />
                </TouchableOpacity>
            </View>

            {showCheckOut && (
                <DateTimePicker
                    value={checkOutDate || minCheckOutDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    minimumDate={minCheckOutDate}
                    onChange={handleCheckOutChange}
                />
            )}

            {/* No. Rooms */}
            <DropdownField
                label="No. Rooms"
                value={numRooms}
                suffix="Rooms"
                options={ROOM_OPTIONS}
                onSelect={setNumRooms}
            />

            {/* Adults */}
            <DropdownField
                label="Adults"
                icon="person-outline"
                value={adults}
                suffix="Adults"
                options={ADULT_OPTIONS}
                onSelect={setAdults}
            />

            {/* childrens */}
            <DropdownField
                label="Childrens"
                icon="person-outline"
                value={childrens}
                suffix="Childrens"
                options={CHILDRENS_OPTIONS}
                onSelect={setChildrens}
            />

            {/* Total Cost */}
            <View style={styles.totalCostRow}>
                <Text style={styles.totalCostLabel}>Total Cost:</Text>
                <Text style={styles.totalCostValue}>{pricing.totalCost.toFixed(2)} CAD</Text>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Taxes and charges</Text>
                <Text style={styles.breakdownValue}>+ {taxesAndCharges.toFixed(2)} CAD</Text>
            </View>
            {discountAmount > 0 && (
                <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Discount</Text>
                    <Text style={styles.breakdownValue}>- {discountPercent}%</Text>
                </View>
            )}

            <View style={styles.dashedDivider} />

            <View style={styles.totalCostRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>{grandTotal.toFixed(2)} CAD</Text>
            </View>

            <GradientButton
                title={bookButtonText}
                onPress={handleBookPress}
                disabled={bookButtonDisabled}
            />
        </View>
    );
};

export default BookingHotelSummaryCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#303030',
        marginTop: 20,
        padding: 15,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
        marginRight: 10,
    },
    perRoomWrap: {
        alignItems: 'flex-end',
    },
    perRoomLabel: {
        fontSize: 15,
        lineHeight: 15,
        fontFamily: 'Montserrat_400Regular',
        color: '#ffffff',
    },
    perRoomValue: {
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
    },
    fieldBlock: {
        marginBottom: 14,
    },
    fieldLabel: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Montserrat_500Medium',
        color: '#ffffff',
        marginBottom: 6,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#C5C5C5",
        paddingHorizontal: 14,
        paddingVertical: 13,
    },
    inputIconLeft: {
        marginRight: 8,
    },
    inputText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#303030',
    },
    placeholderText: {
        color: '#B0B0B0',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
        // paddingHorizontal: 40,
    },
    dropdownSheet: {
        backgroundColor: '#FFFFFF',
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        maxHeight: 280,
        paddingVertical: 6,
    },
    dropdownOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 13,
    },
    dropdownOptionText: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#303030',
    },
    dropdownOptionTextActive: {
        color: '#CB7767',
        fontFamily: 'Montserrat_600SemiBold',
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
        marginBottom: 12,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    breakdownLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#ffffff',
    },
    breakdownValue: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#ffffff',
    },
    grandTotalLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#FFFFFF',
    },
    grandTotalValue: {
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold',
        color: '#D38979',
    },
});