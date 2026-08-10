import React, { useState, useEffect, useCallback } from "react";
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
  TextInput,
  ActivityIndicator
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import Entypo from "@expo/vector-icons/Entypo";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome6,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import LineDivider from "../../components/LineDivider";
import Footer from "../../components/Footer";
import GradientButton from "../../components/GradientButton";
import BorderButton from "../../components/BorderButton";
import * as Clipboard from "expo-clipboard";
import { API_ICON, API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import CategoryModel from "../../components/CategoryModel";
import Delete_Category from "../../components/Delete_Category";
import QuestionMark from "../../components/QuestionMark";
import { toastError, toastSuccess } from "../../utils/toast";
import { Linking } from "react-native";
import SocialButton from "../../components/SocialButton";
import { tooltipMessage } from "../../components/TooltipMessage";
import EditProfileSeeAllInformation from "../EditProfilePage/EditProfileSeeAllInformation";
import { useEditProfileStore } from "../EditProfilePage/useEditProfileStore";
import ProfileHeader from "../ProfileComponents/ProfileHeader";
import AddSocialMediaModal from "../EditProfilePage/modals/AddSocialMediaModal";
import AttachmentSection from "../ProfileComponents/AttachmentSection";
import ContractReviewCard from "../ProfileComponents/ContractReviewCard";
import EmptyState from "../../components/EmptyState";
import CurrentJobPostList from "../Employer/CurrentJobPostList";
import ExperienceSection from "../ProfileComponents/ExperienceSection";
import EditProfileCategory from "../EditProfilePage/EditProfileCategories";
import EditProfilePromotedServices from "../EditProfilePage/EditProfilePromotedServices";

const EmployeeAccount = () => {
  const setAllData = useEditProfileStore((state) => state.setAllData);
  const [modalVisible, setModalVisible] = useState(false);
  const [job, setJob] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promote, setPromote] = useState([]);
  const [user, setUser] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [socialLinks, setSocialLinks] = useState([]);
  const [employeeLink, setEmployeeLink] = useState("");
  const [employerLink, setEmployerLink] = useState("");
  const [completeReview, setCompleteReview] = useState([]);
  const [current, setCurrent] = useState([]);
  const navigation = useNavigation();

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/employee-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setEmployeeLink(data.employee_link);
      setEmployerLink(data.employer_link);
      setUser(data.editprofile);
      setJob(data.subcategory);
      setPromote(data.promote);
      setSocialLinks(data.socialLinks);
      setCompleteReview(data.oreview);
      setCurrent(data.creview);
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployee();
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
    fetchEmployee();
    handleCloseDelete();
  };

  const handleCopy = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      if (Platform.OS === "android") {
        ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
      } else {
        toastSuccess("Link copied to clipboard.");
      }
    } catch (error) {
      console.log("Clipboard Error:", error);
      toastError("Copy failed");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hey! Use my referral code: ${employeeLink}`,
      });
    } catch (error) {
      if (Platform.OS === "android") {
        ToastAndroid.show("Unable to share referral code.", ToastAndroid.SHORT);
      } else {
        Alert.alert("Error", "Unable to share referral code.");
      }
    }
  };
  const displayedCategories = showAllCategories ? job : job?.slice(0, 5);

  return (
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
                initialActive = "employee"
                job={job}
              />

              <EditProfileSeeAllInformation navigation={navigation} isEdit={false} />
            </View>
            {/* <View>
              <TouchableOpacity
                style={styles.socialMediaBtn}
                onPress={() => setSocialMediaModal(true)}
              >
                <Text style={styles.mediaBtnText}>Social Media Accounts</Text>
                <View style={styles.iconCircle}>
                  <MaterialIcons name="add" size={24} color="#000" />
                </View>
              </TouchableOpacity>
            </View> */}
            <View style={styles.infoBox}>
              <QuestionMark title="Profile Title" iconColor="#fff" tooltipMessage={tooltipMessage.employee_profile_title_tooltip} />
              <Text style={styles.infoText2}>
                {user?.profile_title_employee}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <QuestionMark title="About Me" iconColor="#fff" tooltipMessage={tooltipMessage.employee_about_me_tooltip} />
              <Text style={styles.infoText2}>{user?.about}</Text>
            </View>

            <View style={styles.promoteServiceSection}>
              <EditProfilePromotedServices
                navigation={navigation}
                isEdit={false}
              />
            </View>

            <View style={styles.infoBox}>
              <QuestionMark title="Employee Category" iconColor="#fff" tooltipMessage={tooltipMessage.tooltip_involved_category} />
            </View>
            <View style={styles.pillsWrapper}>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="add" size={18} color="#000" />
                <Text style={styles.addText}>Add Category</Text>
              </TouchableOpacity>

              {displayedCategories?.map((item) => (
                <View key={item.subid} style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{item.subname}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      handleOpenDelete(item.service_id, item.subname)
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
              {job?.length > 5 && (
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
            <View style={styles.boostbtn}>
              <GradientButton
                title="Boost"
                paddingHorizontal={40}
                paddingVertical={0}
                onPress={() =>
                  navigation.navigate("ProfileBoostPage", {
                    categories: job,
                  })
                }
              />
              <Text style={styles.category}>Boosted Categories</Text>
            </View>

            <AttachmentSection />

            <CurrentJobPostList
              currentJobData={current?.data}
              navigation={navigation}
              label="Current Work"
              admin={0}
            />

            <View style={styles.attachmentRow}>
              <Text style={styles.label}>Work History And Reviews</Text>
              <ContractReviewCard reviews={completeReview?.data} />
            </View>

            <ExperienceSection />
          </ScrollView>
        )}
      </View>

      <CategoryModel
        visible={modalVisible}
        type={1}
        pageType={0}
        onClose={() => {
          setModalVisible(false);
        }}
      />
      <Delete_Category
        visible={deleteModalVisible}
        id={selectedId}
        onClose={handleCloseDelete}
        onDeleted={handleDeleted}
        name={selectedName}
      />
      <Footer />
    </SafeAreaView>
  );
};

export default EmployeeAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  profileCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  infoBox: {
    paddingTop: 12,
  },
  infoText2: {
    color: "#c3c3c3c3",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    lineHeight: 18,
  },
  socialMediaBtn: {
    backgroundColor: "#46A282",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginVertical: 15,
  },

  mediaBtnText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
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
  boostbtn: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 17,
    paddingBottom: 12,
  },
  category: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
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
  attachmentRow: {
    marginBottom: 15,
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
    marginBottom: 0
  },
  promoteServiceSection: {
    marginTop: 15
  },
});
