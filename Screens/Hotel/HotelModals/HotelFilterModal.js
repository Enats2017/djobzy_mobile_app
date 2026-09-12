import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import GradientButton from '../../../components/GradientButton';
import { formatDateForFilter } from "../HotelUtils/HotelFormatDates";

export const DATE_OF_OPTIONS = [
    { label: 'Check in', value: 'checkin' },
    { label: 'Check out', value: 'checkout' },
    { label: 'Reservation', value: 'reservation' },
];

export const SORT_OPTIONS = [
    { label: 'Room Type', value: 'room_type', sortType: 'ASC' },
    { label: 'Price: Low to High', value: 'price', sortType: 'ASC' },
    { label: 'Price: High to Low', value: 'price', sortType: 'DESC' },
    { label: 'Check In Date', value: 'check_in_date', sortType: 'DESC' },
];

const SimpleDropdown = memo(function SimpleDropdown({ placeholder, valueLabel, options, onSelect }) {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.dropdownWrap}>
            <TouchableOpacity
                style={styles.dropdownField}
                activeOpacity={0.8}
                onPress={() => setOpen((prev) => !prev)}
            >
                <Text style={valueLabel ? styles.dropdownValueText : styles.dropdownPlaceholder}>
                    {valueLabel || placeholder}
                </Text>
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#6B6B6B" />
            </TouchableOpacity>

            {open && (
                <View style={styles.dropdownOptions}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.label}
                            style={styles.dropdownOptionRow}
                            onPress={() => {
                                onSelect(option);
                                setOpen(false);
                            }}
                        >
                            <Text style={styles.dropdownOptionText}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
});

function HotelFilterModal({ visible, filters, onChange, onClose, onShowResult }) {
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    const onFromDateChange = (event, selectedDate) => {
        setShowFromPicker(Platform.OS === 'ios');
        if (event.type === 'dismissed') {
            setShowFromPicker(false);
            return;
        }
        if (selectedDate) onChange({ ...filters, fromDate: selectedDate });
        if (Platform.OS === 'android') setShowFromPicker(false);
    };

    const onToDateChange = (event, selectedDate) => {
        setShowToPicker(Platform.OS === 'ios');
        if (event.type === 'dismissed') {
            setShowToPicker(false);
            return;
        }
        if (selectedDate) onChange({ ...filters, toDate: selectedDate });
        if (Platform.OS === 'android') setShowToPicker(false);
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={styles.modalCard} onPress={() => { }}>
                    <Text style={styles.modalLabel}>Date of</Text>
                    <SimpleDropdown
                        placeholder="Check in"
                        valueLabel={filters.dateOf?.label}
                        options={DATE_OF_OPTIONS}
                        onSelect={(option) => onChange({ ...filters, dateOf: option })}
                    />

                    <View style={styles.modalDateRow}>
                        <View style={styles.modalDateCol}>
                            <Text style={styles.modalLabel}>From</Text>
                            <TouchableOpacity
                                style={styles.dropdownField}
                                onPress={() => setShowFromPicker(true)}
                            >
                                <Text style={filters.fromDate ? styles.dropdownValueText : styles.dropdownPlaceholder}>
                                    {filters.fromDate ? formatDateForFilter(filters.fromDate) : 'DD MMM YYYY'}
                                </Text>
                                <Ionicons name="calendar-outline" size={16} color="#6B6B6B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalDateCol}>
                            <Text style={styles.modalLabel}>To</Text>
                            <TouchableOpacity
                                style={styles.dropdownField}
                                onPress={() => setShowToPicker(true)}
                            >
                                <Text style={filters.toDate ? styles.dropdownValueText : styles.dropdownPlaceholder}>
                                    {filters.toDate ? formatDateForFilter(filters.toDate) : 'DD MMM YYYY'}
                                </Text>
                                <Ionicons name="calendar-outline" size={16} color="#6B6B6B" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {showFromPicker && (
                        <DateTimePicker
                            value={filters.fromDate || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onFromDateChange}
                        />
                    )}
                    {showToPicker && (
                        <DateTimePicker
                            value={filters.toDate || filters.fromDate || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            minimumDate={filters.fromDate || undefined}
                            onChange={onToDateChange}
                        />
                    )}

                    <Text style={[styles.modalLabel, { marginTop: 14 }]}>Sort By</Text>
                    <SimpleDropdown
                        placeholder="Room Type"
                        valueLabel={filters.sortBy?.label}
                        options={SORT_OPTIONS}
                        onSelect={(option) => onChange({ ...filters, sortBy: option })}
                    />

                    <GradientButton title='Show Result' onPress={onShowResult} marginTop={20} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

export default memo(HotelFilterModal);

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCard: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
    },
    modalLabel: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000',
        marginBottom: 4,
    },
    modalDateRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 14,
    },
    modalDateCol: {
        flex: 1,
    },
    dropdownWrap: {
        position: 'relative',
        zIndex: 10,
    },
    dropdownField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    dropdownValueText: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Montserrat_500Medium',
        color: '#666666',
    },
    dropdownPlaceholder: {
        fontSize: 16,
        lineHeight: 19,
        fontFamily: 'Montserrat_400Regular',
        color: '#999999',
    },
    dropdownOptions: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        zIndex: 20,
    },
    dropdownOptionRow: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    dropdownOptionText: {
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_400Regular',
        color: '#303030',
    },
});
