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
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import Entypo from "@expo/vector-icons/Entypo";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Ionicons,
  Feather,
  FontAwesome,
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
import { captureRef } from "react-native-view-shot";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useRef } from "react";

import Delete_Category from "../../components/Delete_Category";
import QuestionMark from "../../components/QuestionMark";

const EmployeeAccount = () => {
  const route = useRoute();
  const { name } = route.params || [];
  const employeeLink = `${API_ICON}/employee-profile/${name}`;
  const employerLink = `${API_ICON}/employer-profile/${name}`;
  const [copyModel, setCopyModel] = useState(false);
  const [copyText, setCopyText] = useState(employeeLink);
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
  const screenRef = useRef(null);
  const scrollRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(copyText);
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
    } catch (err) {
      setError(err.message);
      console.log(err);
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

  // const onCategoryDeleted = (id) => {
  //   // remove locally so UI updates immediately
  //   setSubcategory((prev) => prev.filter((c) => c.subid !== id));
  //   // optionally refetch from server: fetchEmployee();
  // };

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
  const displayedCategories = showAllCategories ? job : job.slice(0, 5);

  const generateExactUIPDF = async (mode = "color") => {
    const isBW = mode === "bw";

    const colors = {
      bg: isBW ? "#ffffff" : "#222222",
      card: isBW ? "#ffffff" : "rgba(255,255,255,0.1)",
      text: isBW ? "#000000" : "#ffffff",
      sub: isBW ? "#555" : "#c3c3c3",
      stat: isBW ? "#000" : "#46A282",
      accent: isBW ? "#000" : "#25dd4d",
      pill: isBW ? "#eeeeee" : "rgba(255,255,255,0.1)",
    };

    const html = `
  <html>
  <head>
    <style>
      @page { size: A4; margin: 18px; }
      body {
        background:${colors.bg};
        color:${colors.text};
        font-family: Arial, sans-serif;
      }
      .profileCard {
        background:${colors.card};
        border-radius:15px;
        padding:20px 10px;
      }
      .row { display:flex; gap:8px; }
      .avatar {
        width:84px; height:84px;
        border-radius:60px;
        border:1.5px solid ${colors.sub};
      }
      .name { font-size:18px; margin-bottom:7px; }
      .iconRow { display:flex; justify-content:space-between; margin-top:12px; }
      .iconText { font-size:12px; }
      .statsRow { display:flex; gap:10px; margin-top:18px; }
      .statBox {
        background:${colors.stat};
        padding:16px 25px;
        border-radius:10px;
        text-align:center;
      }
      .infoBox { margin-top:12px; }
      .pill {
        display:inline-flex;
        background:${colors.pill};
        padding:7px 14px;
        border-radius:20px;
        margin:4px;
        font-size:12px;
      }
      .serviceCard {
        width:160px;
        padding:14px;
        border-radius:14px;
        border:1.5px solid ${colors.pill};
        text-align:center;
        display:inline-block;
        margin-right:10px;
      }
      .price { color:${colors.accent}; }
    </style>
  </head>

  <body>

  <div class="profileCard">
    <div class="row">
      <img class="avatar" src="${user.photo || ""}" />
      <div>
        <div class="name">${user.full_name}</div>
        <div style="color:${colors.sub};">Verification Level: ${user.verification_count}/7</div>
        <div style="color:${colors.sub};">${user.address}</div>
      </div>
    </div>

    <div class="statsRow">
      <div class="statBox">${profile.count}<br/>Jobs</div>
      <div class="statBox">${profile.earned}<br/>Earned</div>
      <div class="statBox">${profile.likes?.length}<br/>Followers</div>
    </div>
  </div>

  <div class="infoBox">
    <b>Profile Title</b>
    <div style="color:${colors.sub};">${user.profile_title_employee}</div>
  </div>

  <div class="infoBox">
    <b>About Me</b>
    <div style="color:${colors.sub};">${user.about}</div>
  </div>

  <div class="infoBox"><b>Promote Services</b></div>

  ${promote
    .map(
      (p) => `
    <div class="serviceCard">
      <b>${p.subject}</b><br/>
      <span class="price">${p.hour_minimum} CAD</span><br/>
      <small>/hour</small>
    </div>
  `,
    )
    .join("")}

  <div class="infoBox"><b>Employee Category</b></div>

  ${job.map((j) => `<span class="pill">${j.subname}</span>`).join("")}

  </body>
  </html>
  `;

    const pdf = await Print.printToFileAsync({ html });
    const uri = pdf.uri || pdf.fileUri;
    const dest =
      FileSystem.documentDirectory + `profile_ui_${mode}_${Date.now()}.pdf`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    await Sharing.shareAsync(dest);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container} ref={screenRef} collapsable={false}>
        <View style={styles.header}>
          <PageNameHeaderBar title="My Account" navigation={navigation} />
        </View>
        {loading ? (
          <Loading />
        ) : (
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            onContentSizeChange={(w, h) => setContentHeight(h)}
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
                      <Octicons name="clock-fill" size={12} color="#c3c3c3c3" />
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
                      <Entypo name="location-pin" size={14} color="#c3c3c3c3" />
                      <Text style={styles.infoText}>{user?.address}</Text>
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
            </View>
            <View style={styles.infoBox}>
              {/* <View style={styles.iconbox}>
                <Text style={styles.infoTitle}>Profile Title</Text>
                <FontAwesome
                  name="question-circle"
                  size={16}
                  color="#ffffff"
                  style={{ marginLeft: 5 }}
                />
              </View> */}
              <QuestionMark title="Profile Title" iconColor="#fff" />
              <Text style={styles.infoText2}>
                {user.profile_title_employee}
              </Text>
            </View>
            <View style={styles.infoBox}>
              {/* <View style={styles.iconbox}>
                <Text style={styles.infoTitle}>About Me</Text>
                <FontAwesome
                  name="question-circle"
                  size={16}
                  color="#ffffff"
                  style={{ marginLeft: 5 }}
                />
              </View> */}
              <QuestionMark title="About Me" iconColor="#fff" />
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
              {/* <View style={styles.iconbox}>
                <Text style={styles.infoTitle}>Pomate Services</Text>
                <FontAwesome
                  name="question-circle"
                  size={16}
                  color="#ffffff"
                  style={{ marginLeft: 5 }}
                />
              </View> */}
              <QuestionMark title="Pomate Services" iconColor="#fff" />
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
              contentContainerStyle={styles.promatewrapper}
              showsHorizontalScrollIndicator={false}
            >
              {promote.map((item, index) => (
                <View key={index} style={styles.wrapper}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="logo-android" size={28} color="#000" />
                  </View>
                  <View style={styles.card}>
                    <Text style={styles.title}>{item.subject}</Text>
                    <Text style={styles.price}>{item.hour_minimum} CAD</Text>
                    <Text style={styles.perHour}>/hour</Text>
                    <GradientButton
                      title="View"
                      fontSize={15}
                      paddingVertical={10}
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
              ))}
            </ScrollView>
            <View style={styles.infoBox}>
              {/* <View style={styles.iconbox}>
                <Text style={styles.infoTitle}>Employee Category</Text>
                <FontAwesome
                  name="question-circle"
                  size={16}
                  color="#ffffff"
                  style={{ marginLeft: 5 }}
                />
              </View> */}
              <QuestionMark title="Employee Category" iconColor="#fff" />
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
                onPress={() => {
                  setActiveTab("employee");
                  setCopyText(employeeLink);
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
                  setCopyText(employerLink);
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
            {activeTab === "employee" ? (
              <View style={styles.inputRow}>
                <View style={styles.textWrap}>
                  <Text
                    style={styles.linkText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {copyText}
                  </Text>
                </View>
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
            ) : (
              <View style={styles.inputRow}>
                <View style={styles.textWrap}>
                  <Text
                    style={styles.linkText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {copyText}
                  </Text>
                </View>
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
              <GradientButton
                title="Download Colored Print"
                onPress={() => generateExactUIPDF("color")}
              />
              <BorderButton
                borderColor="#000"
                color="#000"
                fontSize={19}
                title="Download Black & White Print"
                onPress={() => generateExactUIPDF("bw")}
              />
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
          fetchEmployee();
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
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: "#c3c3c3",
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
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  infoText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    width: "78%",
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
  promatewrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    gap: 10,
  },

  iconContainer: {
    position: "absolute",
    top: -15,
    zIndex: 10,
    width: 40,
    height: 40,
    left: 60,
    paddingBottom: 4.2,
    borderRadius: 22.5,
    backgroundColor: "#E7C1AF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3D3D3D",
  },

  card: {
    width: 160,
    paddingTop: 27,
    paddingBottom: 18,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ffffff1a",
  },

  title: {
    color: "#ffffff",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 17,
  },

  price: {
    color: "#25dd4dff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 6,
  },

  perHour: {
    color: "#30D354",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  btn: {
    backgroundColor: "#CC6C52",
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
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
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
});
