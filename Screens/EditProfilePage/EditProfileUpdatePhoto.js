import { useState } from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { toastError, toastSuccess } from "../../utils/toast";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import axios from "axios";

const EditProfileUpdatePhoto = ({ photoUri, setPhotoUri }) => {
    const [loading, setLoading] = useState(false);
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
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const isValid = await validateImageSize(asset);
            if (!isValid) return;
            await handleSubmit(asset.uri);
        }
    };

    const openGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const isValid = await validateImageSize(asset);
            if (!isValid) return;
            await handleSubmit(asset.uri);
        }
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

    const handleSubmit = async (uri) => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const formData = new FormData();
            if (uri) {
                const base64Image = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                const imageData = `data:image/jpeg;base64,${base64Image}`;
                formData.append("image", imageData);
            }
            const response = await axios.post(
                `${API_URL}/save-profile-picture`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.status === 200) {
                toastSuccess('Profile picture updated')
                setPhotoUri(uri);
            } else {
                toastError(response.data.message || "Failed to save data");
                console.log(response.data.message);
            }
        } catch (error) {
            console.error(
                "Profile setup error:",
                error.response?.data || error.message
            );
            toastError("Error saving profile data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.avatarContainer}>
            {
                loading ? (
                    <View style={styles.avatarLoading}>
                        <ActivityIndicator color="#fff" size={25} />
                    </View>
                ) : (
                    <Image
                        source={{ uri: photoUri }}
                        style={styles.avatar}
                    />
                )
            }
            <TouchableOpacity style={styles.editBadge} onPress={pickImage}>
                <Feather name="edit" size={11} color="#666" />
                <Text style={styles.editBadgeText}>Edit</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    avatarContainer: {
        position: "relative",
        width: 84,
        height: 84,
        marginBottom: 16, // extra space for the badge overflow
    },
    avatar: {
        borderWidth: 1,
        borderRadius: 60,
        borderColor: "#d0d0d0",
        width: "100%",
        height: "100%",
    },
    avatarLoading: {
        borderWidth: 1,
        borderRadius: 60,
        borderColor: "#d0d0d0",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        flex: 1,
    },
    editBadge: {
        position: "absolute",
        bottom: -12,
        left: "50%",
        transform: [{ translateX: -28 }],
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#f2f2f2",
        borderWidth: 1,
        borderColor: "#d0d0d0",
        borderRadius: 999,
        paddingVertical: 3,
        paddingHorizontal: 10,
    },
    editBadgeText: {
        fontSize: 12,
        fontFamily: "Montserrat_500Medium",
        color: "#666666",
        lineHeight: 16
    },
});

export default EditProfileUpdatePhoto;