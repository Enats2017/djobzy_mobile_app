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
import { useEditProfileStore } from "../useEditProfileStore";
import { toastError } from '../../../utils/toast';

const AddAssetsModal = ({ visible, onClose }) => {
    const [assetName, setAssetName] = useState('');
    const insets = useSafeAreaInsets();
    const assets = useEditProfileStore((state) => state.form.assets);
    const setField = useEditProfileStore((state) => state.setField);

    const handleSave = () => {
        if (!assetName.trim()) return;
        const newAsset = {
            
            name: assetName.trim(),
        };
        const exists = assets.some(
            (a) =>
                a.name?.toLowerCase().trim() ===
                newAsset.name?.toLowerCase().trim()
        );

        if (exists) {
            onClose();
            toastError("Asset already added.");
            setAssetName('');
            return;
        }
        const updatedAssets = [...assets, newAsset];
        setField("assets", updatedAssets);
        console.log(updatedAssets);
        setAssetName('');
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
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 16}]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Assets and software programs</Text>
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor="#7a7a7a"
                        value={assetName}
                        onChangeText={setAssetName}
                        returnKeyType="next"
                    />

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
        marginBottom: 50,
    },
});

export default AddAssetsModal;
