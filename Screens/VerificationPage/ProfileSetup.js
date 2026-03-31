import AntDesign from "@expo/vector-icons/AntDesign";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import GradientButton from "../../components/GradientButton";
import { toastError, toastSuccess } from "../../utils/toast";
import * as FileSystem from "expo-file-system/legacy";

const ProfileSetup = ({ onNext }) => {
  const [photoUri, setPhotoUri] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [onlineResumeLink, setOnlineResumeLink] = useState("");
  const [loading, setLoading] = useState(false);
  const titleCharsLeft = 60 - title.length;
  const MIN_WORDS = 20;
  const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isGenerateEnabled = wordCount >= MIN_WORDS;

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

  const pickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (!result.canceled && result.assets?.length > 0) {
      setResumeFile(result.assets[0]);
    }
  };

  const removeResume = () => {
    setResumeFile(null);
  };

  const removePhoto = () => {
    setPhotoUri(null);
  };

  const handleSubmit = async () => {
    if (!title) {
      toastError("Please fill title");
      return;
    }
    if (!description) {
      toastError("Please fill description");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("about", description);
      formData.append("online_resume_link", onlineResumeLink);
      if (photoUri) {
        const base64Image = await FileSystem.readAsStringAsync(photoUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const imageData = `data:image/jpeg;base64,${base64Image}`;
        formData.append("image", imageData);
      }
      if (resumeFile) {
        formData.append("resume", {
          uri: resumeFile.uri,
          name: resumeFile.name || "resume.pdf",
          type: "application/pdf",
        });
      }

      const response = await axios.post(
        `${API_URL}/user-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        toastSuccess("Profile setup successfull!");
        if (onNext) onNext(response.data.user_admin);
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

  const shortFileName = (name, maxLength = 22) => {
    if (!name) return "";
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + "...";
  };

  return (
    <>
      <Text style={styles.heading}>Profile Setup</Text>
      <View style={styles.profileSection}>
        <View style={styles.titleheading}>
          <Text style={styles.label}>Profile Picture</Text>
          <Text style={styles.subLabel}>
            Try to find a picture that shows clear and visible image of you or
            your company logo
          </Text>
        </View>
        <View style={styles.photoSection}>
          {photoUri && (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removePhoto}
                onPress={removePhoto}
              >
                <Ionicons name="close" size={15} color="#d66e58" />
              </TouchableOpacity>
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

        <Text style={styles.label}>
          Profile Title <Text style={{ fontFamily: "Montserrat_400Regular" }}>(Employer)</Text>{" "}
        </Text>
        <Text style={styles.subLabel}>
          Profile title should shortly describe your main focus on Djobzy. E.g.
          I am a Plumber or I am hiring labor workers.
        </Text>
        <View style={styles.titleinput}>
          <TextInput
            style={styles.input}
            placeholder="Example: Plumber or Hiring labor workers"
            placeholderTextColor="#c3c3c3c3"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <Text style={styles.charCount}>{titleCharsLeft} characters left</Text>
        <Text style={styles.label}>Profile Description</Text>
        <Text style={styles.subLabel}>Describe your experiences or goals.</Text>

        <View style={styles.aidescription}>
          <TextInput
            style={styles.aiinput}
            multiline
            placeholder="Tell me about your self.."
            value={description}
            placeholderTextColor="#c3c3c3c3"
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.Count}>
          <Text style={styles.charCount}>
            {wordCount < MIN_WORDS
              ? `Minimum ${MIN_WORDS} words`
              : "You can generate with AI ✨"}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.generateButton,
            !isGenerateEnabled && styles.disabledBtn,
          ]}
          disabled={!isGenerateEnabled}
          onPress={() => {
            // generateWithAI()
            console.log("AI generate triggered");
          }}
        >
          <Image
            source={require("../../assets/images/aiimg.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.generateText}>Generate with AI</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Resume <Text style={{ fontFamily: "Montserrat_400Regular" }}>(Optional)
        </Text> </Text>
        <Text style={styles.subLabel}>
          Showcase your skills and experience by uploading your resume.
        </Text>
        <TouchableOpacity
          style={styles.uploadResumeButton}
          onPress={pickResume}
        >
          <Foundation name="upload" size={24} color="#fff" />
          <Text style={styles.uploadText}>Upload Resume</Text>
        </TouchableOpacity>
        {resumeFile && (
          <View style={styles.uploadedFile}>
            <View style={styles.fileInfo}>
              <AntDesign name="file-pdf" size={20} color="#e74c3c" />
              <Text style={styles.fileName}>
                {shortFileName(resumeFile.name)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.removePhoto}
              onPress={removeResume}
            >
              <Ionicons name="close" size={15} color="#d66e58" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Online Resume</Text>
        <Text style={styles.subLabel}>
          Link your profile from other platform. (e.g. LinkedIn)
        </Text>
        <View style={styles.titleinput}>
          <TextInput
            style={styles.input}
            placeholder="https://www.linkedin.com/in/..."
            placeholderTextColor="#c3c3c3"
            value={onlineResumeLink}
            onChangeText={setOnlineResumeLink}
          />

        </View>
        <TouchableOpacity onPress={pickResume} style={styles.uploadBtn}>
          <Text style={styles.uploadText}></Text>
        </TouchableOpacity>
      </View>
      <GradientButton
        title="Next"
        marginTop={25}
        disabled={loading}
        loading={loading}
        onPress={handleSubmit}
      />
    </>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "#282828",
    padding: 10,
    borderRadius: 5,
  },
  photoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
    marginBottom: 15,
    justifyContent: "space-around",
  },
  heading: {
    color: "#d66e58",
    fontSize: 28,
    marginBottom: 5,
    fontFamily: "Montserrat_600SemiBold",
  },
  photoContainer: {
    position: "relative",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
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
    width: 20,
    height: 20,
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
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  subLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 10,
  },
  titleinput: {
    backgroundColor: "#FFFFFF0D",
    borderRadius: 8,
    marginBottom: 5,
    paddingHorizontal: 8,
    height: 40,
  },
  input: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 13,
    fontStyle: "italic",
  },
  aidescription: {
    height: 90,
    padding: 10,
    backgroundColor: "#FFFFFF0D",
    borderRadius: 8,
  },

  aiinput: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#ffff",
    fontStyle: "italic",
  },

  Count: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  charCount: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    textAlign: "right",
  },
  generateButton: {
    flexDirection: "row",
    backgroundColor: "#C96B59",
    padding: 15,
    width: "55%",
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 15,
  },
  disabledBtn: {
    backgroundColor: "#ccc",
  },

  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  fileName: {
    fontSize: 14,
    color: "#333",
    maxWidth: 180,
  },

  generateText: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
  },
  uploadResumeButton: {
    backgroundColor: "#FFFFFF0D",
    padding: 25,
    flex: 1,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#FFFFFF33",
    marginBottom: 10,
  },
  uploadedFile: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
    marginBottom: 10,
  },
  fileName: {
    color: "#fff",
    flex: 1,
  },
  nextBtn: {
    backgroundColor: "#C96B59",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  nextBtnText: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
  },
});

export default ProfileSetup;
