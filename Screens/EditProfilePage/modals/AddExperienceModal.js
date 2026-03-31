import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Pressable
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientButton from "../../../components/GradientButton";

const AddExperienceModal = ({ visible, onClose, onSave }) => {
    const insets = useSafeAreaInsets();
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
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={[styles.modalOverlay]} onPress={onClose}>
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Experience</Text>
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={22} color="#000" />
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
    textArea: {
        borderWidth: 1,
        borderColor: '#00000033',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 16,
        lineHeight: 24,
        backgroundColor: '#fff',
        color: '#000000',
        height: 160,
        marginBottom: 20,
        fontFamily: "Montserrat_500Medium",
    },
});

export default AddExperienceModal;