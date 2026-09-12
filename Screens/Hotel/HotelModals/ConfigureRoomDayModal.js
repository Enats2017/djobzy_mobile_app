import React, { memo, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Switch,
    TextInput,
    TouchableOpacity,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import GradientButton from '../../../components/GradientButton';

/** Mirrors the web validation: blank reverts, anything below zero is refused. */
const parseNumber = (value) => {
    if (value === null || value === undefined) return null;

    const trimmed = String(value).trim();
    if (trimmed === '') return null;

    const parsed = Number(trimmed);
    if (Number.isNaN(parsed) || parsed < 0) return NaN;

    return parsed;
};

const formatHeading = (dateKey, dayName) => {
    if (!dateKey) return '';

    const parsed = new Date(`${dateKey}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return dateKey;

    const dd = String(parsed.getDate()).padStart(2, '0');
    const mmm = parsed.toLocaleString('en-US', { month: 'short' });

    return `${dayName?.slice(0, 3) || ''} ${dd} ${mmm} ${parsed.getFullYear()}`.trim();
};

function ConfigureRoomDayModal({ visible, roomName, day, saving, onClose, onSave }) {
    const [soldOut, setSoldOut] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [ownerRate, setOwnerRate] = useState('');
    const [customerRate, setCustomerRate] = useState('');
    const [error, setError] = useState('');

    // Reseed every time a different day is opened, so the inputs never carry
    // over values from the previously edited date.
    useEffect(() => {
        if (!day) return;

        setSoldOut(day.is_sold_out === true || day.is_sold_out === 1);
        setQuantity(String(day.total ?? ''));
        setOwnerRate(String(Math.round(Number(day.price) || 0)));
        setCustomerRate(String(Math.round(Number(day.customer_price) || 0)));
        setError('');
    }, [day]);

    const handleSave = () => {
        const parsedQuantity = parseNumber(quantity);
        const parsedOwnerRate = parseNumber(ownerRate);
        const parsedCustomerRate = parseNumber(customerRate);

        if (Number.isNaN(parsedQuantity)) {
            setError('Rooms to sell must be 0 or more.');
            return;
        }
        if (Number.isNaN(parsedOwnerRate)) {
            setError('Owner rate must be 0 or more.');
            return;
        }
        if (Number.isNaN(parsedCustomerRate)) {
            setError('Customer rate must be 0 or more.');
            return;
        }

        setError('');
        onSave({
            soldOut,
            quantity: parsedQuantity,
            ownerRate: parsedOwnerRate,
            customerRate: parsedCustomerRate,
        });
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable style={styles.backdrop} onPress={onClose}>
                    <Pressable style={styles.card} onPress={() => { }}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.cardTitle} numberOfLines={1}>
                                    {formatHeading(day?.date, day?.day)}
                                </Text>
                                <Text style={styles.cardSubtitle} numberOfLines={1}>{roomName}</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} hitSlop={10}>
                                <Ionicons name="close" size={22} color="#6B6B6B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.body}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.switchRow}>
                                <View style={styles.switchTextWrap}>
                                    <Text style={styles.label}>Sold out</Text>
                                    <Text style={styles.hint}>
                                        Block this date from being booked.
                                    </Text>
                                </View>
                                <Switch
                                    value={soldOut}
                                    onValueChange={setSoldOut}
                                    trackColor={{ false: '#D8D8D8', true: '#E9B7AC' }}
                                    thumbColor={soldOut ? '#CB7767' : '#FFFFFF'}
                                />
                            </View>

                            <Text style={styles.label}>Rooms to sell</Text>
                            <TextInput
                                style={styles.input}
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="number-pad"
                                placeholder="0"
                                placeholderTextColor="#999999"
                            />
                            <Text style={styles.hint}>
                                {`Already booked on this date: ${day?.booked ?? 0}`}
                            </Text>

                            <Text style={[styles.label, styles.spacedLabel]}>Owner rate (CAD)</Text>
                            <TextInput
                                style={styles.input}
                                value={ownerRate}
                                onChangeText={setOwnerRate}
                                keyboardType="decimal-pad"
                                placeholder="0"
                                placeholderTextColor="#999999"
                            />
                            <Text style={styles.hint}>
                                Saving this recalculates the customer rate from your commission.
                            </Text>

                            <Text style={[styles.label, styles.spacedLabel]}>Customer rate (CAD)</Text>
                            <TextInput
                                style={styles.input}
                                value={customerRate}
                                onChangeText={setCustomerRate}
                                keyboardType="decimal-pad"
                                placeholder="0"
                                placeholderTextColor="#999999"
                            />
                            <Text style={styles.hint}>
                                What the guest is charged for this date.
                            </Text>

                            {!!error && <Text style={styles.error}>{error}</Text>}

                            <GradientButton
                                title="Save changes"
                                onPress={handleSave}
                                loading={saving}
                                marginTop={20}
                            />

                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={onClose}
                                disabled={saving}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}

export default memo(ConfigureRoomDayModal);

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        maxHeight: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    cardHeaderText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
    },
    cardSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'Montserrat_400Regular',
        color: '#000000B2',
        marginTop: 2,
    },
    body: {
        marginTop: 14,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#F5F5F6',
        marginBottom: 16,
    },
    switchTextWrap: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginBottom: 6,
    },
    spacedLabel: {
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        fontSize: 16,
        fontFamily: 'Montserrat_500Medium',
        color: '#303030',
    },
    hint: {
        fontSize: 11,
        lineHeight: 16,
        fontFamily: 'Montserrat_400Regular',
        color: '#8A8A8A',
        marginTop: 6,
    },
    error: {
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'Montserrat_500Medium',
        color: '#e74c3c',
        marginTop: 12,
    },
    cancelBtn: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    cancelText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B6B6B',
    },
});
