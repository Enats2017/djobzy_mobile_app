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
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import EmployerFooter from "../../components/EmployerFooter";
import CategoryModel from "../../components/CategoryModel";

const EmployerAccount = () => {
  const navigation = useNavigation();
  const [copyModel, setCopyModel] = useState(false);
  const [copyText, setCopyText] = useState("");
  const [downloadModal, setDownloadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("employee");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [subcategory, setSubcategory] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [user, setUser] = useState([]);
  const [job, setJob] = useState([]);
  const [Current, setCurrent] = useState([]);
  const [profile, setProfile] = useState([]);
  const route = useRoute();
  const { name } = route.params || [];
  const insets = useSafeAreaInsets();

  const handleCopy = async () => {
    const link = `${API_URL}/employer_profile`;
    try {
      setCopyText(link);
      await Clipboard.setStringAsync(link);
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
  const removeCategory = (id) => {
    setSubcategory((prev) => prev.filter((c) => c.subid !== id));
  };
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hey! Use my referral code:`,
      });
    } catch (error) {
      if (Platform.OS === "android") {
        ToastAndroid.show("Unable to share referral code.", ToastAndroid.SHORT);
      } else {
        Alert.alert("Error", "Unable to share referral code.");
      }
    }
  };
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
      setUser(data.editprofile);
      setJob(data.myJobPosts);
      setProfile(data);
      setSubcategory(data.subcategory);
      setCurrent(data.creview);
      console.log(data.price);
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
                <View style={styles.profileinfo}>
                  <View style={styles.profileRow}>
                    <Image
                      source={{
                        uri:
                          user.photo ||
                          "https://randomuser.me/api/portraits/women/44.jpg",
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.profileInfoRow}>
                      <Text style={styles.name}>{user?.full_name}</Text>
                      <View style={styles.iconbox}>
                        <Octicons
                          name="clock-fill"
                          size={12}
                          color="#c3c3c3c3"
                        />
                        <Text style={styles.infoText}>GMT+05:30</Text>
                      </View>
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
                        <Entypo
                          name="location-pin"
                          size={14}
                          color="#c3c3c3c3"
                        />
                        <Text style={styles.infoText}>{user.address}</Text>
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

                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={handleShare}
                  >
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
                    onPress={() => navigation.navigate("ProfileBoostPage")}
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
                        {profile?.likes?.length}
                      </Text>
                      <Text style={styles.statLabel}>My Followers</Text>
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View style={styles.infoBox}>
                <View style={styles.iconbox}>
                  <Text style={styles.infoTitle}>Profile Title</Text>
                  <FontAwesome
                    name="question-circle"
                    size={16}
                    color="#ffffff"
                    style={{ marginLeft: 5 }}
                  />
                </View>
                <Text style={styles.infoText2}>
                  {user.profile_title_employer}
                </Text>

                <View style={styles.iconbox}>
                  <Text style={styles.infoTitle}>About Me</Text>
                  <FontAwesome
                    name="question-circle"
                    size={16}
                    color="#ffffff"
                    style={{ marginLeft: 5 }}
                  />
                </View>
                <Text style={styles.infoText2}>{user.employer_about}</Text>
              </View>
              <Text style={styles.infoTitle}> MyJobPosts</Text>
              {job?.data?.map((item, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.heading}>{item.subject}</Text>
                  <Text style={styles.desc}>{item.description}</Text>
                  <Text style={styles.row}>
                    <Text style={styles.label}>Total Price:</Text> CAD{" "}
                    {item.fixed_minimum}
                    {"   "}
                    <Text style={styles.label}>Hourly Rate:</Text> CAD{" "}
                    {item.hour_minimum}
                  </Text>
                  <Text style={styles.row}>
                    <Text style={styles.label}>Project Length:</Text>{" "}
                    {item.expected_hour}
                  </Text>
                  <LineDivider />
                  <View style={styles.gridentbtn}>
                    <Text style={styles.row}>Proposals: {item.proposal}</Text>
                    <GradientButton
                      title="View"
                      paddingVertical={6}
                      paddingHorizontal={22}
                      marginTop={0}
                      onPress={() =>
                        navigation.navigate("PostJobDetails", {
                          jobId: item.request_slug,
                        })
                      }
                    />
                  </View>
                </View>
              ))}

              <View style={styles.iconbox}>
                <Text style={styles.infoTitle}>Employee Category</Text>
                <FontAwesome
                  name="question-circle"
                  size={16}
                  color="#ffffff"
                  style={{ marginLeft: 5 }}
                />
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
                      onPress={() => removeCategory(item.subid)}
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

              <View style={styles.dotssection}>
                <Text style={styles.infoTitle}>Attachments</Text>
                <Text style={styles.dots}>.........</Text>
                <Text style={styles.infoTitle}>Current Work</Text>
                {Current?.data?.length > 0 ? (
                  Current.data.map((item, index) => (
                    <View key={index} style={styles.card}>
                      <Text style={styles.heading}>{item.subject}</Text>
                      <Text style={styles.desc}>{item.description}</Text>

                      <Text style={styles.row}>
                        <Text style={styles.label}>Total Price:</Text> CAD{" "}
                        {item.fixed_minimum}
                        {"   "}
                        <Text style={styles.label}>Hourly Rate:</Text> CAD{" "}
                        {item.hour_minimum}
                      </Text>

                      <Text style={styles.row}>
                        <Text style={styles.label}>Project Length:</Text>{" "}
                        {item.expected_hour}
                      </Text>

                      <LineDivider />

                      <View style={styles.gridentbtn}>
                        <Text style={styles.row}>
                          Proposals: {item.proposal}
                        </Text>
                        <GradientButton
                          title="View"
                          paddingVertical={6}
                          paddingHorizontal={22}
                        />
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noData}>No current work found.</Text>
                )}

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
          onRequestClose={() => setCopyModel(false)}
        >
          <View style={[styles.modalOverlay]}>
            <View
              style={[styles.modalContainer, { paddingBottom: insets.bottom }]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Copy Link</Text>
                <TouchableOpacity onPress={() => setCopyModel(false)}>
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
                  onPress={() => setActiveTab("employee")}
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
                  onPress={() => setActiveTab("employer")}
                >
                  <Text
                    style={
                      activeTab === "jobs"
                        ? styles.activeTabTextEmployer
                        : styles.tabText
                    }
                  >
                    Employer’s Profile
                  </Text>
                </TouchableOpacity>
              </View>
              {activeTab === "employee" ? (
                <View style={styles.inputRow}>
                  <Text style={styles.linkText}>{copyText}</Text>
                  <TouchableOpacity style={styles.copyBtn}>
                    <Text style={styles.copyText}>Copy Link</Text>
                    <Ionicons
                      name="copy-outline"
                      size={18}
                      color="#fff"
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.inputRow}>
                  <Text style={styles.linkText}>{copyText}</Text>
                  <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                    <Text style={styles.copyText}>Copy Link</Text>
                    <Ionicons
                      name="copy-outline"
                      size={18}
                      color="#fff"
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              )}
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
            <View
              style={[styles.modalContainer, { paddingBottom: insets.bottom }]}
            >
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
        <CategoryModel
          visible={modalVisible}
          type={1}
          pageType={1}
          onClose={() => {
            setModalVisible(false);
            fetchEmployer();
          }}
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
    paddingHorizontal: 10,
  },
  profileCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  profileinfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 9,
  },
  avatar: {
    width: 80,
    height: 80,
    borderWidth: 1.5,
    borderColor: "#c3c3c3",
    borderRadius: 60,
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
    paddingVertical: 2,
  },
  infoText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    backgroundColor: "#C97863",
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
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ffffff1a",
    borderRadius: 7,
    padding: 13,
    marginTop: 8,
    marginBottom: 12,
  },
  heading: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },
  desc: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#bfbfbf",
    marginBottom: 10,
    lineHeight: 18,
  },
  row: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
  },
  label: {
    fontFamily: "Montserrat_500Medium",
    color: "#fff",
  },
  gridentbtn: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  dots: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    marginBottom: 12,
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
  linkText: {
    width: "70%",
    color: "#000",
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
    paddingHorizontal: 10,
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
});

export default EmployerAccount;
