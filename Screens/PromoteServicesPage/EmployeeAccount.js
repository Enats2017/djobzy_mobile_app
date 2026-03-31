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

const EmployeeAccount = () => {
  const [copyModel, setCopyModel] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [job, setJob] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModel, setShareModel] = useState(false);
  const [promote, setPromote] = useState([]);
  const [downloadModal, setDownloadModal] = useState(false);
  const [user, setUser] = useState([]);
  const [activeTab, setActiveTab] = useState("employee");
  const [profile, setProfile] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [socialMediaModal, setSocialMediaModal] = useState(false);
  const [socialMediaLoading, setSocialMediaLoading] = useState(false);
  const [links, setLinks] = useState({});
  const [socialLinks, setSocialLinks] = useState([]);
  const employeeLink = `${API_ICON}/employee/${user?.name}`;
  const employerLink = `${API_ICON}/employer/${user?.name}`;

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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
      setUser(data.editprofile);
      setJob(data.subcategory);
      setPromote(data.promote);
      setProfile(data);
      setSocialLinks(data.socialLinks);
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
  const handleCopyCloseModal = () => {
    setCopyModel(false);
    setActiveTab("employee");
  };

  const socialPlatforms = [
    { key: "facebook", icon: "facebook", type: "fa", placeholder: "https://www.facebook.com/your.profile" },
    { key: "linkedin", icon: "linkedin", type: "fa", placeholder: "https://www.linkedin.com/your.profile" },
    { key: "instagram", icon: "instagram", type: "fa", placeholder: "https://www.instagram.com/your.profile" },
    { key: "youtube", icon: "youtube-play", type: "fa", placeholder: "https://www.youtube.com/your.channel" },
    { key: "x", icon: "x-twitter", type: "fa6", placeholder: "https://x.com/your.profile" },
    { key: "tiktok", icon: "tiktok", type: "fa6", placeholder: "https://www.tiktok.com/your.profile" },
    { key: "telegram", icon: "telegram", type: "fa", placeholder: "https://t.me/yourusername" },
    { key: "snapchat", icon: "snapchat", type: "fa", placeholder: "https://www.snapchat.com/add/username" },
    { key: "pinterest", icon: "pinterest", type: "fa", placeholder: "https://www.pinterest.com/your.profile" },
    { key: "vk", icon: "vk", type: "fa", placeholder: "https://www.vk.com/your.profile" },
    { key: "global", icon: "globe", type: "fa", placeholder: "https://yourwebsite.com" },
  ];

  const socialPlatformsConfig = {
    facebook: { icon: "facebook", type: "fa", color: "#1877F2" },
    linkedin: { icon: "linkedin", type: "fa", color: "#0077B5" },
    instagram: { icon: "instagram", type: "fa", color: "#E4405F" },
    youtube: { icon: "youtube-play", type: "fa", color: "#FF0000" },
    x: { icon: "x-twitter", type: "fa6", color: "#000000" },
    tiktok: { icon: "tiktok", type: "fa6", color: "#000000" },
    telegram: { icon: "telegram", type: "fa", color: "#0088cc" },
    snapchat: { icon: "snapchat", type: "fa", color: "#FFFC00" },
    pinterest: { icon: "pinterest", type: "fa", color: "#E60023" },
    vk: { icon: "vk", type: "fa", color: "#4C75A3" },
    global: { icon: "globe", type: "fa", color: "#555" },
  };
  // update input value
  const updateLink = (key, value) => {
    setLinks(prev => ({
      ...prev,
      [key]: value
    }));
  };
  // clear input when delete clicked
  const clearLink = (key) => {
    setLinks(prev => ({
      ...prev,
      [key]: ""
    }));
  };

  // add new input
  const addNewLink = () => {
    setLinks([
      ...links,
      {
        id: Date.now(),
        url: "",
      },
    ]);
  };

  const openSocialLink = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const saveSocialMediaLinks = async () => {
    const payload = Object.entries(links)
      .filter(([k, v]) => v && v.trim() !== "")
      .map(([k, v]) => ({
        platform: k,
        url: v,
      }));

    try {
      setSocialMediaLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/save-social-links`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          links: payload,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toastError(data.message);
      }

      toastSuccess("Social links saved successfully");
      setSocialMediaModal(false);
    } catch (error) {
      toastError(error.message);
    } finally {
      setSocialMediaLoading(false);
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
              <View style={styles.profileinfo}>
                <View style={styles.profileRow}>
                  <Image
                    source={{
                      uri:
                        user?.photo ||
                        "https://randomuser.me/api/portraits/women/44.jpg",
                    }}
                    style={styles.avatar}
                  />
                  <View style={styles.profileInfoRow}>
                    <View style={styles.userNameSection}>
                      <Text style={styles.name}>{user?.full_name}</Text>
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
                      <MaterialIcons
                        name="verified"
                        size={14}
                        color="#c3c3c3c3"
                      />
                      <Text style={styles.infoText}>
                        Verification Level: {user?.verification_count}/7
                      </Text>
                    </View>
                    <View style={styles.iconbox}>
                      <Entypo name="location-pin" size={14} color="#c3c3c3c3" />
                      <Text style={styles.infoText}>
                        {user?.address}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <LineDivider />
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => setCopyModel(true)}
                >
                  <Ionicons name="copy" size={20} color="#ffffff" />
                  <Text style={styles.iconText}>Copy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                  <FontAwesome
                    name="share-square-o"
                    size={20}
                    color="#ffffff"
                  />
                  <Text style={styles.iconText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => setDownloadModal(true)}
                >
                  <MaterialIcons name="download" size={20} color="#ffffff" />
                  <Text style={styles.iconText}>Download</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() =>
                    navigation.navigate("ProfileBoostPage", {
                      categories: job,
                    })
                  }
                >
                  <Ionicons name="rocket" size={20} color="#ffffff" />
                  <Text style={styles.iconText}>Boost</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => navigation.navigate("ProfileEditPage")}
                >
                  <Feather name="edit-3" size={20} color="#fff" />
                  <Text style={styles.iconText}>Edit</Text>
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

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 15 }}>
                {socialLinks?.map((item, index) => {
                  const platform = socialPlatformsConfig[item.social_type];
                  if (!platform) return null;
                  return (
                    <SocialButton
                      key={index}
                      icon={platform.icon}
                      type={platform.type}
                      color={platform.color}
                      url={item.social_link}
                    />
                  );
                })}
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={styles.socialMediaBtn}
                onPress={() => setSocialMediaModal(true)}
              >
                <Text style={styles.mediaBtnText}>Social Media Accounts</Text>
                <View style={styles.iconCircle}>
                  <MaterialIcons name="add" size={24} color="#000" />
                </View>
              </TouchableOpacity>
            </View>
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
            {/* <View style={styles.calendarBox}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>My Services Calendar</Text>
                <Text style={styles.calendarTimezone}>GMT+05:30</Text>
              </View>

              <View style={styles.dateBox}>
                <Text style={styles.dateText}>September 23, 2025</Text>
              </View>

              <View style={styles.timeSlots}>
                {["01:00", "02:00", "03:00", "04:00"].map((time, index) => (
                  <Text key={index} style={styles.timeText}>
                    {time}
                  </Text>
                ))}
              </View>
            </View> */}
            <View style={styles.infoBox}>
              <QuestionMark title="Promote Services" iconColor="#fff" tooltipMessage={tooltipMessage.tooltip_provided_services} />
            </View>

            <TouchableOpacity
              style={styles.plusbtn}
              onPress={() => navigation.navigate("PromoteService")}
            >
              <AntDesign name="plus" size={18} color="#030303" />
              <Text style={styles.plustext}>Promote Services</Text>
            </TouchableOpacity>
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.promotewrapper}
              showsHorizontalScrollIndicator={false}
            >
              {promote?.map((item, index) => {
                const icon =
                  item?.seeking_services?.[0]?.get_seek_services_api?.icon;

                return (
                  <View key={index} style={styles.wrapper}>
                    {/* ICON */}
                    <View style={styles.iconContainer}>
                      {icon ? (
                        <Image
                          source={{
                            uri: `${API_ICON}/images/servicephoto/png-image/${icon}`,
                          }}
                          style={styles.image}
                          resizeMode="contain"
                        />
                      ) : (
                        <Ionicons name="image-outline" size={28} color="#999" />
                      )}
                    </View>

                    {/* CARD */}
                    <View style={styles.card}>
                      {/* TOP CONTENT */}
                      <View style={styles.cardContent}>
                        <Text style={styles.title} numberOfLines={2}>
                          {item.subject}
                        </Text>

                        <View style={styles.priceRow}>
                          <Text style={styles.price}>
                            {item.hour_minimum} CAD
                          </Text>
                          <Text style={styles.perHour}>/hour</Text>
                        </View>
                      </View>

                      {/* BUTTON (ALWAYS BOTTOM) */}
                      <GradientButton
                        title="View"
                        fontSize={15}
                        paddingVertical={0}
                        paddingHorizontal={35}
                        onPress={() =>
                          navigation.navigate("EditPromoteSevices", {
                            id: item.sid,
                            type: 2,
                          })
                        }
                      />
                    </View>
                  </View>
                );
              })}
            </ScrollView>
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

              {displayedCategories.map((item) => (
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
              {job.length > 5 && (
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
            <View style={styles.dotssection}>
              <Text style={styles.infoTitle}>Attachments</Text>
              <Text style={styles.dots}>.........</Text>
              <Text style={styles.infoTitle}>Current Work</Text>
              <Text style={styles.dots}>.........</Text>
              <Text style={styles.infoTitle}>Works History And Reviews</Text>
              <Text style={styles.dots}>.........</Text>
              <Text style={styles.infoTitle}>Other Experience</Text>
              <Text style={styles.dots}>.........</Text>
            </View>
          </ScrollView>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={copyModel}
        onRequestClose={handleCopyCloseModal}
      >
        <View style={[styles.modalOverlay]}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Copy Link</Text>
              <TouchableOpacity onPress={handleCopyCloseModal}>
                <Ionicons name="close" size={26} color="#303030" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubTitle}>
              Here you can copy a link to any of your profiles.
            </Text>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "employee" && styles.activeTabEmployee,
                ]}
                onPress={() => {
                  setActiveTab("employee");
                }}
              >
                <Text
                  style={
                    activeTab === "employee"
                      ? styles.activeTabTextEmployee
                      : styles.tabText
                  }
                >
                  Employee’s Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "employer" && styles.activeTabEmployer,
                ]}
                onPress={() => {
                  setActiveTab("employer");
                }}
              >
                <Text
                  style={
                    activeTab === "employer"
                      ? styles.activeTabTextEmployer
                      : styles.tabText
                  }
                >
                  Employer’s Profile
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.textWrap}>
                <Text
                  style={styles.linkText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {activeTab === "employee" ? employeeLink : employerLink}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() =>
                  handleCopy(activeTab === "employee" ? employeeLink : employerLink)
                }
              >
                <Ionicons
                  name="copy-outline"
                  size={18}
                  color="#fff"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={downloadModal}
        onRequestClose={() => setDownloadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Download PDF</Text>
              <TouchableOpacity onPress={() => setDownloadModal(false)}>
                <Ionicons name="close" size={26} color="#303030" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubTitle}>
              Please download a live PDF-version of your Profile where you can
              present your great work experience along with the reviews,
              verifications and all the other unique aspects of your service.
              You can use this PDF for an interview or as a certificate which
              proves your qualification.
            </Text>
            <View style={styles.button}>
              <GradientButton title="Download Colored Print" />
              <BorderButton
                borderColor="#000"
                color="#000"
                fontSize={19}
                title="Download Black & White Print"
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={socialMediaModal}
        onRequestClose={() => setSocialMediaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.socialModalContainer, { paddingBottom: insets.bottom }]}>
            {/* Close */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSocialMediaModal(false)}
            >
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {socialPlatforms.map((item, index) => (
                <View key={item.key}>
                  <View style={styles.linkRow}>
                    <View style={styles.linkLeft}>
                      <View style={styles.mediaIconCircle}>
                        {item.type === "fa" && (
                          <FontAwesome name={item.icon} size={16} color="#C76C59" />
                        )}
                        {item.type === "fa6" && (
                          <FontAwesome6 name={item.icon} size={16} color="#C76C59" />
                        )}
                      </View>
                      <TextInput
                        style={styles.linkInput}
                        placeholder={item.placeholder}
                        placeholderTextColor="#9a9a9a"
                        value={links[item.key] || ""}
                        onChangeText={(text) => updateLink(item.key, text)}
                      />
                    </View>
                    <TouchableOpacity onPress={() => clearLink(item.key)}>
                      <MaterialIcons name="delete" size={20} color="#000" />
                    </TouchableOpacity>
                  </View>
                  {index !== socialPlatforms.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addLinkBtn}>
                <Text style={styles.addLinkText}>+ Add New Link</Text>
              </TouchableOpacity>
            </ScrollView>
            <View style={styles.bottomBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setSocialMediaModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={saveSocialMediaLinks}
              >
                {
                  socialMediaLoading ? (
                    <ActivityIndicator color="#fff" size={19} />
                  ) : (
                    <Text style={styles.saveText}>Save</Text>
                  )
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    gap: 2, // 🔥 REQUIRED so text knows bounds
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
  infoBox: {
    paddingTop: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "100%",
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 18,
    color: "#303030",
  },
  modalSubTitle: {
    fontSize: 14,
    color: "#303030",
    marginBottom: 18,
    fontFamily: "Montserrat_400Regular",
  },
  tabContainer: {
    flexDirection: "row",
    borderColor: "#c5c5c591",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  tabText: {
    color: "#c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  activeTabEmployee: {
    backgroundColor: "#46A282",
    padding: 10,
    outlineColor: "#46A282",
    outlineWidth: 1,
    borderRadius: 10,
  },
  activeTabEmployer: {
    backgroundColor: "#FABB05",
    padding: 10,
    outlineColor: "#FABB05",
    outlineWidth: 1,
    borderRadius: 10,
  },

  activeTabTextEmployee: {
    color: "#ffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
  },
  activeTabTextEmployer: {
    color: "#303030",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
  },
  inputRow: {
    backgroundColor: "#EFEFEF",
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textWrap: {
    flex: 1,
  },
  linkText: {
    paddingHorizontal: 5,
    color: "#000",
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
  },
  copyBtn: {
    backgroundColor: "#CC6D5D",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    outlineColor: "#CC6D5D",
    outlineWidth: 1.3,
    alignItems: "center",
  },
  copyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
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
  infoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  promotewrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    gap: 10,
  },

  wrapper: {
    position: "relative",
    marginTop: 30,
  },

  iconContainer: {
    position: "absolute",
    top: -22,
    left: "50%",
    transform: [{ translateX: -22.5 }],
    zIndex: 10,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 25,
    height: 25,
  },

  card: {
    width: 160,
    height: 180,
    paddingTop: 27,
    paddingBottom: 18,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#ffffff1a",
  },
  cardContent: {
    alignItems: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 17,
  },

  priceRow: {
    alignItems: "center",
    gap: 4,
  },

  price: {
    color: "#34A853",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 6,
  },

  perHour: {
    color: "#34A853",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  btn: {
    backgroundColor: "#d17b68",
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 12,
  },

  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  plusbtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#fff",
    borderRadius: 13,
    paddingHorizontal: 8,
    width: "50%",
    paddingVertical: 5,
    marginTop: 10,
  },
  plustext: {
    color: "#030303",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
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
  dots: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    marginBottom: 12,
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

  socialModalContainer: {
    backgroundColor: "#fff",
    width: "100%",
    paddingBottom: 20,
    paddingTop: 40,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%"
  },

  closeBtn: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 10,
  },

  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  mediaIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  linkText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },

  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
  },

  addLinkBtn: {
    marginTop: 20,
    backgroundColor: "#EFEFEF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  addLinkText: {
    fontWeight: "600",
    color: "#000",
  },

  bottomBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 12,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#DCDCDC",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  saveBtn: {
    flex: 1,
    backgroundColor: "#C76C59",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#000",
  },

  saveText: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
  },
  linkInput: {
    width: "100%"
  }
});
