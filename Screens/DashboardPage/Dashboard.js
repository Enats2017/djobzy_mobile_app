import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { Feather, FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Footer from "../../components/Footer";
import HeaderBar from "../../components/HeaderBar";
import { API_ICON, API_URL } from "../../api/ApiUrl";
import { truncateWords } from "../../api/TruncateWords";

const Dashboard = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const navigation = useNavigation();
  const [switchLoading, setSwitchLoading] = useState(false);
  const [accountType, setAccountType] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  const fetchJobs = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setIsFetchingMore(true);
      const res = await fetch(`${API_URL}/job-search-result?page=${pageNum}`);
      const data = await res.json();
      if (!data?.gigs) {
        setHasMore(false);
        return;
      }
      const newJobs = data.gigs.filter(
        (job) => !jobs.some((j) => j.gid === job.gid)
      );

      if (newJobs.length > 0) {
        setJobs((prev) => [...prev, ...newJobs]);
        setPage(pageNum);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log("Error fetching jobs:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };
  useEffect(() => {
    if (jobs.length === 0) {
      fetchJobs();
    }
  }, []);

  const handleSwitchAccount = async () => {
    setSwitchLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/switch_account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setAccountType(data.account_type);

        if (data.account_type === 0) {
          navigation.replace("dashboard");
        } else if (data.account_type === 2) {
          navigation.replace("Employeer_Dashboard");
        }
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to switch account");
    } finally {
      setSwitchLoading(false);
    }
  };
  const renderJobCard = ({ item }) => {
    const servicesCount = item.gigServices ? item.gigServices.length : 0;
    const maxVisibleServices = 2;

    return (
      <>
        <View style={[styles.jobCard]}>
          <Text style={[styles.uploadTextAbove, { marginBottom: 8 }]}>
            Uploaded at {item.created}
          </Text>
          <View style={styles.userRow}>
            <Image
              source={{
                uri: item.photo || "../assets/images/djobzy-logo.png",
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 3,
                }}
              >
                <Text style={styles.userName}>{item.full_name}</Text>
                <View style={{ flexDirection: "row", marginLeft: 6 }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={12}
                      color="#f5c242"
                    />
                  ))}
                </View>
              </View>
              <View style={styles.paymentRow}>
                <MaterialIcons name="verified" size={16} color="#39A881" />
                <Text style={styles.paymentVerified}>Payment verified</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Feather name="heart" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.jobDesc}>
            {truncateWords(item.description, 20)}
          </Text>

          <View style={styles.skillRow}>
            {servicesCount > 0 ? (
              <>
                {item.gigServices
                  .slice(0, maxVisibleServices)
                  .map((service, index) => (
                    <View key={index}>
                      {/* Icon */}
                      <Image
                        source={{
                          uri: service.sub_services?.parent?.icon
                            ? `${API_ICON}/images/servicephoto/black-icons/${service.sub_services.parent.icon}`
                            : `${API_ICON}/img/car-icon.svg`,
                        }}
                        alt="prfile"
                        style={styles.tagIcon}
                      />
                      <View style={styles.skillTag}>
                        <Text style={styles.skillText}>
                          {service.sub_services.subname || "No Subcategory"}
                        </Text>
                      </View>
                    </View>
                  ))}

                {servicesCount > maxVisibleServices && (
                  <View style={styles.skillTag}>
                    <Text style={styles.skillText}>
                      +{servicesCount - maxVisibleServices} More
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.noData}>No Data Found</Text>
            )}
          </View>
          <View style={styles.jobFooter}>
            <AntDesign
              name="dollar"
              size={16}
              color="#CB7767"
              style={styles.locationIcon}
            />
            <Text style={styles.hourly}>Hourly: </Text>
            <Text style={styles.hourlyRange}>{item.hour_minimum}</Text>
            <View style={styles.locationRow}>
              {item.preferred_location && (
                <>
                  <Feather
                    name="map-pin"
                    size={16}
                    color="#eb8676"
                    style={styles.locationIcon}
                  />

                  <Text style={styles.locationText}>
                    {item.preferred_location}
                  </Text>
                </>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              navigation.navigate("JobProfile", { gid: item.request_slug })
            }
          >
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
          <View style={styles.dividerLine} />
        </View>
      </>
    );
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <HeaderBar />

          <ScrollView
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
          >
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
                style={[styles.tab, activeTab === "jobs" && styles.activeTab]}
                onPress={() => setActiveTab("jobs")}
              >
                <Text
                  style={
                    activeTab === "jobs" ? styles.activeTabText : styles.tabText
                  }
                >
                  Recommended Jobs
                </Text>
              </TouchableOpacity>
            </View>

            {/* Jobs Tab */}
            {activeTab === "jobs" ? (
              loading && page === 1 ? (
                <ActivityIndicator
                  size="large"
                  color="#ffbc6b"
                  style={styles.loaderOverlay}
                />
              ) : (
                <>
                  <View>
                    <Text style={styles.sectionHeader}>My Jobs</Text>
                    <View style={styles.chipRow}>
                      {["Current jobs", "Received offers", "My biddings"].map(
                        (item, index) => (
                          <TouchableOpacity
                            key={index + 1}
                            style={styles.chip}
                            onPress={() => {
                              navigation.navigate("MyJobPage", {
                                tab: index + 1,
                              });
                            }}
                          >
                            <Text style={styles.chipText}>{item}</Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>

                    <Text style={styles.sectionHeader}>Find Jobs</Text>

                    <View style={styles.chipRow}>
                      {["Best Matches", "Categories", "Favorite jobs"].map(
                        (item, index) => (
                          <TouchableOpacity
                            key={index + 1}
                            style={styles.chip}
                            onPress={() => {
                              navigation.navigate("MyFindJobs", {
                                tab: index + 1,
                              });
                            }}
                          >
                            <Text style={styles.chipText}>{item}</Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                    <Text style={styles.sectionHeader}>Jobs</Text>
                  </View>
                  <FlatList
                    data={jobs}
                    renderItem={renderJobCard}
                    keyExtractor={(item) => item.gid.toString()}
                    onEndReached={() => {
                      if (!isFetchingMore && hasMore) fetchJobs(page + 1);
                    }}
                    onEndReachedThreshold={0.5}
                    style={{ paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                  />
                </>
              )
            ) : (
              <View>
                <View style={styles.postBox}>
                  <TouchableOpacity
                    style={styles.feed}
                    onPress={() => navigation.navigate("CreateFeed")}
                  >
                    <Text style={styles.textfeed}>Create Feed/Post</Text>
                    <View style={styles.anylog}>
                      <Text style={{ fontSize: 15 }}>Anyone</Text>
                      <Entypo
                        name="chevron-small-down"
                        size={18}
                        color="#161616ff"
                      />
                    </View>
                  </TouchableOpacity>

                  <TextInput
                    style={styles.input}
                    placeholder="Post Something"
                    placeholderTextColor="#888"
                  />

                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button}>
                      <Icon
                        name="image-outline"
                        size={22}
                        style={styles.iconTag}
                      />
                      <Text style={styles.buttonText}>Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}>
                      <Icon
                        name="videocam-outline"
                        size={22}
                        style={styles.iconTag}
                      />
                      <Text style={styles.buttonText}>Video</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}>
                      <Icon
                        name="sparkles-outline"
                        size={22}
                        style={styles.iconTag}
                      />
                      <Text style={styles.buttonText}>
                        Generate AI {"\n"} Video
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        <Footer />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  // mansi changes

  container: {
    flex: 1,
    backgroundColor: "#222222",
    padding: 12,
  },
  sectionHeader: {
    fontSize: 18,
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",

    marginTop: 15,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },

  chip: {
    backgroundColor: "#ffffff1a",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    borderRadius: 60,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  chipText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  jobCard: {
    marginTop: 20,
  },

  uploadTextAbove: {
    left: 0,
    color: "#b3b3b3",
    fontSize: 11,
    fontFamily: "Montserrat_400Regular",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 12,
  },

  userName: {
    color: "#ffffff",

    fontSize: 15,
    marginRight: 7,
    fontFamily: "Montserrat_500Medium",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  paymentVerified: {
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "bold",
    fontFamily: "Montserrat_400Regular",
  },

  jobTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Montserrat_600SemiBold",
  },

  jobDesc: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Montserrat_400Regular",
    color: "#ffffff",
    lineHeight: 24,
  },

  readMore: {
    color: "#eb8676",
    fontWeight: "600",
  },

  skillRow: {
    flexDirection: "row",

    flexWrap: "wrap",
    alignItems: "center",
  },

  skillTag: {
    backgroundColor: "#ffffff1a",
    borderRadius: 30,
    padding: 11,
    margin: 4,
    marginVertical: 5,
    alignItems: "center",
  },

  skillText: {
    color: "#e3e3e3",
    fontSize: 10,
    fontWeight: "500",
    fontFamily: "Montserrat_500Medium",
    textAlign: "center",
  },

  jobFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
  },

  hourly: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    fontSize: 12,
  },

  hourlyRange: {
    color: "#fff",
    fontWeight: "500",
    marginRight: 12,
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    flex: 1,
  },

  locationIcon: {
    marginRight: 5,
  },

  locationText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
  },

  viewBtn: {
    backgroundColor: "#D17B68",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 13,
  },
  viewBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },

  dividerLine: {
    height: 1,
    backgroundColor: "rgba(200,200,200,0.4)",
    marginHorizontal: 1,
    marginTop: 20,
  },

  // end
  loaderOverlay: {
    justifyContent: "center",
    alignItems: "center",
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

  postBox: {
    backgroundColor: "#f7f7f7",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 12,

    borderRadius: 5,
    elevation: 7,
  },
  input: {
    backgroundColor: "#d4d0d0ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginHorizontal: 12,

    fontSize: 18,
    marginBottom: 10,
  },
  iconTag: {
    padding: 7,

    borderRadius: 10,
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
    color: "#7e7d7dff",
    marginLeft: 5,
    fontWeight: "600",
    fontSize: 18,
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
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Dashboard;
