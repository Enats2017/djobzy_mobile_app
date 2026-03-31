import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Pressable,
    FlatList,
} from 'react-native';
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientButton from "../../../components/GradientButton";

const LANGUAGES = [
    'English', 'Hindi', 'Spanish', 'French', 'German',
    'Arabic', 'Chinese', 'Japanese', 'Portuguese', 'Russian',
    'Italian', 'Korean', 'Turkish', 'Dutch', 'Swedish',
];

const LEVELS = [
    'Beginner', 'Elementary', 'Intermediate',
    'Upper Intermediate', 'Advanced', 'Native',
];

const AddLanguageModal = ({ visible, onClose, onSave }) => {
    const insets = useSafeAreaInsets();
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null); // 'language' | 'level' | null

    const toggleDropdown = (type) => {
        setOpenDropdown(prev => (prev === type ? null : type));
    };

    const handleLanguageSelect = (lang) => {
        setSelectedLanguage(lang);
        setOpenDropdown(null);
    };

    const handleLevelSelect = (level) => {
        setSelectedLevel(level);
        setOpenDropdown(null);
    };

    const handleSave = () => {
        if (selectedLanguage && selectedLevel) {
            onSave(selectedLanguage, selectedLevel);
        }
    };

    const renderDropdown = (items, onSelect) => (
        <View style={styles.dropdownList}>
            <FlatList
                data={items}
                keyExtractor={(item) => item}
                scrollEnabled
                nestedScrollEnabled
                style={{ maxHeight: 180 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => onSelect(item)}
                    >
                        <Text style={styles.dropdownItemText}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

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
                        <Text style={styles.title}>Add Language</Text>
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Language Dropdown */}
                    <View style={styles.dropdownWrapper}>
                        <TouchableOpacity
                            style={[
                                styles.dropdownTrigger,
                                openDropdown === 'language' && styles.dropdownTriggerActive,
                            ]}
                            onPress={() => toggleDropdown('language')}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.dropdownTriggerText,
                                    !selectedLanguage && styles.placeholderText,
                                ]}
                            >
                                {selectedLanguage || 'Select Language'}
                            </Text>
                            <Ionicons
                                name={openDropdown ? "chevron-up" : "chevron-down"}
                                size={18}
                                color="#000"
                            />
                        </TouchableOpacity>
                        {openDropdown === 'language' &&
                            renderDropdown(LANGUAGES, handleLanguageSelect)}
                    </View>

                    {/* Level Dropdown */}
                    <View style={[styles.dropdownWrapper, { marginTop: 12 }]}>
                        <TouchableOpacity
                            style={[
                                styles.dropdownTrigger,
                                openDropdown === 'level' && styles.dropdownTriggerActive,
                            ]}
                            onPress={() => toggleDropdown('level')}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.dropdownTriggerText,
                                    !selectedLevel && styles.placeholderText,
                                ]}
                            >
                                {selectedLevel || 'Select Level'}
                            </Text>
                            <Ionicons
                                name={openDropdown ? "chevron-up" : "chevron-down"}
                                size={18}
                                color="#000"
                            />
                        </TouchableOpacity>
                        {openDropdown === 'level' &&
                            renderDropdown(LEVELS, handleLevelSelect)}
                    </View>

                    {/* Save Button */}
                    <GradientButton
                        onPress={handleSave}
                        activeOpacity={0.85}
                        disabled={!selectedLanguage || !selectedLevel}
                        title="Save"
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
    dropdownWrapper: {
        position: 'relative',
        zIndex: 10,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#00000033',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        backgroundColor: '#fff',
    },
    dropdownTriggerActive: {
        borderColor: '#000',
    },
    dropdownTriggerText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Montserrat_500Medium',
        lineHeight: 24,
    },
    placeholderText: {
        color: '#7a7a7a',
        fontFamily: 'Montserrat_400Regular',
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderTopWidth: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginTop: 5
    },
    dropdownItem: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#000',
        fontFamily: "Montserrat_400Regular"
    },
});

export default AddLanguageModal;