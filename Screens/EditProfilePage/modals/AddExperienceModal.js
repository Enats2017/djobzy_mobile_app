import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

const AddExperienceModal = ({ visible, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        onSave({ title: title.trim(), description: description.trim() });
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
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
                        <Text style={styles.title}>Add Experience</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Title Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        placeholderTextColor="#AAAAAA"
                        value={title}
                        onChangeText={setTitle}
                        returnKeyType="next"
                    />

                    {/* Description Input */}
                    <TextInput
                        style={styles.textArea}
                        placeholder="Description"
                        placeholderTextColor="#AAAAAA"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                        returnKeyType="done"
                    />

                    {/* Save Button */}
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.saveText}>Save</Text>
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
        paddingHorizontal: 24,
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
        marginBottom: 18,
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
        height: 160,
        marginBottom: 20,
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

export default AddExperienceModal;