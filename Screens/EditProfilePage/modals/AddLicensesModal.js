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

const AddLicensesModal = ({ visible, onClose, editingItem = null }) => {
    const insets = useSafeAreaInsets();
    const [licenseName, setLicenseName] = useState('');
    const [description, setDescription] = useState('');
    const [startYear, setStartYear] = useState(null);
    const [endYear, setEndYear] = useState(null);
    const [activePicker, setActivePicker] = useState(null);
    const [licenseFile, setLicenseFile] = useState(null);
    const [errors, setErrors] = useState({});
    const licenses = useEditProfileStore((state) => state.form.licenses);
    const setField = useEditProfileStore((state) => state.setField);

    useEffect(() => {
        if (editingItem) {
            setLicenseName(editingItem.name || '');
            setDescription(editingItem.description || '');
            setStartYear(
                editingItem.start_date ? new Date(editingItem.start_date) : null
            );
            setEndYear(
                editingItem.end_date ? new Date(editingItem.end_date) : null
            );
        }
    }, [editingItem]);

    const formatYear = (d) => {
        if (!d) return '';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const formatDate = (d) => {
        if (!d) return;
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
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
                type: ['image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setLicenseFile({ name: asset.name, uri: asset.uri });
            }
        } catch {
            Alert.alert('Error', 'Could not open file picker.');
        }
    };

    const getKey = (item) => item.tempId || item.id;
    const handleSave = () => {
        let newErrors = {};
        if (!licenseName.trim()) {
            newErrors.licenseName = 'License name is required';
        }
        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!startYear) {
            newErrors.startYear = 'Start year is required';
        }
        if (!endYear) {
            newErrors.endYear = 'End year is required';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const newLicense = {
            tempId: Date.now().toString(),
            name: licenseName.trim(),
            description: description.trim(),
            start_date: startYear ? formatDate(startYear) : null,
            end_date: endYear ? formatDate(endYear) : null,
            type: 3,
        };

        let updatedLicenses = [];
        if (editingItem) {
            // EDIT MODE
            updatedLicenses = licenses.map((edu) =>
                getKey(edu) === getKey(editingItem)
                    ? { ...edu, ...newLicense }
                    : edu
            );
        } else {
            // add more
            const exists = licenses.some(
                (e) =>
                    e.name?.toLowerCase().trim() ===
                    newLicense.name?.toLowerCase().trim() &&
                    String(e.start_date) === String(newLicense.start_date)
            );

            if (exists) {
                onClose();
                toastError("License already added.");
                return;
            }

            updatedLicenses = [
                ...licenses,
                {
                    ...newLicense,
                    tempId: Date.now().toString(),
                },
            ];
        }

        setField("licenses", updatedLicenses);
        console.log(updatedLicenses);
        setLicenseName('');
        setDescription('');
        setStartYear(null);
        setEndYear(null);
        setLicenseFile(null);
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
            <Pressable style={[styles.modalOverlay]} onPress={onClose}>
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add License</Text>
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
                                placeholder="Name"
                                placeholderTextColor="#7a7a7a"
                                value={licenseName}
                                onChangeText={(text) => {
                                    setLicenseName(text);
                                    setErrors((prev) => ({ ...prev, licenseName: null }));
                                }}
                                returnKeyType="next"
                            />
                            {errors.licenseName && (
                                <Text style={styles.errorText}>{errors.licenseName}</Text>
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
                                placeholder="Description"
                                placeholderTextColor="#7a7a7a"
                                value={description}
                                onChangeText={(text) => {
                                    setDescription(text);
                                    setErrors((prev) => ({ ...prev, description: null }));
                                }}
                                returnKeyType="done"
                            />
                            {errors.description && (
                                <Text style={styles.errorText}>{errors.description}</Text>
                            )}
                        </View>
                    </View>

                    <Text style={styles.diplomaLabel}>Add License (Optional)</Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={handleBrowseFile}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.browseButtonText}>
                            {licenseFile ? licenseFile.name : 'Add File'}
                        </Text>
                    </TouchableOpacity>

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

export default AddLicensesModal;