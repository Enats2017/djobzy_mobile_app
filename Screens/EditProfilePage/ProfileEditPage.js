import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import {
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome6,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import LineDivider from "../../components/LineDivider";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";
import * as DocumentPicker from "expo-document-picker";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdateProfilePhoto from "./EditProfileUpdatePhoto";
import Loading from "../../components/Loading";
import { useNotifications } from "../../context/MessageNotificationContext";
import EditProfileBasicInfo from "./EditProfileBasicInfo";
import EditProfileCategory from "./EditProfileCategories";
import EditProfilePromotedServices from "./EditProfilePromotedServices";
import EditProfileAttachments from "./EditProfileAttachments";
import EditProfileDob from "./EditProfileDob";
import EditProfileResumeLink from "./EditProfileResumeLink";
import EditProfileNumberofJobs from "./EditProfileNumberofJobs";
import EditProfileMoneyNumber from "./EditProfileMoneyNumber";
import EditProfileLanguages from "./EditProfileLanguages";
import EditProfileEducation from "./EditProfileEducation";
import EditProfileAssets from "./EditProfileAssets";
import EditProfileVehicles from "./EditProfileVehicles";
import EditProfileCertificates from "./EditProfileCertificates";
import EditProfileSocialMedia from "./EditProfileSocialMedia";
import { LinearGradient } from "expo-linear-gradient";
import EditProfileSeeAllInformation from "./EditProfileSeeAllInformation";
import EditProfileExperience from "./EditProfileExperience";

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
                      <View style={styles.profileinfo}>
                        <View style={styles.profileRow}>
                          <Image
                            source={{ uri: photoUri }}
                            style={styles.avatar}
                          />
                          <View style={styles.profileInfoRow}>
                            <View style={styles.userNameSection}>
                              <Text style={styles.name}>{profile?.editprofile?.full_name}</Text>
                            </View>
                            <View style={styles.iconbox}>
                              <MaterialIcons
                                name="verified"
                                size={14}
                                color="#c3c3c3c3"
                              />
                              <Text style={styles.infoText}>
                                Verification Level: {profile?.editprofile?.verification_count}/7
                              </Text>
                            </View>
                            {
                              profile?.timezone && (
                                <View style={styles.iconbox}>
                                  <Octicons name="clock-fill" size={12} color="#c3c3c3c3" />
                                  <Text style={styles.infoText}>{profile?.timezone?.user_timezone}</Text>
                                </View>
                              )
                            }
                            <View style={styles.iconbox}>
                              <Entypo name="location-pin" size={14} color="#c3c3c3c3" />
                              <Text style={styles.infoText}>
                                {profile?.editprofile?.address}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <LineDivider />
                      <View style={styles.iconRow}>
                        <TouchableOpacity
                          style={styles.iconBtn}
                        >
                          <Ionicons name="copy" size={20} color="#ffffff" />
                          <Text style={styles.iconText}>Copy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconBtn}>
                          <FontAwesome
                            name="share-square-o"
                            size={20}
                            color="#ffffff"
                          />
                          <Text style={styles.iconText}>Share</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.iconBtn}
                        // onPress={() => setDownloadModal(true)}
                        >
                          <MaterialIcons name="download" size={20} color="#ffffff" />
                          <Text style={styles.iconText}>Download</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.iconBtn}
                          onPress={() =>
                            navigation.navigate("ProfileBoostPage", {
                              categories: category,
                            })
                          }
                        >
                          <Ionicons name="rocket" size={20} color="#ffffff" />
                          <Text style={styles.iconText}>Boost</Text>
                        </TouchableOpacity>
                      </View>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        <View style={styles.statsRow}>
                          <View style={styles.statBox}>
                            <Text style={styles.statValue}>{profile?.count}</Text>
                            <Text style={styles.statLabel}>Number of Jobs</Text>
                          </View>
                          <View style={styles.statBox}>
                            <Text style={styles.statValue}>{profile?.earned}</Text>
                            <Text style={styles.statLabel}>Money Earned</Text>
                          </View>
                          <View style={styles.statBox}>
                            <Text style={styles.statValue}>
                              {" "}
                              {profile?.likes?.length}
                            </Text>
                            <Text style={styles.statLabel}>My Followers</Text>
                          </View>
                        </View>
                      </ScrollView>

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
                <View style={{paddingBottom:90}}>
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
  profileinfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  profileInfoRow: {
    flex: 1,
    gap: 2,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: "#c3c3c3",
  },
  userNameSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 7,
  },
  iconbox: {
    flexDirection: "row",
    gap: 6,
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  infoText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    width: "78%",
    fontFamily: "Montserrat_400Regular",
  },
  iconRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  iconBtn: {
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginTop: 5,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  sectionLabel: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 6,
    fontFamily: "Montserrat_700Bold",
  },
  statBox: {
    backgroundColor: "#46A282",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Montserrat_700Bold",
  },
  statLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginTop: 2,
  },
});

export default ProfileEditPage;
