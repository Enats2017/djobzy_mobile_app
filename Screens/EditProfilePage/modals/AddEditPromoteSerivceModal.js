import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const AddEditPromoteSerivceModal = ({ visible, onClose, onChooseCategories, initialData }) => {
    const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || 'UI/UX Designer');
    const [description, setDescription] = useState(initialData?.description || '');
    const [isBookable, setIsBookable] = useState(initialData?.isBookable ?? true);
    const [addTotalPrice, setAddTotalPrice] = useState(initialData?.addTotalPrice ?? true);
    const [hourlyRate, setHourlyRate] = useState(initialData?.hourlyRate || '30.00');
    const [attachedFile, setAttachedFile] = useState(null);

    const handleAttachFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setAttachedFile(result.assets[0]);
            }
        } catch {
            Alert.alert('Error', 'Could not open file picker.');
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit a job request</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Job Title Input */}
                    <TextInput
                        style={styles.input}
                        value={jobTitle}
                        onChangeText={setJobTitle}
                        placeholder="Job Title"
                        placeholderTextColor="#AAAAAA"
                        returnKeyType="next"
                    />

                    {/* Description Input */}
                    <TextInput
                        style={styles.textArea}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Description"
                        placeholderTextColor="#AAAAAA"
                        multiline
                        textAlignVertical="top"
                    />

                    {/* Toggle Section */}
                    <View style={styles.toggleSection}>
                        {/* Bookable Toggle */}
                        <View style={styles.toggleRow}>
                            <Text style={styles.toggleLabel}>Make the service bookable in my calendar</Text>
                            <Switch
                                value={isBookable}
                                onValueChange={setIsBookable}
                                trackColor={{ false: '#767577', true: '#4CAF50' }}
                                thumbColor="#FFFFFF"
                                ios_backgroundColor="#767577"
                            />
                        </View>

                        {/* Total Price Toggle */}
                        <View style={styles.toggleRow}>
                            <Text style={styles.toggleLabel}>Add total price</Text>
                            <Switch
                                value={addTotalPrice}
                                onValueChange={setAddTotalPrice}
                                trackColor={{ false: '#767577', true: '#4CAF50' }}
                                thumbColor="#FFFFFF"
                                ios_backgroundColor="#767577"
                            />
                        </View>
                    </View>

                    {/* Hourly Rate Section */}
                    <View style={styles.hourlyRateSection}>
                        <View style={styles.hourlyRateLeft}>
                            <Text style={styles.hourlyRateLabel}>Add hourly rate</Text>
                            <Text style={styles.questionMark}> ⓘ</Text>
                        </View>
                    </View>

                    <View style={styles.hourlyRateRow}>
                        {/* Currency + Rate Input */}
                        <View style={styles.rateInputBox}>
                            <Text style={styles.currency}>CAD</Text>
                            <View style={styles.divider} />
                            <TextInput
                                style={styles.rateInput}
                                value={hourlyRate}
                                onChangeText={setHourlyRate}
                                keyboardType="decimal-pad"
                                returnKeyType="done"
                            />
                            <Text style={styles.perHour}>/Hour</Text>
                        </View>

                        {/* Attach File Button */}
                        <TouchableOpacity
                            style={styles.attachButton}
                            onPress={handleAttachFile}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.attachButtonText}>
                                {attachedFile ? '📎 ' + attachedFile.name.slice(0, 8) + '...' : 'Attach File'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Choose Categories Button */}
                    <TouchableOpacity
                        style={styles.categoriesButton}
                        onPress={onChooseCategories}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.categoriesButtonText}>Choose Categories</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    container: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 13,
        color: '#555',
        lineHeight: 16,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 15,
        color: '#1A1A1A',
        backgroundColor: '#FAFAFA',
        marginBottom: 12,
    },
    textArea: {
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 15,
        color: '#1A1A1A',
        backgroundColor: '#FAFAFA',
        height: 120,
        marginBottom: 14,
    },
    toggleSection: {
        backgroundColor: '#4A7C6F',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginBottom: 16,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    toggleLabel: {
        flex: 1,
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '400',
        marginRight: 10,
    },
    hourlyRateSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    hourlyRateLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hourlyRateLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    questionMark: {
        fontSize: 14,
        color: '#777',
    },
    hourlyRateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    rateInputBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 11,
        backgroundColor: '#FAFAFA',
    },
    currency: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    divider: {
        width: 1,
        height: 18,
        backgroundColor: '#D0D0D0',
        marginHorizontal: 10,
    },
    rateInput: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        padding: 0,
    },
    perHour: {
        fontSize: 13,
        color: '#888',
        marginLeft: 2,
    },
    attachButton: {
        backgroundColor: '#E8A838',
        borderRadius: 10,
        paddingVertical: 13,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    attachButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    categoriesButton: {
        backgroundColor: '#C0614A',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
    },
    categoriesButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});

export default AddEditPromoteSerivceModal;