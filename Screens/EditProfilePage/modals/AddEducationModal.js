import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert,
    Pressable
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientButton from "../../../components/GradientButton";

const AddEducationModal = ({ visible, onClose, onSave }) => {
    const insets = useSafeAreaInsets();
    const [instituteName, setInstituteName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [startYear, setStartYear] = useState(null);
    const [endYear, setEndYear] = useState(null);
    const [activePicker, setActivePicker] = useState(null); // 'start' | 'end' | null
    const [diplomaFile, setDiplomaFile] = useState(null);

    const formatYear = (d) => {
        if (!d) return '';
        return String(d.getFullYear());
    };

    const handleDateChange = (_event, selectedDate) => {
        if (Platform.OS === 'android') setActivePicker(null);
        if (!selectedDate) return;

        if (activePicker === 'start') setStartYear(selectedDate);
        else if (activePicker === 'end') setEndYear(selectedDate);

        if (Platform.OS === 'ios') setActivePicker(null);
    };

    const handleBrowseFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setDiplomaFile({ name: asset.name, uri: asset.uri });
            }
        } catch {
            Alert.alert('Error', 'Could not open file picker.');
        }
    };

    const handleSave = () => {
        if (!instituteName.trim()) {
            Alert.alert('Validation', 'Please enter institute name.');
            return;
        }
        onSave({
            instituteName: instituteName.trim(),
            startYear: startYear ? startYear.getFullYear() : null,
            endYear: endYear ? endYear.getFullYear() : null,
            specialization: specialization.trim(),
            diplomaFile,
        });
    };

    const handleClose = () => {
        setInstituteName('');
        setSpecialization('');
        setStartYear(null);
        setEndYear(null);
        setDiplomaFile(null);
        setActivePicker(null);
        onClose();
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
                        <Text style={styles.title}>Add Education</Text>
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Institute Name */}
                    <TextInput
                        style={styles.input}
                        placeholder="Institute Name"
                        placeholderTextColor="#7a7a7a"
                        value={instituteName}
                        onChangeText={setInstituteName}
                        returnKeyType="next"
                    />

                    {/* Year Row */}
                    <View style={styles.yearRow}>
                        {/* Start Year */}
                        <TouchableOpacity
                            style={styles.yearInput}
                            onPress={() => setActivePicker('start')}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.yearText, !startYear && styles.placeholderText]}>
                                {startYear ? formatYear(startYear) : 'Start Year'}
                            </Text>
                            <Feather name="calendar" size={24} color="#000" />

                        </TouchableOpacity>

                        {/* End Year */}
                        <TouchableOpacity
                            style={styles.yearInput}
                            onPress={() => setActivePicker('end')}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.yearText, !endYear && styles.placeholderText]}>
                                {endYear ? formatYear(endYear) : 'End Year'}
                            </Text>
                            <Feather name="calendar" size={24} color="#000" />

                        </TouchableOpacity>
                    </View>

                    {/* Native Year Picker */}
                    {activePicker !== null && (
                        <DateTimePicker
                            value={
                                activePicker === 'start'
                                    ? startYear || new Date()
                                    : endYear || new Date()
                            }
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                        />
                    )}

                    {/* Specialization */}
                    <TextInput
                        style={styles.input}
                        placeholder="Specalization"
                        placeholderTextColor="#7a7a7a"
                        value={specialization}
                        onChangeText={setSpecialization}
                        returnKeyType="done"
                    />

                    {/* Diploma Section */}
                    <Text style={styles.diplomaLabel}>Add Diploma (Optional)</Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={handleBrowseFile}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.browseButtonText}>
                            {diplomaFile ? diplomaFile.name : 'Browse File'}
                        </Text>
                    </TouchableOpacity>

                    {/* Save Button */}
                    <GradientButton
                        onPress={handleSave}
                        activeOpacity={0.85}
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
    input: {
        borderWidth: 1,
        borderColor: '#00000033',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#000000',
        fontFamily: "Montserrat_500Medium",
        lineHeight: 24,
        marginBottom: 10,
    },
    yearRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    yearInput: {
        flex: 1,
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
    yearText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: "Montserrat_500Medium",
        lineHeight: 24,
    },
    placeholderText: {
        color: '#7a7a7a',
    },
    diplomaLabel: {
        fontSize: 16,
        color: '#000000',
        fontFamily: "Montserrat_500Medium",
        lineHeight: 24,
        marginBottom: 10,
        marginTop: 4,
    },
    browseButton: {
        backgroundColor: '#f4c366',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
        marginBottom: 30,
    },
    browseButtonText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Montserrat_700Bold',
    },
    saveButton: {
        backgroundColor: '#C0614A',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
    },
    saveText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});

export default AddEducationModal;