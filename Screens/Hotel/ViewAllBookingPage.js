import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons, Feather } from 'react-native-vector-icons';
import { useNotifications } from '../../context/MessageNotificationContext';
import EmployerFooter from '../../components/EmployerFooter';
import Footer from '../../components/Footer';
import { toastError } from '../../utils/toast';
import HotelPageHeader from '../../components/HotelPageHeader';
import useHotelEvents from './HotelEvent/useHotelEvents';
import HotelFilterModal from './HotelModals/HotelFilterModal';
import { formatDateForApi } from './HotelUtils/HotelFormatDates';
import GradientButton from '../../components/GradientButton';
import { openChat } from "../../utils/openChat";

const STATUS_COLORS = {
    Confirm: '#46A282',
    Cancelled: '#e74c3c',
    Hold: '#F2A93B',
};

export default function ViewAllBookingPage({ route }) {
    const navigation = useNavigation();
    const { admin } = useNotifications();
    const { getAllHotelBookings } = useHotelEvents();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);
    const [filters, setFilters] = useState({
        dateOf: null,
        fromDate: null,
        toDate: null,
        sortBy: null,
    });

    const fetchBookings = useCallback(async (activeFilters) => {
        try {
            setLoading(true);
            const json = await getAllHotelBookings({
                date_type: activeFilters?.dateOf?.value,
                start_date: formatDateForApi(activeFilters?.fromDate),
                end_date: formatDateForApi(activeFilters?.toDate),
                sort_by: activeFilters?.sortBy?.value,
                sort_type: activeFilters?.sortBy?.sortType,
            });
            setBookings(json?.data ?? []);
        } catch (err) {
            toastError(err.message || 'Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    }, [getAllHotelBookings]);

    useFocusEffect(
        useCallback(() => {
            fetchBookings(filters);
        }, [])
    );

    const handleShowResult = () => {
        setFilterVisible(false);
        fetchBookings(filters);
    };

    const renderItem = ({ item }) => {
        const statusColor = STATUS_COLORS[item.status] || '#46A282';

        return (
            <View style={styles.card}>
                <View style={styles.cardTopRow}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {item.first_name?.charAt(0)?.toUpperCase() || '?'}
                        </Text>
                    </View>
                    <View style={styles.cardTopTextWrap}>
                        <Text style={styles.guestName} numberOfLines={1}>
                            {item.first_name} {item.last_name}
                        </Text>
                        <Text style={styles.roomType} numberOfLines={1}>{item.room_type}</Text>
                    </View>
                    <Text style={styles.price}>CAD {Number(item.price).toLocaleString()}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBottomRow}>
                    <View style={styles.dateBlock}>
                        <Text style={styles.dateLabel}>Booked On</Text>
                        <Text style={styles.dateValue}>{item.reservation_date}</Text>
                    </View>
                    <View style={styles.dateBlock}>
                        <Text style={styles.dateLabel}>Check In</Text>
                        <Text style={styles.dateValue}>{item.check_in}</Text>
                    </View>
                    <View style={styles.dateBlock}>
                        <Text style={styles.dateLabel}>Check Out</Text>
                        <Text style={styles.dateValue}>{item.check_out}</Text>
                    </View>
                    <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
                </View>

                <View style={styles.chatBtnSection}>
                    <TouchableOpacity
                        style={[styles.chatBtn, !item?.user_id && styles.disabledChatBtn, ]}
                        onPress={() => {
                            if (item?.user_id) {
                                openChat(navigation, item.user_id);
                            }
                        }}
                        disabled={!item?.user_id}
                    >
                        <Text style={styles.chatBtnText}>{item?.user_id ? 'Chat' : 'Guest Checkout'}</Text>
                        {item?.user_id && (
                            <Feather name="send" size={20} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <HotelPageHeader navigation={navigation} title="All Bookings" />

            <View style={styles.container}>
                <View style={styles.toolbarRow}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setFilterVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="options-outline" size={16} color="#303030" />
                        <Text style={styles.filterButtonText}>Filters</Text>
                        <Ionicons name="chevron-down" size={14} color="#303030" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pdfButton} activeOpacity={0.8}>
                        <Text style={styles.pdfButtonText}>PDF</Text>
                        <Ionicons name="download-outline" size={16} color="#303030" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color="#D17B68" />
                    </View>
                ) : (
                    <FlatList
                        data={bookings}
                        renderItem={renderItem}
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyWrap}>
                                <Text style={styles.emptyText}>No bookings found.</Text>
                            </View>
                        }
                    />
                )}
            </View>

            {admin === 2 ? <EmployerFooter /> : <Footer />}

            <HotelFilterModal
                visible={filterVisible}
                filters={filters}
                onChange={setFilters}
                onClose={() => setFilterVisible(false)}
                onShowResult={handleShowResult}
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
    toolbarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 14,
        paddingBottom: 10,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterButtonText: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
    },
    pdfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pdfButtonText: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
    },
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 100,
    },
    emptyWrap: {
        paddingTop: 60,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#8A8A8A',
    },
    card: {
        borderWidth: 1,
        borderColor: '#f5f5f6',
        backgroundColor: '#f5f5f6',
        borderRadius: 10,
        padding: 16,
        marginBottom: 14,
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#46A282',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 13,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
    },
    cardTopTextWrap: {
        flex: 1,
    },
    guestName: {
        fontSize: 16,
        lineHeight: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
    },
    roomType: {
        fontSize: 12,
        color: '#000000B2',
        fontFamily: 'Montserrat_400Regular',
        marginTop: 4,
    },
    price: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
    },
    divider: {
        height: 1,
        backgroundColor: '#00000033',
        marginTop: 14,
    },
    cardBottomRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 14,
    },
    dateBlock: {
        marginRight: 15,
    },
    dateLabel: {
        fontSize: 10,
        lineHeight: 14,
        color: '#303030',
        fontFamily: 'Montserrat_400Regular',
        marginBottom: 2,
    },
    dateValue: {
        fontSize: 11,
        color: '#1A1A1A',
        fontFamily: 'Montserrat_400Regular',
    },
    statusText: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        marginLeft: 'auto',
    },
    chatBtnSection: {
        marginTop: 12,
    },
    chatBtn: {
        flex: 1,
        backgroundColor: "#46a282",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        gap: 5,
    },
    chatBtnText: {
        color: "#ffffff",
        fontSize: 15,
        lineHeight: 21,
        fontFamily: "Montserrat_700Bold",
        letterSpacing: 0.1,
    },
    disabledChatBtn: {
        opacity: 0.5,
    }
});