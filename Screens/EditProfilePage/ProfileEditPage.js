import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import LineDivider from "../../components/LineDivider";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import { useNotifications } from "../../context/MessageNotificationContext";
import EditProfileBasicInfo from "./EditProfileBasicInfo";
import EditProfileCategory from "./EditProfileCategories";
import EditProfilePromotedServices from "./EditProfilePromotedServices";
import EditProfileAttachments from "./EditProfileAttachments";
import EditProfileSeeAllInformation from "./EditProfileSeeAllInformation";
import EditProfileExperience from "./EditProfileExperience";
import EditProfileUpdatePhoto from "./EditProfileUpdatePhoto";
import EditProfileInfoHeader from "./EditProfileInfoHeader";

const ProfileEditPage = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [socialMedia, setSocialMedia] = useState([]);
  const [category, setCategory] = useState([]);
  const [promote, setPromote] = useState([]);
  const [services, setServices] = useState([]);
  const [language, setLanguage] = useState([]);
  const [education, setEducation] = useState([]);
  const [assets, setAssets] = useState([]);
  const [software, setSoftware] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [resume, setResume] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dob, setDob] = useState("");
  const [jobs, setJobs] = useState("");
  const [moneySpent, setMoneySpent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [profile, setProfile] = useState({});
  const { admin } = useNotifications();
  const userType = admin === 2 ? 'employer' : 'employee';
  const hasFetched = useRef(false);

  useEffect(() => {
    hasFetched.current = false;
  }, [userType]);

  const fetchProfileForEdit = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/edit-profile/${userType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const user = data.editprofile || {};

      // BASIC FIELDS
      if (userType === "employer") {
        setProfileTitle(user.profile_title_employer || "");
        setDescription(user.employer_about || "");
      } else {
        setProfileTitle(user.profile_title_employee || "");
        setDescription(user.about || "");
      }
      setDob(user.dob || "");
      setResume(user.resume_link || "");
      setJobs(user.num_jobs ? String(user.num_jobs) : "");
      setMoneySpent(user.money_spent ? String(user.money_spent) : "");
      setPhotoUri(user.photo || null);
      setProfile(data);
      setCategory(data.subcategory);
      setPromote(data.promote);
    } catch (error) {
      console.log("Edit profile fetch error =>", error);
    } finally {
      setLoading(false);
    }
  }, [userType]);

  useFocusEffect(
    useCallback(() => {
      if (!hasFetched.current) {
        fetchProfileForEdit();
        hasFetched.current = true;
      }
    }, [fetchProfileForEdit])
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Edit Profile" navigation={navigation} />
          {
            loading ? (
              <Loading />
            ) : (
              <>
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 50 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.section}>
                    <View style={styles.profileCard}>
                      <EditProfileInfoHeader
                        profile={profile}
                        photoUri={photoUri}
                        setPhotoUri={setPhotoUri}
                        navigation={navigation}
                        category={category}
                      />
                      {/* === SEE ALL INFORMATION SECTION === */}
                      <EditProfileSeeAllInformation navigation={navigation} />
                    </View>

                    <EditProfileBasicInfo
                      userType={userType}
                      profileTitle={profileTitle}
                      setProfileTitle={setProfileTitle}
                      description={description}
                      setDescription={setDescription}
                    />

                    <EditProfileCategory
                      category={category}
                    />

                    <EditProfilePromotedServices
                      promote={promote}
                      navigation={navigation}
                    />
                    <EditProfileAttachments
                      // pickFile={pickFile}
                      navigation={navigation}
                    />
                    <EditProfileExperience
                      // pickFile={pickFile}
                      navigation={navigation}
                    />
                  </View>
                </ScrollView>
                <View style={{ paddingBottom: 90 }}>
                  <GradientButton title="Apply Changes" />
                </View>
              </>
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
    paddingHorizontal: 15,
    backgroundColor: "#222222"
  },
  profileCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

export default ProfileEditPage;
