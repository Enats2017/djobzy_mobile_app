import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Identity from "../../components/IdentificationPage";
import * as ImagePicker from "expo-image-picker";

const IdentityVerification = () => {
  const [docType, setDocType] = useState("Driving license");
  const [frontDoc, setFrontDoc] = useState(null);
  const [backDoc, setBackDoc] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setter(result.assets[0]);
    }
  };

  const handleVerify = async () => {
    if (!frontDoc) {
      Alert.alert("Error", "Please upload front document");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("card_type", docType);

      formData.append("DocumentFront", {
        uri: frontDoc.uri,
        name: "front.jpg",
        type: "image/jpeg",
      });

      if (backDoc) {
        formData.append("DocumentBack", {
          uri: backDoc.uri,
          name: "back.jpg",
          type: "image/jpeg",
        });
      }

      if (facePhoto) {
        formData.append("FacePhoto", {
          uri: facePhoto.uri,
          name: "face.jpg",
          type: "image/jpeg",
        });
      }

      const response = await fetch(`${API_URL}/doc-verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      console.log("DOC VERIFY RESPONSE:", data);

      if (data.status === 200) {
        Alert.alert("Success", "Document verified successfully");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView>
        <View style={styles.container}>
          <PageNameHeaderBar />
          <View style={styles.section}>
            <Identity
              selectedType={docType}
              onSelectType={setDocType}
              onUploadPersonal={() => pickImage(setFacePhoto)}
              onUploadFront={() => pickImage(setFrontDoc)}
              onUploadBack={() => pickImage(setBackDoc)}
              onVerify={handleVerify}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
});

export default IdentityVerification;
