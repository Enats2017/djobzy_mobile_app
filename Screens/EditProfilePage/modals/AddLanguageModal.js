import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    FlatList,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientButton from "../../../components/GradientButton";
import { API_URL } from '../../../api/ApiUrl';
import { useEditProfileStore } from "../useEditProfileStore";
import { toastError } from '../../../utils/toast';

const LEVELS = [
    { label: "Basic", value: 1 },
    { label: "Mid. Level", value: 2 },
    { label: "Fluent", value: 3 },
    { label: "Native and bilingual", value: 4 },
];

const AddLanguageModal = ({ visible, onClose }) => {
    const insets = useSafeAreaInsets();
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [languageOptions, setLanguageOptions] = useState([]);
    const languages = useEditProfileStore((state) => state.form.languages);
    const setField = useEditProfileStore((state) => state.setField);

    const fetchLanguages = async () => {
        try {
            const res = await fetch(`${API_URL}/language`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    keyword: "",
                }),
            });

            const json = await res.json();
            setLanguageOptions(json.data || []);
        } catch (e) {
            console.log("Language API error:", e);
        }
    };

    const toggleDropdown = (type) => {
        const newType = openDropdown === type ? null : type;
        setOpenDropdown(newType);
        if (newType === 'language') {
            fetchLanguages();
        }
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
        if (!selectedLanguage || !selectedLevel) return;
        const existingIndex = languages.findIndex(
            (l) =>
                l.language_name?.toLowerCase().trim() ===
                selectedLanguage.value?.toLowerCase().trim()
        );

        let updatedLanguages;
        if (existingIndex !== -1) {
            // Update level instead of blocking
            updatedLanguages = [...languages];
            updatedLanguages[existingIndex].level = selectedLevel.value;
        } else {
            // Add new
            updatedLanguages = [
                ...languages,
                {
                    language_name: selectedLanguage.value,
                    level: selectedLevel.value,
                },
            ];
        }

        setField("languages", updatedLanguages);
        console.log(updatedLanguages);
        setSelectedLanguage(null);
        setSelectedLevel("");
        onClose();
    };

    const renderDropdown = (items, onSelect) => (
        <View style={styles.dropdownList}>
            <FlatList
                data={items}
                keyExtractor={(item, index) => index.toString()}
                style={{ maxHeight: 180 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => onSelect(item)}
                    >
                        <Text style={styles.dropdownItemText}>
                            {typeof item === "string" ? item : item.label}
                        </Text>
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
            <View style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 16 }]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Language</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dropdownWrapper}>
                        <TouchableOpacity
                            style={[
                                styles.dropdownTrigger,
                                openDropdown === 'language' && styles.dropdownTriggerActive,
                            ]}
                            onPress={() => toggleDropdown('language')}
                        >
                            <Text
                                style={[
                                    styles.dropdownTriggerText,
                                    !selectedLanguage && styles.placeholderText,
                                ]}
                            >
                                {selectedLanguage?.label || 'Select Language'}
                            </Text>
                            <Ionicons
                                name={openDropdown === 'language' ? "chevron-up" : "chevron-down"}
                                size={18}
                                color="#000"
                            />
                        </TouchableOpacity>
                        {openDropdown === 'language' && renderDropdown(languageOptions, handleLanguageSelect)}
                    </View>

                    <View style={[styles.dropdownWrapper, { marginTop: 12 }]}>
                        <TouchableOpacity
                            style={[
                                styles.dropdownTrigger,
                                openDropdown === 'level' && styles.dropdownTriggerActive,
                            ]}
                            onPress={() => toggleDropdown('level')}
                        >
                            <Text
                                style={[
                                    styles.dropdownTriggerText,
                                    !selectedLevel && styles.placeholderText,
                                ]}
                            >
                                {selectedLevel?.label || 'Select Level'}
                            </Text>
                            <Ionicons
                                name={openDropdown === 'level' ? "chevron-up" : "chevron-down"}
                                size={18}
                                color="#000"
                            />
                        </TouchableOpacity>
                        {openDropdown === 'level' && renderDropdown(LEVELS, handleLevelSelect)}
                    </View>

                    {/* Save Button */}
                    <GradientButton
                        onPress={handleSave}
                        disabled={!selectedLanguage || !selectedLevel}
                        title="Save"
                    />
                </View>
            </View>
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
        maxHeight: "70%",
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
        marginTop: 5,
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