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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";

const ProfileSetup = ({ userId, onNext }) => {
  const [photoUri, setPhotoUri] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [onlineResumeLink, setOnlineResumeLink] = useState("");
  const [loading, setLoading] = useState(false);
  const titleCharsLeft = 60 - title.length;
  const descriptionChars = description.length;
  const maxDescriptionChars = 500;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
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
    if (!title || !description) {
      alert("Please fill title and description");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("about", description);
      formData.append("online_resume_link", onlineResumeLink);
      if (resumeFile) {
        formData.append("resume", {
          uri: resumeFile.uri,
          name: resumeFile.name,
          type: "application/pdf",
        });
      }
      if (photoUri) {
        formData.append("photo", {
          uri: photoUri,
          name: "profile.jpg",
          type: "image/jpeg",
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
        alert("Profile setup successful!");
        if (onNext) onNext(response.data.user_admin);
      } else {
        alert(response.data.message || "Failed to save data");
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(
        "Profile setup error:",
        error.response?.data || error.message
      );
      alert("Error saving profile data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.scrolcontent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Profile Stup</Text>
        <View style={styles.profileSection}>
          <View style={styles.titleheading}>
            <Text style={styles.label}>Profile Picture</Text>
            <Text style={styles.subLabel}>
              Try to final a picture that shows clear and visible image of your
              or your company logo
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
                  <Ionicons name="close" size={15} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.photouplaod}>
              <TouchableOpacity
                style={styles.uploadPhotoButton}
                onPress={pickImage}
              >
                <AntDesign name="camera" size={24} color="#fff" />
                <Text style={styles.uploadText}>Upload Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>
            Profile Title <Text style={styles.subLabel}>(Employer)</Text>{" "}
          </Text>
          <Text style={styles.subLabel}>
            Profile title should shortly describe your main focus on Djobzy.
            E.g. I am a Plumber or I am hiring labor workers.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Plumber or Hiring labor workers"
            placeholderTextColor="#b3afafff"
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.charCount}>{titleCharsLeft} characters left</Text>
          <Text style={styles.label}>Profile Description</Text>
          <Text style={styles.subLabel}>
            Describe your experiences or goals.
          </Text>

          <TextInput
            style={styles.aidescription}
            multiline
            placeholder="Tell me about your self"
            value={description}
            placeholderTextColor="#c3c3c3c3"
            onChangeText={setDescription}
          />

          <View style={styles.Count}>
            <Text style={styles.charCount}>Minimum 18 words</Text>
            <Text style={styles.charCount}>
              {descriptionChars}/{maxDescriptionChars}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.generateButton}
            // onPress={generateWithAI}
            // disabled={!isGenerateEnabled}
          >
            <Text style={styles.generateText}>✨ Generate with AI</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Resume (Optional)</Text>
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
              <Text style={styles.fileName}>{resumeFile.name}</Text>
              <TouchableOpacity onPress={removeResume}>
                <Text style={styles.removeText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.label}>Online Resume</Text>
          <Text style={styles.subLabel}>
            Link your profile from other platform. (e.g. LinkedIn)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="https://www.linkedin.com/in/..."
            placeholderTextColor="#c3c3c3"
            value={onlineResumeLink}
            onChangeText={setOnlineResumeLink}
          />
          <TouchableOpacity onPress={pickResume} style={styles.uploadBtn}>
            <Text style={styles.uploadText}>
              {resumeFile ? `📄 ${resumeFile.name}` : "Upload Resume (PDF)"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={handleSubmit}>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "#282828",
    padding: 12,
    elevation: 2,
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
    marginBottom: 10,
    fontWeight: "700",
  },
  photoContainer: {
    position: "relative",
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    top: 0,
    right: 0,
    backgroundColor: "#d66e58",
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
  input: {
    backgroundColor: "#FFFFFF0D",

    padding: 10,
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    fontStyle: "italic",
    borderRadius: 8,
    marginBottom: 5,
  },
  aidescription: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    height: 80,
    padding: 10,
    backgroundColor: "#FFFFFF0D",
    borderRadius: 8,
    fontStyle: "italic",
  },

  Count: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  charCount: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "right",
  },
  generateButton: {
    backgroundColor: "#C96B59",
    padding: 15,
    width: "55%",
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#666",
  },
  generateText: {
    color: "#fff",
    fontWeight: "bold",
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
    marginBottom: 15,
  },
  uploadedFile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e07461ff",
    padding: 10,
  },
  fileName: {
    color: "#fff",
    flex: 1,
  },
  nextBtn: {
    backgroundColor: "#C96B59",
    padding: 16,
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
