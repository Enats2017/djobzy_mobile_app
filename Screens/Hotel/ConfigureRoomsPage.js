import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    ScrollView,
    TouchableOpacity,
    Pressable,
    Modal,
    ActivityIndicator,
    RefreshControl,
    Platform,
    AppState,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../api/ApiUrl';
import { useNotifications } from '../../context/MessageNotificationContext';
import EmployerFooter from '../../components/EmployerFooter';
import Footer from '../../components/Footer';
import GradientButton from '../../components/GradientButton';
import HotelPageHeader from '../../components/HotelPageHeader';
import { toastError, toastInfo, toastSuccess } from '../../utils/toast';
import useHotelEvents from './HotelEvent/useHotelEvents';
import ConfigureRoomDayModal from './HotelModals/ConfigureRoomDayModal';
import { formatDateForApi } from './HotelUtils/HotelFormatDates';
import ConfigureAllRoomsModal from './HotelModals/ConfigureAllRoomsModal';

const ALL_ROOMS = { id: 0, label: 'All Rooms' };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Same default window the web page opens with: today through one month out. */
const defaultRange = () => {
    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    return { start, end };
};

const formatRangeLabel = (date) => {
    if (!date) return '';
    return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const formatMoney = (value) => `CAD ${Math.round(Number(value) || 0)}`;

const TIMEZONE_CACHE_KEY = 'user_timezone';

/**
 * `user_address.timezone` holds IANA ids, but the column is nullable and the
 * settings dropdown can also write its "Select Timezone" placeholder into it,
 * so a value is only trusted once Intl accepts it as a real zone. Anything else
 * is treated as "no timezone" and the device clock is used instead.
 */
const isUsableTimeZone = (timeZone) => {
    if (!timeZone || typeof timeZone !== 'string') return false;
    try {
        new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date());
        return true;
    } catch (e) {
        return false;
    }
};

/** Wall-clock parts inside `timeZone`, falling back to the device's own clock. */
const zonedParts = (timeZone, at) => {
    if (timeZone) {
        try {
            const parts = new Intl.DateTimeFormat('en-CA', {
                timeZone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hourCycle: 'h23',
            }).formatToParts(at).reduce((acc, part) => {
                acc[part.type] = part.value;
                return acc;
            }, {});

            return {
                dateKey: `${parts.year}-${parts.month}-${parts.day}`,
                // h23 still reports midnight as 24 on some engines.
                hour: Number(parts.hour) % 24,
                minute: Number(parts.minute),
                second: Number(parts.second),
            };
        } catch (e) {
            // Zone was rejected at format time — fall through to device time.
        }
    }

    return {
        dateKey: formatDateForApi(at),
        hour: at.getHours(),
        minute: at.getMinutes(),
        second: at.getSeconds(),
    };
};

/**
 * The calendar date it currently is *for the user*, rolled over the moment
 * their zone crosses midnight. That is what makes a card stop being editable
 * exactly when its own date ends for them, rather than when it ends on the
 * device — a phone in a zone that is already on the 13th keeps the 12th
 * editable while the user's stored zone is still on the 12th.
 */
function useTodayKey(timeZone) {
    const [todayKey, setTodayKey] = useState(() => zonedParts(timeZone, new Date()).dateKey);

    useEffect(() => {
        let timeoutId = null;

        const tick = () => {
            const { dateKey, hour, minute, second } = zonedParts(timeZone, new Date());
            setTodayKey(dateKey);

            const msUntilMidnight = (86400 - (hour * 3600 + minute * 60 + second)) * 1000;

            // A second past the boundary, so the timer can never land a hair
            // early and leave yesterday's date in place. Capped at 15 minutes so
            // a DST shift or a long doze cannot strand a stale date on screen.
            timeoutId = setTimeout(
                tick,
                Math.min(Math.max(msUntilMidnight + 1000, 1000), 900000),
            );
        };

        tick();

        // Timers do not fire reliably while the app is backgrounded, so the
        // date is also re-read whenever it comes back to the foreground.
        const subscription = AppState.addEventListener('change', (state) => {
            if (state !== 'active') return;
            if (timeoutId) clearTimeout(timeoutId);
            tick();
        });

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            subscription.remove();
        };
    }, [timeZone]);

    return todayKey;
}

