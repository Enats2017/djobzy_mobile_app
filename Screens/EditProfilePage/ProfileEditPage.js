import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { FontAwesome, Ionicons, Feather, Entypo } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";
import * as DocumentPicker from "expo-document-picker";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import DynamicInputSection from "../../components/DynamicInputSection";
import { toastError, toastSuccess } from "../../utils/toast";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import UpdateProfilePhoto from "./UpdateProfilePhoto";
import Loading from "../../components/Loading";

const ProfileEditPage = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [socialMedia, setSocialMedia] = useState([{ id: 1, value: "" }]);
  const [category, setCategory] = useState([{ id: 1, value: "" }]);
  const [services, setServices] = useState([{ id: 1, value: "" }]);
  const [language, setLanguage] = useState([{ id: 1, value: "" }]);
  const [education, setEducation] = useState([{ id: 1, value: "" }]);
  const [assets, setAssets] = useState([{ id: 1, value: "" }]);
  const [software, setSoftware] = useState([{ id: 1, value: "" }]);
  const [vehicle, setVehicle] = useState([{ id: 1, value: "" }]);
  const [certificates, setCertificates] = useState([{ id: 1, value: "" }]);
  const [resume, setResume] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dob, setDob] = useState("");
  const [jobs, setJobs] = useState("");
  const [moneySpent, setMoneySpent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);

  const fetchProfileForEdit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/employee-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      const user = data.editprofile || {};
      console.log(user);


      // BASIC FIELDS
      setProfileTitle(user.profile_title_employee || "");
      setDescription(user.about || "");
      setDob(user.dob || "");
      setResume(user.resume_link || "");
      setJobs(user.num_jobs ? String(user.num_jobs) : "");
      setMoneySpent(user.money_spent ? String(user.money_spent) : "");
      setPhotoUri(user.photo || null);

      // CATEGORY
      setCategory(
        (data.subcategory || []).map((item) => ({
          id: item?.subid,
          value: item?.subname,
        }))
      );

      // SOCIAL MEDIA


      // SERVICES
      setServices(
        (data.promote || []).map((item) => ({
          id: item.sid,
          value: item.subject,
        }))
      );

      // // LANGUAGE
      // setLanguage(
      //   (user.languages || []).map((item, index) => ({
      //     id: index + 1,
      //     value: item.language || item,
      //   }))
      // );

      // // EDUCATION
      // setEducation(
      //   (user.education || []).map((item, index) => ({
      //     id: index + 1,
      //     value: item,
      //   }))
      // );

      // // ASSETS
      // setAssets(
      //   (user.assets || []).map((item, index) => ({
      //     id: index + 1,
      //     value: item,
      //   }))
      // );

      // // SOFTWARE
      // setSoftware(
      //   (user.software || []).map((item, index) => ({
      //     id: index + 1,
      //     value: item,
      //   }))
      // );

      // // VEHICLE
      // setVehicle(
      //   (user.vehicle || []).map((item, index) => ({
      //     id: index + 1,
      //     value: item,
      //   }))
      // );

      // // CERTIFICATES
      // setCertificates(
      //   (user.certificates || []).map((item, index) => ({
      //     id: index + 1,
      //     value: item,
      //   }))
      // );
    } catch (error) {
      console.log("Edit profile fetch error =>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileForEdit();
  }, []);


  const addItem = (type) => {
    const newItem = { id: Date.now(), value: "" };
    if (type === "category") setCategory([...category, newItem]);
    if (type === "social") setSocialMedia([...socialMedia, newItem]);
    if (type === "services") setServices([...services, newItem]);
    if (type === "language") setLanguage([...language, newItem]);
    if (type === "education") setEducation([...education, newItem]);
    if (type === "assets") setAssets([...assets, newItem]);
    if (type === "software") setSoftware([...software, newItem]);
    if (type === "vehicle") setVehicle([...vehicle, newItem]);
    if (type === "certificates") setCertificates([...certificates, newItem]);
  };

  const removeItem = (type, id) => {
    if (type === "category") setCategory(category.filter((r) => r.id !== id));
    if (type === "social") setSocialMedia(socialMedia.filter((r) => r.id !== id));
    if (type === "services") setServices(services.filter((r) => r.id !== id));
    if (type === "language") setLanguage(language.filter((r) => r.id !== id));
    if (type === "education") setEducation(education.filter((r) => r.id !== id));
    if (type === "assets") setAssets(assets.filter((r) => r.id !== id));
    if (type === "software") setSoftware(software.filter((r) => r.id !== id));
    if (type === "vehicle") setVehicle(vehicle.filter((r) => r.id !== id));
    if (type === "certificates") setCertificates(certificates.filter((r) => r.id !== id));
  };

  const updateItem = (type, id, text) => {
    if (type === "category") setCategory(category.map((r) => (r.id === id ? { ...r, value: text } : r)));
    if (type === "social") setSocialMedia(socialMedia.map((r) => (r.id === id ? { ...r, value: text } : r)));
    if (type === "services") setServices(services.map((r) => (r.id === id ? { ...r, value: text } : r)));
    if (type === "language") setLanguage(language.map((r) => r.id === id ? { ...r, value: text } : r));
    if (type === "education") setEducation(education.map((r) => r.id === id ? { ...r, value: text } : r));
    if (type === "assets") setAssets(assets.map((r) => r.id === id ? { ...r, value: text } : r));
    if (type === "software") setSoftware(software.map((r) => r.id === id ? { ...r, value: text } : r));
    if (type === "vehicle") setVehicle(vehicle.map((r) => r.id === id ? { ...r, value: text } : r));
    if (type === "certificates") setCertificates(certificates.map((r) => r.id === id ? { ...r, value: text } : r));
  };

  const openPicker = () => {
    setShowPicker(true);
  };
  const onChangeDate = (event, selectedDate) => {
    // close picker when cancel or select on android
    if (Platform.OS === "android") setShowPicker(false);

    if (selectedDate) {
      const d = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

      setDob(d); // set YYYY-MM-DD format
    }
  };
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
    });
    if (result.canceled) return;
    const file = result.assets[0];
    setSelectedFile({
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/octet-stream",
    });
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Edit Profile" navigation={navigation} />
          {
            loading ? (
              <Loading />
            ) : (
              <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.section}>
                  <UpdateProfilePhoto photoUri={photoUri} setPhotoUri={setPhotoUri} />
                  <Text style={styles.label}>Profile Title</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="I am UI/UX designer having 10+ years of experience"
                    placeholderTextColor="#bfbfbf"
                    multiline
                    textAlignVertical="top"
                    value={profileTitle}
                    onChangeText={setProfileTitle}
                  />

                  <TextInput
                    style={[styles.desBox, { marginTop: 20 }]}
                    placeholder="I have very good experience in Website and Mobile Design..."
                    placeholderTextColor="#bfbfbf"
                    multiline
                    value={description}
                    onChangeText={setDescription}
                  />

                  <DynamicInputSection
                    label="Employing in Categories"
                    values={category}
                    type="category"
                    updateItem={updateItem}
                    addItem={addItem}
                    removeItem={removeItem}
                    styles={styles}
                  />

                  <DynamicInputSection
                    label="Social Media"
                    values={socialMedia}
                    type="social"
                    updateItem={updateItem}
                    addItem={addItem}
                    removeItem={removeItem}
                    styles={styles}
                  />

                  <DynamicInputSection
                    label="My Promoted Services"
                    values={services}
                    type="services"
                    updateItem={updateItem}
                    addItem={addItem}
                    removeItem={removeItem}
                    styles={styles}
                  />

                  <View>
                    <Text style={styles.label}>Attachments</Text>
                    <TouchableOpacity style={styles.attachBox} onPress={pickFile}>
                      <Text style={{ color: "#bfbfbf" }}>Attach File</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TouchableOpacity onPress={openPicker} activeOpacity={0.8}>
                    <View pointerEvents="none">
                      <TextInput
                        style={styles.inputBox}
                        placeholder="Date of Birth"
                        placeholderTextColor="#bfbfbf"
                        value={dob}
                        editable={false} // prevent keyboard opening
                      />
                    </View>
                  </TouchableOpacity>
                  {showPicker && (
                    <DateTimePicker
                      value={dob ? new Date(dob) : new Date()}
                      mode="date"
                      display="calendar"
                      onChange={onChangeDate}
                    />
                  )}
                  <Text style={styles.label}>Resume Link</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="Resume Link"
                    placeholderTextColor="#bfbfbf"
                    multiline
                    textAlignVertical="top"
                    value={resume}
                    onChangeText={setResume}
                  />
                  <Text style={styles.label}>Number Of Jobs</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="02"
                    placeholderTextColor="#bfbfbf"
                    multiline
                    textAlignVertical="top"
                    value={jobs}
                    onChangeText={setJobs}
                  />
                  <Text style={styles.label}>Money Spent</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="44455"
                    placeholderTextColor="#bfbfbf"
                    multiline
                    textAlignVertical="top"
                    value={moneySpent}
                    onChangeText={setMoneySpent}
                  />

                  <DynamicInputSection
                    label="Languages"
                    values={language}
                    type="language"
                    updateItem={updateItem}
                    addItem={addItem}
                    removeItem={removeItem}
                    styles={styles}
                  />

                  <DynamicInputSection
                    label="Education"
                    values={education}
                    type="education"
                    updateItem={updateItem}
                    addItem={addItem}
                    removeItem={removeItem}
                    styles={styles}
                  />
                  <DynamicInputSection
                    label="Assets"
                    values={assets}
                    type="assets"
                    updateItem={updateItem}
                    addItem={addItem}
                    removeItem={removeItem}
                    styles={styles}
                  />
                  <DynamicInputSection
                    label="Vehicle"
                    values={vehicle}
                    type="vehicle"
                    updateItem={updateItem}
                    addItem={addItem}
                    removeItem={removeItem}
                    styles={styles}
                  />

                  <DynamicInputSection
                    label="Certificates"
                    values={certificates}
                    type="certificates"
                    updateItem={updateItem}
                    addItem={addItem}
                    removeItem={removeItem}
                    styles={styles}
                  />
                </View>
                <GradientButton />
              </ScrollView>
            )
          }
        </View>
        <Footer />
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
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
    fontFamily: "Montserrat_700Bold",
  },
  inputBox: {
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
    color: "#fff",
    fontStyle: "italic",
    padding: 13,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  desBox: {
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
    color: "#c3c3c3",
    padding: 10,
    fontSize: 14,
    fontStyle: "italic",
    height: 158,
    fontFamily: "Montserrat_500Medium",
    textAlignVertical: "top",
    marginBottom: 15,
  },
  plusInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginBottom: 10,
  },
  innerInput: {
    flex: 1,
    color: "#fff",
    fontStyle: "italic",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  childRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
  },
  attachBox: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#c3c3c3",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 20,
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

export default ProfileEditPage;
