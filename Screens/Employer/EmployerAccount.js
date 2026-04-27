import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Share,
  Platform,
  ToastAndroid,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialIcons,
  AntDesign,
  Octicons,
  Entypo,
} from "@expo/vector-icons";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import LineDivider from "../../components/LineDivider";
import GradientButton from "../../components/GradientButton";
import BorderButton from "../../components/BorderButton";
import * as Clipboard from "expo-clipboard";
import { API_URL, API_ICON } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import EmployerFooter from "../../components/EmployerFooter";
import CategoryModel from "../../components/CategoryModel";
import QuestionMark from "../../components/QuestionMark";
import EditProfileSeeAllInformation from "../EditProfilePage/EditProfileSeeAllInformation";
import { useEditProfileStore } from "../EditProfilePage/useEditProfileStore";
import SocialMediaLinks from "../../components/SocialMediaLinks";
import ProfileHeader from "../ProfileComponents/ProfileHeader";
import Delete_Category from "../../components/Delete_Category";
import JobPostList from "./JobPostList";
import CurrentJobPostList from "./CurrentJobPostList";
import EmptyState from "../../components/EmptyState";
import ContractReviewCard from "../ProfileComponents/ContractReviewCard";
import AttachmentSection from "../ProfileComponents/AttachmentSection";