/**
 * Every label a card shows is derived once, when the payload lands, instead of
 * on each render. Date parsing and money formatting across a month of rows per
 * room was the bulk of the list's render cost.
 */
const decorateDay = (day, roomId) => {
    const parsed = new Date(`${day.date}T00:00:00`);
    const valid = !Number.isNaN(parsed.getTime());
    const soldOut = day.is_sold_out === true || day.is_sold_out === 1;

    return {
        raw: day,
        key: `${roomId}-${day.date}`,
        date: day.date,
        dayNum: valid ? String(parsed.getDate()).padStart(2, '0') : day.date,
        monthLabel: valid ? MONTHS[parsed.getMonth()] : '',
        weekday: day.day,
        soldOut,
        statusLabel: soldOut ? 'Sold Out' : 'Bookable',
        toSellLabel: soldOut ? '-' : String(day.total ?? 0),
        bookedLabel: String(day.booked ?? 0),
        availableLabel: soldOut ? '-' : String(day.available ?? 0),
        customerLabel: soldOut ? '-' : formatMoney(day.customer_price),
        ownerLabel: soldOut ? '-' : formatMoney(day.price),
    };
};

const Stat = memo(function Stat({ label, value, compact, tone }) {
    return (
        <View style={[styles.stat, compact && styles.statCompact]}>
            <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
            <Text style={[styles.statValue, tone && { color: tone }]} numberOfLines={1}>{value}</Text>
        </View>
    );
});

/**
 * Memoised so that opening the picker, toggling a filter or saving a single
 * date no longer re-renders every other card in the list.
 */
const DayCard = memo(function DayCard({ day, roomId, roomName, compact, todayKey, onPress }) {
    // Derived per render rather than at decode time: `todayKey` advances on its
    // own at the user's midnight, and the card has to follow it without a refetch.
    const isPast = day.date < todayKey;
    const handlePress = useCallback(
        () => onPress(roomId, roomName, day, isPast),
        [onPress, roomId, roomName, day, isPast],
    );

    return (
        <TouchableOpacity
            style={[styles.card, isPast && styles.cardPast]}
            activeOpacity={isPast ? 1 : 0.8}
            onPress={handlePress}
        >
            <View style={styles.cardTopRow}>
                <View style={styles.datePill}>
                    <Text style={styles.datePillDay}>{day.dayNum}</Text>
                    <Text style={styles.datePillMonth}>{day.monthLabel}</Text>
                </View>

                <View style={styles.cardTopTextWrap}>
                    <Text style={styles.weekday} numberOfLines={1}>{day.weekday}</Text>
                    <View
                        style={[
                            styles.statusPill,
                            day.soldOut ? styles.statusPillSoldOut : styles.statusPillBookable,
                        ]}
                    >
                        <Text style={styles.statusPillText}>{day.statusLabel}</Text>
                    </View>
                </View>

                {!isPast && <Ionicons name="create-outline" size={18} color="#CB7767" />}
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
                <Stat label="To Sell" value={day.toSellLabel} compact={compact} />
                <Stat label="Booked" value={day.bookedLabel} compact={compact} />
                <Stat
                    label="Available"
                    value={day.availableLabel}
                    compact={compact}
                    tone={day.soldOut ? undefined : '#46A282'}
                />
                <Stat label="Customer" value={day.customerLabel} compact={compact} />
                <Stat label="Owner" value={day.ownerLabel} compact={compact} />
            </View>
        </TouchableOpacity>
    );
});

