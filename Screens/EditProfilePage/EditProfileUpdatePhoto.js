import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { toastError } from "../../utils/toast";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";

const EditProfileUpdatePhoto = ({ photoUri, setPhotoUri }) => {
    const requestPermissions = async () => {
        const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
        const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraPerm.status !== "granted" || galleryPerm.status !== "granted") {
            Alert.alert("Permission required", "Camera and Gallery permissions are required");
            return false;
        }
        return true;
    };

    const validateImageSize = async (uri) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            const maxSize = 3 * 1024 * 1024; // 3M
            if (fileInfo.size > maxSize) {
                toastError("Image must be smaller than 3MB");
                return false;
            }
            return true;
        } catch (error) {
            console.log("Image size check error:", error);
            return false;
        }
    };

    const openCamera = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const isValid = await validateImageSize(uri);
            if (!isValid) return;
            setPhotoUri(uri);
        }
    };

    const openGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const isValid = await validateImageSize(uri);
            if (!isValid) return;
            setPhotoUri(uri);
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

    return (
        <View style={styles.photoSection}>
            {photoUri && (
                <View style={styles.photoContainer}>
                    <Image source={{ uri: photoUri }} style={styles.photo} />
                    {/* <TouchableOpacity
                        style={styles.removePhoto}
                        onPress={removePhoto}
                    >
                        <Ionicons name="close" size={12} color="#d66e58" />
                    </TouchableOpacity> */}
                </View>
            )}
            <View style={styles.photouplaod}>
                <TouchableOpacity
                    style={styles.uploadPhotoButton}
                    onPress={pickImage}
                >
                    <AntDesign name="camera" size={24} color="#fff" />
                    <Text style={styles.uploadText}>{photoUri ? "Update Photo" : "Upload Photo"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    photoSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        flex: 1,
        marginBottom: 15,
        justifyContent: "space-around",
    },
    photoContainer: {
        position: "relative",
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderColor: "#ffffff1a",
        borderWidth: 1
    },
    placeholderPhoto: {
        width: 90,
        height: 95,
        borderRadius: 10,
        backgroundColor: "#333",
        justifyContent: "center",
        alignItems: "center",
    },
    removePhoto: {
        position: "absolute",
        top: 5,
        right: 3,
        backgroundColor: "#fff",
        borderRadius: 10,
        width: 15,
        height: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    removeText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    photouplaod: {
        backgroundColor: "#FFFFFF0D",
        padding: 25,
        flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#FFFFFF33",
    },
    uploadPhotoButton: {
        alignItems: "center",
        width: "100%",
    },
    uploadText: {
        color: "#fff",
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 16,
    },
});

export default EditProfileUpdatePhoto;