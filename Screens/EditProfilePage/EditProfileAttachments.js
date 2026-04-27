import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Image, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEditProfileStore } from "../EditProfilePage/useEditProfileStore";
import { toastError } from "../../utils/toast";
import AttachmentData from "./data/AttachmentData";

const EditProfileAttachments = () => {
    const attachments = useEditProfileStore((state) => state.form.attachments);
    const setField = useEditProfileStore((state) => state.setField);
    const MAX_FILES = 5;

    const requestPermissions = async () => {
        const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
        const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraPerm.status !== "granted" || galleryPerm.status !== "granted") {
            Alert.alert("Permission required", "Camera and Gallery permissions are required");
            return false;
        }
        return true;
    };

    const validateImageSize = async (asset) => {
        let size = asset.fileSize;
        if (!size && asset.uri) {
            try {
                const fileInfo = await FileSystem.getInfoAsync(asset.uri);
                size = fileInfo.size;
            } catch (error) {
                console.log("Image size check error:", error);
                toastError("Unable to read the file, please try another file");
                return false;
            }
        }
        const maxSize = 3 * 1024 * 1024;
        if (!size) {
            toastError("Unable to read the file, please try another file");
            return false;
        }
        if (size >= maxSize) {
            toastError("Image must be smaller than 3MB");
            return false;
        }
        return true;
    };


    const openCamera = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });
        if (!result.canceled) {
            const asset = result.assets[0];
            const isValid = await validateImageSize(asset);
            if (!isValid) return;
            addAttachment(result.assets[0], "image");
        }
    };

    const openGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            for (const asset of result.assets) {
                const isValid = await validateImageSize(asset);
                if (!isValid) return;
            }

            // limit selection count
            if (result.assets.length > MAX_FILES) {
                toastError(`You can select maximum ${MAX_FILES} images at a time`);
                return;
            }

            const newAttachments = result.assets.map((file) => ({
                tempId: `${Date.now()}_${Math.random()}`,
                uri: file.uri,
                name: file.fileName || `attachment_${Date.now()}`,
                mimeType: file.mimeType || "image/jpeg",
                loading: true,
            }));

            setField("attachments", [...newAttachments, ...attachments]);
            setTimeout(() => {
                const current = useEditProfileStore.getState().form.attachments;
                const updated = current.map(item =>
                    newAttachments.some(n => n.id === item.id)
                        ? { ...item, loading: false }
                        : item
                );
                useEditProfileStore.getState().setField("attachments", updated);
            }, 400);
        }
    };

    const addAttachment = (file) => {
        const newAttachment = {
            tempId: `${Date.now()}_${Math.random()}`,
            uri: file.uri,
            name: file.fileName || `attachment_${Date.now()}`,
            mimeType: file.mimeType || "image/jpeg",
            loading: true,
        };

        setField("attachments", [newAttachment, ...attachments]);
        setTimeout(() => {
            const current = useEditProfileStore.getState().form.attachments;
            const updated = current.map(item =>
                item.id === newAttachment.id
                    ? { ...item, loading: false }
                    : item
            );
            useEditProfileStore.getState().setField("attachments", updated);
        }, 400);
    };

    const pickImage = () => {
        Alert.alert("Upload Photo", "Choose an option",
            [
                { text: "Camera", onPress: openCamera },
                { text: "Gallery", onPress: openGallery },
                { text: "Cancel", style: "cancel" },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.section}>
            <TouchableOpacity style={styles.plusbtn} onPress={pickImage}>
                <AntDesign name="plus" size={16} color="#030303" />
                <Text style={styles.plustext}>Add Attachments</Text>
            </TouchableOpacity>

            {attachments.length > 0 && (
                <AttachmentData isEdit={true} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: { marginTop: 15 },
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 6,
        fontFamily: "Montserrat_700Bold",
    },
    plusbtn: {
        alignSelf: "flex-start",
        flexDirection: "row",
        gap: 5,
        backgroundColor: "#fff",
        borderRadius: 100,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    plustext: { color: "#030303", fontFamily: "Montserrat_400Regular", fontSize: 14, lineHeight: 19 },
});

export default EditProfileAttachments;