export default function ConfigureRoomsPage() {
    const navigation = useNavigation();
    const { admin } = useNotifications();
    const { width } = useWindowDimensions();

    // `useHotelEvents` hands back fresh closures on every render, so it is held
    // in a ref and every callback below can stay referentially stable.
    const api = useHotelEvents();
    const apiRef = useRef(api);
    apiRef.current = api;

    const initialRange = useMemo(defaultRange, []);

    const [rooms, setRooms] = useState([ALL_ROOMS]);
    const [selectedRoom, setSelectedRoom] = useState(ALL_ROOMS);
    const [roomPickerOpen, setRoomPickerOpen] = useState(false);
    const [startDate, setStartDate] = useState(initialRange.start);
    const [endDate, setEndDate] = useState(initialRange.end);
    const [iosPicker, setIosPicker] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [timeZone, setTimeZone] = useState(null);

    // Mirrors of the filter state, so callbacks can read the current values
    // without listing them as dependencies and being rebuilt on every change.
    const selectedRoomRef = useRef(selectedRoom);
    const startRef = useRef(startDate);
    const endRef = useRef(endDate);
    const editingRef = useRef(null);
    const savingRef = useRef(false);
    const iosPickerRef = useRef(null);
    const requestIdRef = useRef(0);

    selectedRoomRef.current = selectedRoom;
    startRef.current = startDate;
    endRef.current = endDate;
    editingRef.current = editing;
    savingRef.current = saving;
    iosPickerRef.current = iosPicker;

    const todayKey = useTodayKey(timeZone);
    const todayKeyRef = useRef(todayKey);
    todayKeyRef.current = todayKey;
    // Below this the five stat columns stop fitting on one line, so they wrap.
    const isCompact = width < 360;

    const startLabel = useMemo(() => formatRangeLabel(startDate), [startDate]);
    const endLabel = useMemo(() => formatRangeLabel(endDate), [endDate]);

    /**
     * `user_address.timezone` is not part of the stored `user` blob (login only
     * persists the `users` row), and `/rooms-configure` does not carry it
     * either. `/setting` is the endpoint that already joins `user_address`, so
     * that is where the zone is read from, then cached for an instant next open.
     */
    useEffect(() => {
        let cancelled = false;

        const resolveTimeZone = async () => {
            try {
                const cached = await AsyncStorage.getItem(TIMEZONE_CACHE_KEY);
                if (!cancelled && isUsableTimeZone(cached)) setTimeZone(cached);
            } catch (e) {
                // Cache is an optimisation only.
            }

            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch(`${API_URL}/setting`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                const json = await response.json();
                const stored = json?.userDetails?.timezone ?? null;

                console.log('[ConfigureRooms] user_address.timezone:', stored, '| usable:', isUsableTimeZone(stored));

                if (isUsableTimeZone(stored)) {
                    await AsyncStorage.setItem(TIMEZONE_CACHE_KEY, stored);
                    if (!cancelled) setTimeZone(stored);
                } else {
                    // Null, blank, or the "Select Timezone" placeholder: the
                    // device clock is the documented fallback.
                    await AsyncStorage.removeItem(TIMEZONE_CACHE_KEY);
                    if (!cancelled) setTimeZone(null);
                }
            } catch (e) {
                // Offline or the call failed: whatever the cache seeded stands,
                // and with nothing cached that is already the device clock.
            }
        };

        resolveTimeZone();
        return () => { cancelled = true; };
    }, []);

    const loadRooms = useCallback(async () => {
        try {
            const json = await apiRef.current.getConfigurableRooms();
            const options = (json?.data ?? []).map((room) => ({
                id: room.id,
                label: room.room_type,
            }));
            setRooms([ALL_ROOMS, ...options]);
            console.log('[ConfigureRooms] rooms:', JSON.stringify(json?.data));
        } catch (err) {
            toastError(err.message || 'Failed to load rooms.');
        }
    }, []);

    /**
     * `mode` decides how the fetch presents itself: 'initial' blocks with a
     * spinner, 'silent' keeps the current list on screen behind a light overlay
     * so changing a filter feels immediate, 'pull' defers to RefreshControl.
     */
    const refresh = useCallback(async (room, start, end, mode = 'silent') => {
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;

        if (mode === 'initial') setLoading(true);
        else if (mode === 'silent') setUpdating(true);

        try {
            const json = await apiRef.current.getRoomConfigData({
                room: room?.id ?? 0,
                start: formatDateForApi(start),
                end: formatDateForApi(end),
            });

            // A newer request has already been fired — drop this response so a
            // slow earlier fetch cannot overwrite fresher data.
            if (requestId !== requestIdRef.current) return;

            const next = json?.type === 'all'
                ? (json.rooms ?? []).map((entry) => ({
                    roomId: entry.id,
                    title: entry.name,
                    data: (entry.data ?? []).map((day) => decorateDay(day, entry.id)),
                }))
                : [{
                    roomId: json?.id,
                    title: json?.name,
                    data: (json?.data ?? []).map((day) => decorateDay(day, json?.id)),
                }];

            setSections(next);
        } catch (err) {
            if (requestId !== requestIdRef.current) return;
            toastError(err.message || 'Failed to load room data.');
            setSections([]);
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
                setUpdating(false);
                setRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        loadRooms();
        refresh(selectedRoomRef.current, startRef.current, endRef.current, 'initial');
    }, [loadRooms, refresh]);

    // Coming back from another screen only re-reads the grid, and does it
    // without tearing the list down. The first focus is already covered above.
    const skipFocusRef = useRef(true);
    useFocusEffect(
        useCallback(() => {
            if (skipFocusRef.current) {
                skipFocusRef.current = false;
                return;
            }
            refresh(selectedRoomRef.current, startRef.current, endRef.current, 'silent');
        }, [refresh]),
    );

    const handleRoomSelect = useCallback((room) => {
        setRoomPickerOpen(false);
        setSelectedRoom(room);
        refresh(room, startRef.current, endRef.current, 'silent');
    }, [refresh]);

    const applyDate = useCallback((which, selected) => {
        if (which === 'start') {
            // Keep the range valid rather than letting the API return an empty grid.
            const nextEnd = selected > endRef.current ? selected : endRef.current;
            setStartDate(selected);
            setEndDate(nextEnd);
            refresh(selectedRoomRef.current, selected, nextEnd, 'silent');
        } else {
            setEndDate(selected);
            refresh(selectedRoomRef.current, startRef.current, selected, 'silent');
        }
    }, [refresh]);

    /**
     * Android uses the imperative API rather than a conditionally rendered
     * element. The rendered form re-opened itself whenever the screen
     * re-rendered while it was mounted, and its dismiss tap fell through to the
     * card underneath, which is what was opening the editor unprompted.
     */
    const openDatePicker = useCallback((which) => {
        const current = which === 'start' ? startRef.current : endRef.current;

        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: current,
                mode: 'date',
                minimumDate: which === 'end' ? startRef.current : undefined,
                onChange: (event, selected) => {
                    if (event.type !== 'set' || !selected) return;
                    applyDate(which, selected);
                },
            });
            return;
        }

        setIosPicker({ which, draft: current });
    }, [applyDate]);

    const openStartPicker = useCallback(() => openDatePicker('start'), [openDatePicker]);
    const openEndPicker = useCallback(() => openDatePicker('end'), [openDatePicker]);

    const closeIosPicker = useCallback(() => setIosPicker(null), []);

    const confirmIosPicker = useCallback(() => {
        const current = iosPickerRef.current;
        setIosPicker(null);
        if (current) applyDate(current.which, current.draft);
    }, [applyDate]);

    const openDayEditor = useCallback((roomId, roomName, day, isPast) => {
        // Re-checked against the ref as well, so a card rendered just before the
        // user's midnight cannot be opened a moment after it.
        if (isPast || day.date < todayKeyRef.current) {
            toastInfo('Past dates cannot be modified.');
            return;
        }
        if (editingRef.current) return;
        setEditing({ roomId, roomName, day: day.raw });
    }, []);

    const closeDayEditor = useCallback(() => {
        if (savingRef.current) return;
        setEditing(null);
    }, []);

    const handleSaveDay = useCallback(async (values) => {
        const current = editingRef.current;
        if (!current) return;

        const { roomId, day } = current;
        const original = {
            soldOut: day.is_sold_out === true || day.is_sold_out === 1,
            quantity: Number(day.total ?? 0),
            ownerRate: Math.round(Number(day.price) || 0),
            customerRate: Math.round(Number(day.customer_price) || 0),
        };

        // Owner rate must be saved before customer rate: the owner-rate endpoint
        // recalculates the customer price from the commission, so sending them
        // the other way round would overwrite an explicit customer rate.
        const requests = [];

        if (values.soldOut !== original.soldOut) {
            requests.push(() => apiRef.current.updateRoomStatus({
                roomId,
                date: day.date,
                isSoldOut: values.soldOut,
            }));
        }
        if (values.quantity !== null && values.quantity !== original.quantity) {
            requests.push(() => apiRef.current.updateRoomQuantity({
                roomId,
                date: day.date,
                totalQuantity: values.quantity,
                price: day.price,
            }));
        }
        if (values.ownerRate !== null && values.ownerRate !== original.ownerRate) {
            requests.push(() => apiRef.current.updateRoomPrice({
                roomId,
                date: day.date,
                price: values.ownerRate,
            }));
        }
        if (values.customerRate !== null && values.customerRate !== original.customerRate) {
            requests.push(() => apiRef.current.updateRoomCustomerPrice({
                roomId,
                date: day.date,
                price: values.ownerRate ?? day.price,
                customerPrice: values.customerRate,
            }));
        }

        if (!requests.length) {
            setEditing(null);
            return;
        }

        setSaving(true);
        try {
            for (const request of requests) {
                const response = await request();
                if (!response?.success) {
                    throw new Error(response?.error || response?.message || 'Update failed.');
                }
            }
            toastSuccess('Room updated successfully.');
        } catch (err) {
            toastError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setSaving(false);
            setEditing(null);
            // Reloaded either way, so the grid never keeps a value the server
            // rejected part-way through the sequence.
            refresh(selectedRoomRef.current, startRef.current, endRef.current, 'silent');
        }
    }, [refresh]);

    const handlePullRefresh = useCallback(() => {
        setRefreshing(true);
        refresh(selectedRoomRef.current, startRef.current, endRef.current, 'pull');
    }, [refresh]);

    const renderItem = useCallback(({ item, section }) => (
        <DayCard
            day={item}
            roomId={section.roomId}
            roomName={section.title}
            compact={isCompact}
            todayKey={todayKey}
            onPress={openDayEditor}
        />
    ), [isCompact, todayKey, openDayEditor]);

    const renderSectionHeader = useCallback(({ section }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText} numberOfLines={1}>{section.title}</Text>
        </View>
    ), []);

    const keyExtractor = useCallback((item) => item.key, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <HotelPageHeader navigation={navigation} title="Configure Rooms" />

            <View style={styles.container}>
                <View style={styles.filterBlock}>
                    <Text style={styles.filterLabel}>Select room</Text>
                    <TouchableOpacity
                        style={styles.field}
                        activeOpacity={0.8}
                        onPress={() => setRoomPickerOpen(true)}
                    >
                        <Text style={styles.fieldValue} numberOfLines={1}>{selectedRoom.label}</Text>
                        <Ionicons name="chevron-down" size={18} color="#6B6B6B" />
                    </TouchableOpacity>

                    <View style={[styles.dateRow, isCompact && styles.dateRowCompact]}>
                        <View style={styles.dateCol}>
                            <Text style={styles.filterLabel}>From</Text>
                            <TouchableOpacity
                                style={styles.field}
                                activeOpacity={0.8}
                                onPress={openStartPicker}
                            >
                                <Text style={styles.fieldValue} numberOfLines={1}>{startLabel}</Text>
                                <Ionicons name="calendar-outline" size={16} color="#6B6B6B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.dateCol}>
                            <Text style={styles.filterLabel}>To</Text>
                            <TouchableOpacity
                                style={styles.field}
                                activeOpacity={0.8}
                                onPress={openEndPicker}
                            >
                                <Text style={styles.fieldValue} numberOfLines={1}>{endLabel}</Text>
                                <Ionicons name="calendar-outline" size={16} color="#6B6B6B" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.helpText}>
                        Tap a date to change its rooms to sell, rates or sold-out status.
                    </Text>
                </View>

                <View style={styles.listWrap}>
                    {loading ? (
                        <View style={styles.loadingWrap}>
                            <ActivityIndicator size="large" color="#D17B68" />
                        </View>
                    ) : (
                        <SectionList
                            sections={sections}
                            keyExtractor={keyExtractor}
                            renderItem={renderItem}
                            renderSectionHeader={renderSectionHeader}
                            stickySectionHeadersEnabled
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={8}
                            maxToRenderPerBatch={8}
                            windowSize={7}
                            updateCellsBatchingPeriod={50}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handlePullRefresh}
                                    colors={['#D17B68']}
                                    tintColor="#D17B68"
                                />
                            }
                            ListEmptyComponent={
                                <View style={styles.emptyWrap}>
                                    <Text style={styles.emptyText}>
                                        No dates to configure for this selection.
                                    </Text>
                                </View>
                            }
                        />
                    )}

                    {updating && !loading && (
                        <View pointerEvents="none" style={styles.updatingOverlay}>
                            <View style={styles.updatingChip}>
                                <ActivityIndicator size="small" color="#D17B68" />
                                <Text style={styles.updatingText}>Updating…</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {admin === 2 ? <EmployerFooter /> : <Footer />}

            {Platform.OS === 'ios' && (
                <Modal
                    visible={!!iosPicker}
                    transparent
                    animationType="fade"
                    onRequestClose={closeIosPicker}
                >
                    <Pressable style={styles.backdrop} onPress={closeIosPicker}>
                        <Pressable style={styles.sheet} onPress={() => { }}>
                            <Text style={styles.sheetTitle}>
                                {iosPicker?.which === 'start' ? 'From date' : 'To date'}
                            </Text>
                            <DateTimePicker
                                value={iosPicker?.draft ?? new Date()}
                                mode="date"
                                display="spinner"
                                minimumDate={iosPicker?.which === 'end' ? startDate : undefined}
                                onChange={(event, selected) => {
                                    if (!selected) return;
                                    setIosPicker((current) => (
                                        current ? { ...current, draft: selected } : current
                                    ));
                                }}
                            />
                            <GradientButton title="Apply" onPress={confirmIosPicker} marginTop={4} />
                            <TouchableOpacity style={styles.sheetCancel} onPress={closeIosPicker}>
                                <Text style={styles.sheetCancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </Pressable>
                </Modal>
            )}

            <ConfigureAllRoomsModal
                visible={roomPickerOpen}
                onClose={() => setRoomPickerOpen(false)}
                rooms={rooms}
                selectedRoom={selectedRoom}
                onRoomSelect={handleRoomSelect}
            />
            <ConfigureRoomDayModal
                visible={!!editing}
                roomName={editing?.roomName}
                day={editing?.day}
                saving={saving}
                onClose={closeDayEditor}
                onSave={handleSaveDay}
            />
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
        paddingHorizontal: 15,
    },
    filterBlock: {
        paddingTop: 14,
    },
    filterLabel: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
        marginBottom: 6,
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    fieldValue: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Montserrat_500Medium',
        color: '#303030',
    },
    dateRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    dateRowCompact: {
        flexDirection: 'column',
    },
    dateCol: {
        flex: 1,
    },
    helpText: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Montserrat_400Regular',
        color: '#000',
        marginTop: 10,
    },
    listWrap: {
        flex: 1,
    },
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updatingOverlay: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    updatingChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    updatingText: {
        fontSize: 12,
        lineHeight: 17,
        fontFamily: 'Montserrat_500Medium',
        color: '#303030',
    },
    listContent: {
        paddingTop: 8,
        paddingBottom: 100,
        flexGrow: 1,
    },
    sectionHeader: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
    },
    sectionHeaderText: {
        fontSize: 15,
        lineHeight: 21,
        fontFamily: 'Montserrat_700Bold',
        color: '#CB7767',
    },
    emptyWrap: {
        paddingTop: 60,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000',
        textAlign: 'center',
    },
    card: {
        borderWidth: 1,
        borderColor: '#efefef',
        backgroundColor: '#efefef',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
    },
    cardPast: {
        opacity: 0.55,
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    datePill: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    datePillDay: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'Montserrat_700Bold',
        color: '#303030',
    },
    datePillMonth: {
        fontSize: 10,
        lineHeight: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#000',
        textTransform: 'uppercase',
    },
    cardTopTextWrap: {
        flex: 1,
    },
    weekday: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
    },
    statusPill: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 20,
        marginTop: 4,
    },
    statusPillBookable: {
        backgroundColor: '#46A282',
    },
    statusPillSoldOut: {
        backgroundColor: '#e74c3c',
    },
    statusPillText: {
        fontSize: 10,
        lineHeight: 15,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
    },
    divider: {
        height: 1,
        backgroundColor: '#00000020',
        marginTop: 12,
    },
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        rowGap: 10,
    },
    stat: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '20%',
        minWidth: 64,
        paddingRight: 6,
    },
    statCompact: {
        flexBasis: '33%',
    },
    statLabel: {
        fontSize: 10,
        lineHeight: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#303030',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 12,
        lineHeight: 17,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#1A1A1A',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    sheet: {
        width: '100%',
        maxWidth: 420,
        maxHeight: '75%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
    },
    sheetTitle: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginBottom: 10,
    },
    sheetCancel: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    sheetCancelText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B6B6B',
    },
});
