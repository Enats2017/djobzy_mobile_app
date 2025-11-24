import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import GroupJobPost from "../../assets/images/GroupJobPost.png";
import GroupNext from "../../assets/images/GroupNext.png";
import Footer from "../../components/Footer";
import HeaderBar from "../../components/HeaderBar";

export default function FindEmployees() {
  const [activeTab, setActiveTab] = useState("employees");
  const [liked1, setLiked1] = useState(false);
  const [liked2, setLiked2] = useState(false);
  const [liked3, setLiked3] = useState(false);
  const [liked4, setLiked4] = useState(true);
  const [empDashModal, setEmpDashModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);

  const closeModal = () => setEmpDashModal(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <HeaderBar />

        {/* Tabs inside scroll */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "feeds" && styles.activeTab]}
            onPress={() => setActiveTab("feeds")}
          >
            <Text
              style={
                activeTab === "feeds"
                  ? styles.activeTabText
                  : styles.tabText
              }
            >
              Social Feed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "employees" && styles.activeTab]}
            onPress={() => setActiveTab("employees")}
          >
            <Text
              style={
                activeTab === "employees" ? styles.activeTabText : styles.tabText
              }
            >
              Recommended Jobs
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Find Employees</Text>
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity
              style={styles.smallTab}
              onPress={() => console.log("Categories pressed")}
            >
              <Text style={styles.tabText}>Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.smallTab}
              onPress={() => console.log("Favourite Employees pressed")}
            >
              <Text style={styles.tabText}>Favourite Employees</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.employeeCard}>
              <View style={styles.cardHeader}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/42.jpg",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.infoWrapper}>
                  <View style={styles.nameStarRow}>
                    <Text style={styles.name}>Ozuka</Text>
                    <View style={styles.starContainer}>
                      {[...Array(4)].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={13}
                          color="#EBBE56"
                        />
                      ))}
                      <FontAwesome
                        name="star-half-full"
                        size={13}
                        color="#EBBE56"
                      />
                    </View>
                  </View>
                  <View style={styles.verification}>
                    <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                    <Text style={styles.verificationText}>
                      Verification Level: 2/7
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setLiked1(!liked1)}
                  style={styles.heartTouchable}
                >
                  <FontAwesome
                    name={liked1 ? "heart" : "heart-o"}
                    size={20}
                    color={liked1 ? "#ff0000" : "#c3c3c3"}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <View style={styles.skills}>
                {[
                  "Full-Stack Web Application Development",
                  "Cloud Infrastructure Management",
                  "Logo",
                  "Website Design",
                  "Mobile Application Design",
                ].map((skill, i) => (
                  <View style={styles.skill} key={i}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.profileBtn}>
                <Text style={styles.profileBtnText}>View Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.employeeCard}>
              <View style={styles.cardHeader}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/9.jpg",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.infoWrapper}>
                  <View style={styles.nameStarRow}>
                    <Text style={styles.name}>
                      Jonathan Alexander Christopher
                    </Text>
                    <View style={styles.starContainer}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={13}
                          color="#EBBE56"
                        />
                      ))}
                    </View>
                  </View>
                  <View style={styles.verification}>
                    <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                    <Text style={styles.verificationText}>
                      Verification Level: 2/7
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setLiked2(!liked2)}
                  style={styles.heartTouchable}
                >
                  <FontAwesome
                    name={liked2 ? "heart" : "heart-o"}
                    size={20}
                    color={liked2 ? "#ff0000" : "#c3c3c3"}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <View style={styles.skills}>
                {[
                  "High-Fidelity Mockup Design",
                  "Database Optimization and API Integration",
                  "Logo",
                  "Website Design",
                  "Mobile Application Design",
                ].map((skill, i) => (
                  <View style={styles.skill} key={i}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.profileBtn}>
                <Text style={styles.profileBtnText}>View Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.employeeCard}>
              <View style={styles.cardHeader}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/4.jpg",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.infoWrapper}>
                  <View style={styles.nameStarRow}>
                    <Text style={styles.name}>David Miller</Text>
                    <View style={styles.starContainer}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={13}
                          color="#EBBE56"
                        />
                      ))}
                    </View>
                  </View>
                  <View style={styles.verification}>
                    <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                    <Text style={styles.verificationText}>
                      Verification Level: 2/7
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setLiked3(!liked3)}
                  style={styles.heartTouchable}
                >
                  <FontAwesome
                    name={liked3 ? "heart" : "heart-o"}
                    size={20}
                    color={liked3 ? "#ff0000" : "#c3c3c3"}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <View style={styles.skills}>
                {[
                  "UI/UX Design",
                  "Advanced UI/UX Wireframing and Animation Design",
                  "Logo",
                  "Scalable Architecture for Enterprise Applications",
                  "Mobile Application Design",
                ].map((skill, i) => (
                  <View style={styles.skill} key={i}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.profileBtn}>
                <Text style={styles.profileBtnText}>View Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.employeeCard}>
              <View style={styles.cardHeader}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/47.jpg",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.infoWrapper}>
                  <View style={styles.nameStarRow}>
                    <Text style={styles.name}>
                      Michael Jordan Michael Jordan Michael Jordan Michael Jordan
                    </Text>
                    <View style={styles.starContainer}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={13}
                          color="#EBBE56"
                        />
                      ))}
                    </View>
                  </View>
                  <View style={styles.verification}>
                    <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                    <Text style={styles.verificationText}>
                      Verification Level: 2/7
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setLiked4(!liked4)}
                  style={styles.heartTouchable}
                >
                  <FontAwesome
                    name={liked4 ? "heart" : "heart-o"}
                    size={20}
                    color={liked4 ? "#ff0000" : "#c3c3c3"}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <View style={styles.skills}>
                {[
                  "UI/UX Design",
                  "Graphic Design",
                  "Logo",
                  "Website Design",
                  "Mobile Application Design",
                ].map((skill, i) => (
                  <View style={styles.skill} key={i}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.profileBtn}>
                <Text style={styles.profileBtnText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <Footer />

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
                    currentSlide === 1 || currentSlide === 2
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
    paddingTop: 20,
    paddingBottom: 100,
  },
  tabContainer: {
    flexDirection: "row",
    borderColor: "#c5c5c591",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 70,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  tabText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  activeTab: {
    backgroundColor: "#C96B59",
    padding: 10,
    outlineColor: "#C96B59",
    outlineWidth: 1,
    borderRadius: 10,
  },

  activeTabText: {
    color: "#ffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
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
  cardContainer: {
  },
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
    gap: 3,
    flexWrap: "wrap",
  },
  verification: {
    flexDirection: "row",
    alignItems: "center",
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
});