const EmployerAccount = () => {
  const setAllData = useEditProfileStore((state) => state.setAllData);
  const navigation = useNavigation();
  const [employeeLink, setEmployeeLink] = useState("");
  const [employerLink, setEmployerLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [subcategory, setSubcategory] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [user, setUser] = useState([]);
  const [job, setJob] = useState([]);
  const [current, setCurrent] = useState([]);
  const [completeReview, setCompleteReview] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState("");

  const fetchEmployer = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/employer-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setEmployeeLink(data.employee_link);
      setEmployerLink(data.employer_link);
      setUser(data.editprofile);
      setJob(data.myJobPosts);
      setSubcategory(data.subcategory);
      setCurrent(data.creview);
      setSocialLinks(data.socialLinks);
      setCompleteReview(data.complete_review);
      const user = data.editprofile || {};
      setAllData({
        userAdmin: user.admin || 0,
        profileTitle: user.admin === 2 ? user.profile_title_employer || "" : user.profile_title_employee || "",
        description: user.admin === 2 ? user.employer_about || "" : user.about || "",
        photoUri: user.photo || null,
        category: data.subcategory || [],
        promote: data.promote || [],
        languages: data.language || [],
        education: data.education || [],
        vehicles: data.vehicle || [],
        assets: data.assets || [],
        licenses: data.licence || [],
        certificates: data.certificate || [],
        experiences: data.experiences || [],
        attachments: data.user_attachments || [],
        dob: user.dob || "",
        years: data.years || 0,
        ageShowStatus: user.age_show_status || 0,
        moneyShowStatus: user.admin === 0 ? user.money_spent_show_status || 0 : user.money_earned_show_status || 0,
      });
      useEditProfileStore.setState({ profile: data });
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployer();
  }, []);

  const handleOpenDelete = (id, name) => {
    setSelectedId(id);
    setSelectedName(name);
    setDeleteModalVisible(true);
  };

  const handleCloseDelete = () => {
    setSelectedId(null);
    setDeleteModalVisible(false);
  };
  const handleDeleted = (deletedId) => {
    setSubcategory((prev) => prev.filter((item) => item.subid !== deletedId));
    fetchEmployer();
    handleCloseDelete();
  };

  const handleCopy = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      if (Platform.OS === "android") {
        ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
      } else {
        Alert.alert("Copied!", "Link copied to clipboard.");
      }
    } catch (error) {
      console.log("Clipboard Error:", error);
      alert("Copy failed");
    }
  };
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hey! Use my referral code: ${employerLink}`,
      });
    } catch (error) {
      if (Platform.OS === "android") {
        ToastAndroid.show("Unable to share referral code.", ToastAndroid.SHORT);
      } else {
        Alert.alert("Error", "Unable to share referral code.");
      }
    }
  };

  const displayedCategories = showAllCategories
    ? subcategory
    : subcategory.slice(0, 5);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <PageNameHeaderBar title="My Account" navigation={navigation} />
          </View>
          {loading ? (
            <Loading />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <View style={styles.profileCard}>
                <ProfileHeader
                  navigation={navigation}
                  socialLinks={socialLinks}
                  employeeLink={employeeLink}
                  employerLink={employerLink}
                  onCopy={handleCopy}
                  onShare={handleShare}
                  initialActive="employer"
                />

                <EditProfileSeeAllInformation navigation={navigation} isEdit={false} />
              </View>
              <View style={styles.infoBox}>
                <QuestionMark title="Profile Title" iconColor="#fff" tooltipMessage="Update your personal details here." />
                <Text style={styles.infoText2}>
                  {user.profile_title_employer}
                </Text>

                <QuestionMark title="About Me" iconColor="#fff" />
                <Text style={styles.infoText2}>{user.employer_about}</Text>
              </View>

              <Text style={styles.infoTitle}> Employer category section</Text>
              <View style={styles.pillsWrapper}>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => setModalVisible(true)}
                >
                  <Ionicons name="add" size={18} color="#000" />
                  <Text style={styles.addText}>Add Category</Text>
                </TouchableOpacity>

                {displayedCategories.map((item) => (
                  <View key={item.subid} style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{item.subname}</Text>

                    <TouchableOpacity
                      // onPress={() => removeCategory(item.subid)}
                      onPress={() =>
                        handleOpenDelete(item.subid, item.subname)
                      }
                    >
                      <Ionicons
                        name="close"
                        size={16}
                        color="#fff"
                        style={{ marginLeft: 6 }}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
                {subcategory.length > 5 && (
                  <TouchableOpacity
                    onPress={() => setShowAllCategories((prev) => !prev)}
                    style={styles.showMoreBtn}
                  >
                    <Text style={styles.showMoreText}>
                      {showAllCategories ? "Show Less" : "Show More"}
                    </Text>

                    <Ionicons
                      name={showAllCategories ? "chevron-up" : "chevron-down"}
                      size={14}
                      color="#000"
                      style={{ marginLeft: 5 }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <AttachmentSection />

              <JobPostList
                jobData={job?.data}
                navigation={navigation}
              />

              <CurrentJobPostList
                currentJobData={current?.data}
                navigation={navigation}
                label="Current Contracts"
                admin={2}
              />

              <View style={styles.attachmentRow}>
                <Text style={styles.label}>Contract History And Reviews</Text>
                <ContractReviewCard reviews={completeReview?.data} />
              </View>

              <View style={styles.postcard}>
                <Text style={styles.postText}>What needs to be done?</Text>
                <Text style={styles.subtitle}>
                  It takes about 2 minutes to post a new job
                </Text>

                <GradientButton
                  colors={["#000", "#000"]}
                  onPress={() => navigation.navigate("CreateJob")}
                  title="Post a New Job"
                  paddingHorizontal={26}
                  textColor="#fff"
                />
              </View>
            </ScrollView>
          )}
        </View>

        <CategoryModel
          visible={modalVisible}
          type={1}
          pageType={1}
          onClose={() => {
            setModalVisible(false);
            fetchEmployer();
          }}
        />
        <Delete_Category
          visible={deleteModalVisible}
          id={selectedId}
          onClose={handleCloseDelete}
          onDeleted={handleDeleted}
          name={selectedName}
        />
        <EmployerFooter />
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
  profileCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 15,
    padding: 15,
  },

  infoBox: {
    paddingTop: 12,
    padding: 6,
  },
  infoTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  infoText2: {
    color: "#c3c3c3c3",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 15,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff1a",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 4,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  pillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffff",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },
  addText: {
    color: "#000",
    marginLeft: 4,
    fontSize: 14,
  },
  showMoreBtn: {
    marginTop: 10,
    paddingVertical: 7.5,
    paddingHorizontal: 12,
    backgroundColor: "#ececec",
    borderRadius: 20,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },

  showMoreText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#000",
  },
  postcard: {
    backgroundColor: "#FABB05",
    borderRadius: 14,
    paddingVertical: 18,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#000",
    width: "70%",
    fontFamily: "Montserrat_500Medium",
    opacity: 0.85,
    textAlign: "center",
  },

  postText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    color: "#000",
    marginBottom: 8,
  },
  attachmentRow: {
    marginTop: 15,
    flexDirection: 'column',
  },
  label: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: '#ffffff',
    lineHeight: 24,
  },
  attachmentSection: {
    marginTop: 10,
    marginBottom: 0
  },
});

export default EmployerAccount;