import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialIcons,Entypo } from "@expo/vector-icons";
import GroupJobPost from "../../assets/images/GroupJobPost.png";
import GroupNext from "../../assets/images/GroupNext.png";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Employees from "./Employees";
import RecommendedJobs from "./RecommendedJobs";
import HeaderBar from "../../components/HeaderBar";
import { API_ICON, API_URL } from "../../api/ApiUrl";
import FeedPost from "../SocialMediaPage/FeedPost";
import Footer from "../../components/Footer";


export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [employees, setEmployees] = useState([]);
  const [empDashModal, setEmpDashModal] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [liked, setLiked] = useState({});

  const navigation = useNavigation();
  const closeModal = () => setEmpDashModal(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);

      const res = await fetch(`${API_URL}/employer-dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setEmployees(data.suggested_profiles);
    } catch (e) {}
  };

  const toggleLike = async (id) => {
    setLiked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    const token = await AsyncStorage.getItem("token");

    await fetch(`${API_URL}/toggle-favorite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ employee_id: id }),
    }).then((res) => res.json());
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#222222" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: 100 }]}
      >
        <HeaderBar />
        <Employees
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={{ feeds: "Social Feed", jobs: "Employees" }}
        />
        {activeTab === "feeds" && (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.postcontainer}>
              <View style={styles.postBox}>
                <TouchableOpacity
                  style={styles.feed}
                  onPress={() => navigation.navigate("CreateFeedPost")}
                >
                  <Text style={styles.textfeed}>Create Feed/Post</Text>
                  <View style={styles.anylog}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Montserrat_500Medium",
                        color: "#fff",
                      }}
                    >
                      Anyone
                    </Text>
                    <Entypo name="chevron-small-down" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder="Post Something"
                  placeholderTextColor="#888"
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.button}>
                    <Image
                      source={require("../../assets/images/img.png")}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                    <Text style={styles.buttonText}>Image</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button}>
                    <Image
                      source={require("../../assets/images/vedio.png")}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                    <Text style={styles.buttonText}>Video</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button}>
                    <Image
                      source={require("../../assets/images/ai.png")}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                    <Text style={styles.buttonText}>
                      Generate AI {"\n"} Video
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <FeedPost />
              <FeedPost
                author="Aman Yadav"
                subtitle="Full stack developer & UX audit"
                time="18 Aug, 12 am"
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.."
                avatar={require("../../assets/images/social-img1.png")}
                image={require("../../assets/images/image1818.png")}
                likesNumber={5500}
                commentsNumber={1300}
                savesNumber={2100}
              />
            </View>
          </ScrollView>
        )}
        {activeTab === "categories" && <RecommendedJobs />}
        {activeTab === "favourites" && (
          <View style={{ marginTop: 10 }}>
            {employees
              .filter((emp) => liked[emp.id])
              .map((emp) => (
                <View style={styles.employeeCard} key={emp.id}>
                  <View style={styles.cardHeader}>
                    <Image
                      source={{
                        uri:
                          emp?.photo ||
                          "https://dummyimage.com/120x120/aaa/fff&text=NA",
                      }}
                      style={styles.avatar}
                    />

                    <View style={styles.infoWrapper}>
                      <View
                        style={[
                          styles.nameStarRow,
                          { justifyContent: "flex-start" },
                        ]}
                      >
                        <Text style={styles.name}>
                          {emp?.name || emp?.full_name || "No Name"}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 6,
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesome
                              key={star}
                              name={emp.avg_rating >= star ? "star" : "star-o"}
                              size={14}
                              color="#EBBE56"
                              style={{ marginRight: 2 }}
                            />
                          ))}
                        </View>
                      </View>

                      <View style={styles.verification}>
                        <MaterialIcons
                          name="verified"
                          size={16}
                          color="#c3c3c3"
                        />
                        <Text style={styles.verificationText}>
                          Verification Level: {emp?.verification_count || 0}/7
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleLike(emp.id)}
                      style={styles.heartTouchable}
                    >
                      <FontAwesome
                        name={liked[emp.id] ? "heart" : "heart-o"}
                        size={20}
                        color={liked[emp.id] ? "#ff0000" : "#c3c3c3"}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.skills}>
                    {emp?.seller_services_for_search?.map((item, i) => (
                      <View style={styles.skill} key={i}>
                        <Text style={styles.skillText}>
                          {item?.sub_services?.subname || "Skill"}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.profileBtn}
                    onPress={() =>
                      navigation.navigate("EmployerProfilePage", {
                        name: emp.name,
                      })
                    }
                  >
                    <Text style={styles.profileBtnText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              ))}

            {employees.filter((e) => liked[e.id]).length === 0 && (
              <Text style={{ color: "#fff", marginTop: 20 }}>
                No favourite employees yet.
              </Text>
            )}
          </View>
        )}

        {activeTab === "jobs" && (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Find Employees</Text>
            </View>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[
                  styles.smallTab,
                  activeTab === "categories" && { backgroundColor: "#C96B59" },
                ]}
                onPress={() => setActiveTab("categories")}
              >
                <Text style={styles.tabText}>Categories</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.smallTab,
                  activeTab === "favourites" && { backgroundColor: "#C96B59" },
                ]}
                onPress={() => setActiveTab("favourites")}
              >
                <Text style={styles.tabText}>Favourite Employees</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>
              {employees.map((emp, index) => (
                <View style={styles.employeeCard} key={index}>
                  <View style={styles.cardHeader}>
                    <Image
                      source={{
                        uri: "https://randomuser.me/api/portraits/women/44.jpg",
                      }}
                      style={styles.avatar}
                    />

                    <View style={styles.infoWrapper}>
                      <View
                        style={[
                          styles.nameStarRow,
                          { justifyContent: "flex-start" },
                        ]}
                      >
                        <Text style={styles.name}>
                          {emp?.name || emp?.full_name || "No Name"}
                        </Text>

                        <View
                          style={[
                            styles.nameStarRow,
                            { justifyContent: "flex-start" },
                          ]}
                        >
                          <Text style={styles.name}>
                            {emp?.name || emp?.full_name || "No Name"}
                          </Text>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginLeft: 6,
                            }}
                          >
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FontAwesome
                                key={star}
                                name={
                                  emp.avg_rating >= star ? "star" : "star-o"
                                }
                                size={14}
                                color="#EBBE56"
                                style={{ marginRight: 2 }}
                              />
                            ))}
                          </View>
                        </View>
                      </View>

                      <View style={styles.verification}>
                        <MaterialIcons
                          name="verified"
                          size={16}
                          color="#c3c3c3"
                        />
                        <Text style={styles.verificationText}>
                          Verification Level: {emp?.verification_count || 0}/7
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        toggleLike(emp.id);
                      }}
                      style={styles.heartTouchable}
                    >
                      <FontAwesome
                        name={liked[emp.id] ? "heart" : "heart-o"}
                        size={20}
                        color={liked[emp.id] ? "#ff0000" : "#c3c3c3"}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.skills}>
                    {(emp?.seller_services_for_search || []).map(
                      (service, i) => (
                        <View style={styles.skill} key={i}>
                          <Text style={styles.skillText}>
                            {service?.sub_services?.ss_service_name ||
                              service?.titles ||
                              "Account"}
                          </Text>
                        </View>
                      )
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.profileBtn}
                    onPress={() =>
                      navigation.navigate("EmployerProfilePage", {
                        name: emp.name,
                      })
                    }
                  >
                    <Text style={styles.profileBtnText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={empDashModal}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <View
              style={[
                styles.modalContent,
                { flex: 1, justifyContent: "center" },
              ]}
            >
              {currentSlide === 1 ? (
                <>
                  <Image
                    source={GroupNext}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />

                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitleLine}>Welcome to your</Text>
                    <Text style={styles.modalTitleLine}>
                      <Text style={styles.employerColor}>Employer</Text> Profile
                    </Text>
                  </View>

                  <Text style={styles.modalDescription}>
                    A space for businesses to post jobs, showcase their company,
                    and manage hiring with reviews and ratings.
                  </Text>

                  <TouchableOpacity
                    style={styles.yellowButton}
                    onPress={() => setCurrentSlide(2)}
                  >
                    <Text style={styles.yellowButtonText}>Next</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Image
                    source={GroupJobPost}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />

                  <Text style={styles.modalTitle}>
                    Start <Text style={styles.djobzyColor}>Djobzy</Text> Journey
                  </Text>

                  <View style={styles.modalDescriptionContainer}>
                    <Text style={styles.modalDescriptionLine}>
                      In order to get things done, create
                    </Text>
                    <Text style={styles.modalDescriptionLine}>
                      your first job post
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.yellowButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.yellowButtonText}>
                      Create a Job Post
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.slideIndicatorRow}>
                <View
                  style={[
                    styles.slideDot,
                    currentSlide === 1
                      ? styles.slideDotActive
                      : styles.slideDotInactive,
                  ]}
                />
                <View
                  style={[
                    styles.slideDot,
                    currentSlide === 2
                      ? styles.slideDotActive
                      : styles.slideDotInactive,
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Footer/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    backgroundColor: "#1e1e1e",
  },
  header: {
    marginTop: 20,
    marginBottom: 8,
  },
  title: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 20,
    color: "#ffffff",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 18,
  },
  smallTab: {
    backgroundColor: "#565656",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  tabText: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
  cardContainer: {},
  employeeCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF33",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  nameStarRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  name: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    fontSize: 16,
    marginRight: 6,
    flexShrink: 1,
  },
  starContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  verification: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  verificationText: {
    color: "#c3c3c3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginLeft: 3,
  },
  heartTouchable: {
    padding: 6,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  skill: {
    backgroundColor: "#565656",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 4,
    marginBottom: 6,
  },
  skillText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  profileBtn: {
    backgroundColor: "#D17B68",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  profileBtnText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ffffff33",
    marginVertical: 15,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(34,34,34,0.33)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalCard: {
    width: "100%",
    height: 480,
    backgroundColor: "#fffcfa",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 38,
    paddingHorizontal: 16,
    alignItems: "center",
    elevation: 10,
    marginBottom: 0,
  },
  modalContent: {
    alignItems: "center",
    width: "100%",
  },
  modalImage: {
    height: 190,
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 12,
    color: "#303030",
    textAlign: "center",
  },
  employerColor: {
    color: "#EA8E4D",
    fontWeight: "bold",
  },
  djobzyColor: {
    color: "#EA8E4D",
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 20,
  },
  modalDescription: {
    color: "#303030",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  yellowButton: {
    backgroundColor: "#fdbf2d",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 15,
    marginTop: 2,
    elevation: 1,
    shadowColor: "#Fdbf2d",
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  yellowButtonText: {
    color: "#1d1d1d",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  slideIndicatorRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 2,
    gap: 6,
  },
  slideDot: {
    width: 20,
    height: 2,
    borderRadius: 10,
    backgroundColor: "#ffe8b7",
  },
  slideDotActive: {
    backgroundColor: "#000000",
  },
  slideDotInactive: {
    backgroundColor: "#c3c3c3",
  },

  modalTitleContainer: {
    alignItems: "center",
    marginBottom: 12,
  },

  modalTitleLine: {
    fontSize: 22,
    fontFamily: "Montserrat_600SemiBold",
    color: "#303030",
    textAlign: "center",
    lineHeight: 30,
  },

  employerColor: {
    color: "#cb7767",
    fontFamily: "Montserrat_800ExtraBold",
  },

  modalDescriptionContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    paddingHorizontal: 10,
  },

  modalDescriptionLine: {
    color: "#222",
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },

  // social media
  postcontainer: {
    backgroundColor: "#FFFFFF1a",
    marginTop: 25,
    borderRadius: 10,
    marginBottom:25
  },
  postBox: {
    padding: 7,
  },

  input: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 1,
    color: "#FFFFFF",
    borderColor: "#FFFFFF33",
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  logo: {
    height: 21,
    width: 21,
    marginRight: 7,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#c3c3c3c3",
  },
  feed: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 10,
  },
  anylog: {
    flexDirection: "row",
    gap: 3,
  },
  textfeed: {
    fontSize: 22,
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
  },
});
