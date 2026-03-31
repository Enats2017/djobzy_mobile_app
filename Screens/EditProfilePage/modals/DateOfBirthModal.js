import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Pressable
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientButton from "../../../components/GradientButton";

const DateOfBirthModal = ({ visible, onClose, onSave, initialDate }) => {
    const insets = useSafeAreaInsets();
    const [date, setDate] = useState(initialDate ? new Date(initialDate) : null);
    const [showPicker, setShowPicker] = useState(false);

    const formatDate = (d) => {
        if (!d) return 'DD/MM/YYYY'; // 👈 placeholder

        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    const handleDateChange = (_event, selectedDate) => {
        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={[styles.modalOverlay]} onPress={onClose}>
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Date Of Birth</Text>
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Date Input */}
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => {
                            if (!date) setDate(new Date());
                            setShowPicker(true);
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.dateText}>{formatDate(date)}</Text>
                        <Feather name="calendar" size={24} color="#000" />
                    </TouchableOpacity>

                    {/* Native Date Picker */}
                    {showPicker && (
                        <DateTimePicker
                            value={date || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    {/* Save Button */}
                    <GradientButton
                        onPress={() => onSave(date)}
                        activeOpacity={0.85}
                        title='Save'
                    />
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#fff",
        width: "100%",
        maxHeight: "66%",
        paddingHorizontal: 15,
        paddingTop: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontFamily: "Montserrat_600SemiBold",
        color: '#303030',
    },
    closeIcon: {
        flexShrink: 0,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 80,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: "#00000033"
    },
    dateText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: "Montserrat_500Medium",
        lineHeight: 24,
    },
});

export default DateOfBirthModal;