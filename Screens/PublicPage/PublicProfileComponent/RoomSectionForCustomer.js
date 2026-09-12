import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { toastError } from '../../../utils/toast';

const CARD_WIDTH = Dimensions.get('window').width * 0.50;
const CARD_HEIGHT = 220;

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "28 Nov 2025" style formatting to match the Figma
const formatDate = (date) => {
    if (!date) return null;
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDay = (date) => {
    if (!date) return null;
    return WEEKDAYS[date.getDay()];
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

const RoomCard = ({ room, onView }) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: room.images?.[0] }} style={styles.cardImage} resizeMode="cover" />

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.8)']}
                locations={[0, 0.55, 1]}
                style={styles.gradient}
            />

            <View style={styles.cardContent}>
                <Text style={styles.roomName} numberOfLines={1}>
                    {room.room_type}
                </Text>
                <Text style={styles.roomPrice}>
                    {Number(room.customer_weekday_rate)} CAD/night
                </Text>

                <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => onView?.(room)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const RoomsSectionForCustomer = ({
    rooms = [],
    onViewRoom,
}) => {
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

    const handleCheckInChange = (event, selectedDate) => {
        setShowCheckInPicker(Platform.OS === 'ios');
        if (event.type === 'dismissed') return;
        if (!selectedDate) return;

        setCheckInDate(selectedDate);

        // Check-out must be strictly after check-in (+1 day minimum) —
        // clear it if it's no longer valid against the new check-in.
        if (checkOutDate) {
            const minCheckOut = addDays(selectedDate, 1);
            if (startOfDay(checkOutDate) < startOfDay(minCheckOut)) {
                setCheckOutDate(null);
            }
        }
    };

    const handleCheckOutChange = (event, selectedDate) => {
        setShowCheckOutPicker(Platform.OS === 'ios');
        if (event.type === 'dismissed') return;
        if (selectedDate) setCheckOutDate(selectedDate);
    };

    // Check-out must be at least one day after check-in — same-day checkout not allowed here.
    const minCheckOutDate = checkInDate ? addDays(checkInDate, 1) : addDays(new Date(), 1);

    const datesAreValid = () => !!checkInDate && !!checkOutDate;

    const handleViewRoom = (room) => {
        if (!datesAreValid()) {
            toastError('Please fill the check-in and check-out dates to proceed.');
            return;
        }
        onViewRoom?.(room, { checkInDate, checkOutDate });
    };

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rooms</Text>

            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={() => setShowCheckInPicker(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="calendar-outline" size={18} color="#ffffff" />
                    <View style={{ marginLeft: 8 }}>
                        <Text style={styles.dateText}>
                            {formatDate(checkInDate) || 'Check-in'}
                        </Text>
                        {!!checkInDate && (
                            <Text style={styles.dayText}>{formatDay(checkInDate)}</Text>
                        )}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={() => setShowCheckOutPicker(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="calendar-outline" size={18} color="#ffffff" />
                    <View style={{ marginLeft: 8 }}>
                        <Text style={styles.dateText}>
                            {formatDate(checkOutDate) || 'Check-out'}
                        </Text>
                        {!!checkOutDate && (
                            <Text style={styles.dayText}>{formatDay(checkOutDate)}</Text>
                        )}
                    </View>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={styles.searchBtn}
                    activeOpacity={0.85}
                >
                    <Ionicons name="search" size={18} color="#000000" />
                    <Text style={styles.searchBtnText}>Search</Text>
                </TouchableOpacity> */}
            </View>

            {showCheckInPicker && (
                <DateTimePicker
                    value={checkInDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    minimumDate={new Date()}
                    onChange={handleCheckInChange}
                />
            )}

            {showCheckOutPicker && (
                <DateTimePicker
                    value={checkOutDate || minCheckOutDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    minimumDate={minCheckOutDate}
                    onChange={handleCheckOutChange}
                />
            )}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsRow}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + 14}
            >
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} onView={handleViewRoom} />
                ))}
            </ScrollView>
        </View>
    );
};

export default RoomsSectionForCustomer;

const styles = StyleSheet.create({
    section: {
        marginTop: 10,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold',
        color: '#ffffff',
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    dateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#ffffff',
    },
    dayText: {
        fontSize: 10,
        fontFamily: 'Montserrat_500Medium',
        color: '#757575',
        marginTop: 1,
    },
    searchBtn: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 6,
    },
    searchBtnText: {
        color: '#000000',
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_500Medium',
    },
    cardsRow: {
        gap: 14,
        marginTop: 5,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#EFEFEF',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.10)',
    },
    cardContent: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 10,
        alignItems: 'center',
    },
    roomName: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_700Bold',
        color: '#FFFFFF',
        marginBottom: 4,
        textAlign: 'center',
    },
    roomPrice: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#47A383',
        marginBottom: 5,
        textAlign: 'center',
    },
    viewBtn: {
        backgroundColor: '#C96B59',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 32,
        alignItems: 'center',
        alignSelf: 'center',
    },
    viewBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
    },
});