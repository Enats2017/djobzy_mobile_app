import React, { useEffect, useState } from 'react';
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
import { useEditProfileStore } from "../useEditProfileStore";
import { toastError } from '../../../utils/toast';

const AddEducationModal = ({ visible, onClose, editingItem = null }) => {
    const insets = useSafeAreaInsets();
    const [instituteName, setInstituteName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [startYear, setStartYear] = useState(null);
    const [endYear, setEndYear] = useState(null);
    const [activePicker, setActivePicker] = useState(null);
    const [diplomaFile, setDiplomaFile] = useState(null);
    const [errors, setErrors] = useState({});
    const education = useEditProfileStore((state) => state.form.education);
    const setField = useEditProfileStore((state) => state.setField);

    useEffect(() => {
        if (editingItem) {
            setInstituteName(editingItem.institute_name || '');
            setSpecialization(editingItem.specalization || '');
            setStartYear(
                editingItem.start_date ? new Date(editingItem.start_date, 0) : null
            );
            setEndYear(
                editingItem.end_date ? new Date(editingItem.end_date, 0) : null
            );
        }
    }, [editingItem]);

    const formatYear = (d) => {
        if (!d) return '';
        return String(d.getFullYear());
    };

    const handleDateChange = (_event, selectedDate) => {
        if (Platform.OS === 'android') setActivePicker(null);
        if (!selectedDate) return;

        if (activePicker === 'start') {
            setStartYear(selectedDate);
            setErrors((prev) => ({ ...prev, startYear: null }));
        } else if (activePicker === 'end') {
            setEndYear(selectedDate);
            setErrors((prev) => ({ ...prev, endYear: null }));
        }

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
            Alert.alert('Error', 'Could not open file.');
        }
    };

    const getKey = (item) => item.tempId || item.id;
    const handleSave = () => {
        let newErrors = {};
        if (!instituteName.trim()) newErrors.instituteName = 'Institute name is required';
        if (!specialization.trim()) newErrors.specialization = 'Specialization is required';
        if (!startYear) newErrors.startYear = 'Start year is required';
        if (!endYear) newErrors.endYear = 'End year is required';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const newEducation = {
            tempId: Date.now().toString(),
            institute_name: instituteName.trim(),
            specalization: specialization.trim(),
            start_date: startYear?.getFullYear(),
            end_date: endYear?.getFullYear(),
        };

        let updatedEducation = [];

        if (editingItem) {
            // EDIT MODE
            updatedEducation = education.map((edu) =>
                getKey(edu) === getKey(editingItem)
                    ? { ...edu, ...newEducation }
                    : edu
            );
        } else {
            // ADD MODE
            const exists = education.some(
                (e) =>
                    e.institute_name?.toLowerCase().trim() ===
                    newEducation.institute_name?.toLowerCase().trim() &&
                    String(e.start_date) === String(newEducation.start_date)
            );

            if (exists) {
                onClose();
                toastError("Education already added.");
                return;
            }

            updatedEducation = [
                ...education,
                {
                    ...newEducation,
                    tempId: Date.now().toString(),
                },
            ];
        }

        setField("education", updatedEducation);
        setInstituteName('');
        setSpecialization('');
        setStartYear(null);
        setEndYear(null);
        setDiplomaFile(null);
        setActivePicker(null);
        setErrors({});
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={[styles.modalOverlay]} onPress={onClose}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Education</Text>
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.eductionSection}>
                        <View style={styles.nameRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Institute Name"
                                placeholderTextColor="#7a7a7a"
                                value={instituteName}
                                onChangeText={(text) => {
                                    setInstituteName(text);
                                    setErrors((prev) => ({ ...prev, instituteName: null }));
                                }}
                                returnKeyType="next"
                            />
                            {errors.instituteName && (
                                <Text style={styles.errorText}>{errors.instituteName}</Text>
                            )}
                        </View>

                        <View style={styles.yearRow}>
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
                        {errors.startYear && (
                            <Text style={styles.errorText}>{errors.startYear}</Text>
                        )}
                        {errors.endYear && (
                            <Text style={styles.errorText}>{errors.endYear}</Text>
                        )}

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

                        <View style={styles.specRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Specalization"
                                placeholderTextColor="#7a7a7a"
                                value={specialization}
                                onChangeText={(text) => {
                                    setSpecialization(text);
                                    setErrors((prev) => ({ ...prev, specialization: null }));
                                }}
                                returnKeyType="done"
                            />
                            {errors.specialization && (
                                <Text style={styles.errorText}>{errors.specialization}</Text>
                            )}
                        </View>
                    </View>

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

                    <GradientButton
                        onPress={handleSave}
                        activeOpacity={0.85}
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
    eductionSection: {
        flexDirection: "column",
        gap: 10,
        marginBottom: 10
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
    },
    yearRow: {
        flexDirection: 'row',
        gap: 10,
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
    errorText: {
        color: '#ff0000',
        fontSize: 12,
        marginLeft: 4,
        fontFamily: "Montserrat_400Regular",
    },
});

export default AddEducationModal;