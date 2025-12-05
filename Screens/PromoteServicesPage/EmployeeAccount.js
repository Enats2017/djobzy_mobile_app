import React, { useState, useEffect } from "react";
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
import Octicons from "@expo/vector-icons/Octicons";
import Entypo from "@expo/vector-icons/Entypo";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import LineDivider from "../../components/LineDivider";
import Footer from "../../components/Footer";
import GradientButton from "../../components/GradientButton";
import BorderButton from "../../components/BorderButton";
import * as Clipboard from "expo-clipboard";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";

const EmployeeAccount = () => {
  const [copyModel, setCopyModel] = useState(false);
  const [copyText, setCopyText] = useState("");
  const [subcategory, setSubcategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareModel, setShareModel] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [user, setUser] = useState([]);
  const [activeTab, setActiveTab] = useState("employee");
  const navigation = useNavigation();
  const route = useRoute();
  const { name } = route.params || [];
  const insets = useSafeAreaInsets();


  //   function openCopyModel() {
  //   setCopyModel(true);
  // }
  // function closeCopyModel() {
  //   setCopyModel(false);
  // }
  const handleCopy = async () => {
    const link = "https://test.djobzy.com/employee/4545";
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
  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/employee-profile/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setUser(data.editprofile);
       setSubcategory(data.subcategory);
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
  if (loading) return <Loading/>;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <PageNameHeaderBar title="My Account" navigation={navigation} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
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
                <FontAwesome name="share-square-o" size={20} color="#ffffff" />
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
                  <Text style={styles.statValue}>2</Text>
                  <Text style={styles.statLabel}>Number of Jobs</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{user?.money_spent || 0}</Text>
                  <Text style={styles.statLabel}>Money Earned</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>12</Text>
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
            <Text style={styles.infoText2}>{user.profile_title_employee}</Text>
          </View>
          <View style={styles.infoBox}>
            <View style={styles.iconbox}>
              <Text style={styles.infoTitle}>About Me</Text>
              <FontAwesome
                name="question-circle"
                size={16}
                color="#ffffff"
                style={{ marginLeft: 5 }}
              />
            </View>
            <Text style={styles.infoText2}>
              {user?.about}
            </Text>
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
            <View style={styles.iconbox}>
                <Text style={styles.infoTitle}>Employee Category</Text>
                <FontAwesome
                  name="question-circle"
                  size={16}
                  color="#ffffff"
                  style={{ marginLeft: 5 }}
                />
            </View>
          </View>
          <View style={styles.pillsWrapper}>
            <TouchableOpacity style={styles.addBtn} onPress={() => removeCategory(item.subid)}>
              <Ionicons name="add" size={18} color="#000" />
              <Text style={styles.addText}>Add Category</Text>
            </TouchableOpacity>

            {subcategory.map((item) => (
              <View key={item.subid} style={styles.categoryPill}>
                <Text style={styles.categoryText}>{item.subname}</Text>

                <TouchableOpacity onPress={() => removeCategory(item.subid)}>
                  <Ionicons name="close" size={16} color="#fff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <Footer />
      <Modal
        animationType="slide"
        transparent={true}
        visible={copyModel}
        onRequestClose={() => setCopyModel(false)}
      >
        <View style={[styles.modalOverlay]}>
          <View style={[styles.modalContainer,{ paddingBottom: insets.bottom }]}>
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
          <View style={[styles.modalContainer,{ paddingBottom: insets.bottom }]}>
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
    paddingHorizontal: 20,
  },
  profileinfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 60,
    marginRight: 12,
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
    paddingTop: 17,
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

  //Copy Model
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
categoryPill: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#ffffff1a",
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 20,
  marginBottom: 5,         
},
categoryText: {
  color: "#fff",
  fontSize: 14,
},
infoTitle: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},
});
