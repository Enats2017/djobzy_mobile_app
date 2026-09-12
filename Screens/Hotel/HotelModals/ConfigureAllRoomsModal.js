import React, { memo } from 'react';
import {
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Pressable,
    ScrollView,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

function ConfigureAllRoomModal({ visible, onClose, rooms, selectedRoom, onRoomSelect, }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} >
            <Pressable style={styles.backdrop} onPress={onClose} >
                <Pressable style={styles.sheet} onPress={() => { }}>
                    <Text style={styles.sheetTitle}>Select room</Text>
                    <ScrollView
                        style={styles.sheetScroll}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {rooms.map((room) => {
                            const active = room.id === selectedRoom.id;
                            return (
                                <TouchableOpacity
                                    key={String(room.id)}
                                    style={styles.sheetRow}
                                    activeOpacity={0.7}
                                    onPress={() => onRoomSelect(room)}
                                >
                                    <Text
                                        style={[styles.sheetRowText, active && styles.sheetRowTextActive]}
                                        numberOfLines={1}
                                    >
                                        {room.label}
                                    </Text>
                                    {active && (
                                        <Ionicons name="checkmark" size={18} color="#CB7767" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

export default memo(ConfigureAllRoomModal);

const styles = StyleSheet.create({
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
        padding: 14,
    },
    sheetTitle: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginBottom: 10,
    },
    sheetScroll: {
        flexGrow: 0,
    },
    sheetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sheetRowText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Montserrat_400Regular',
        color: '#303030',
    },
    sheetRowTextActive: {
        fontFamily: 'Montserrat_600SemiBold',
        color: '#CB7767',
    },
});