import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from "react-native";
import HeaderBar from "../../components/HeaderBar";
import { API_URL } from "../../api/ApiUrl";
import JobCard from "../EmployeeJobs/JobCard";
import FeedPost from "../SocialMediaPage/FeedPost";
import { ScrollView } from "react-native-gesture-handler";
import LineDivider from "../../components/LineDivider";
import GroupJobPost from "../../assets/images/GroupJobPost.png";
import GroupNext from "../../assets/images/GroupNext.png";
import EmployerCard from "./EmployerCard";
import EmployerFooter from "../../components/EmployerFooter";

const DuplicateEmp = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [employees, setEmployees] = useState([]);
  const [empDashModal, setEmpDashModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState([]);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const hasFetched = useRef(false);
  const [feeds, setFeeds] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const closeModal = () => setEmpDashModal(false);

  const fetchEmployees = useCallback(
    async (pageNum = 1) => {
      try {
        if (loading || isFetchingMore) return;
        if (pageNum === 1) setLoading(true);
        else setIsFetchingMore(true);
        const token = await AsyncStorage.getItem("token");
        console.log(token);
        
        // console.log("📡 Fetching jobs for page:", pageNum);
        const res = await fetch(
          `${API_URL}/employer-dashboard?page=${pageNum}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        const data = await res.json();
        if (!data?.suggested_profiles || data.suggested_profiles.length === 0) {
          setHasMore(false);
          return;
        }
        setEmployees((prev) => {
          if (pageNum === 1) return data.suggested_profiles;
          const newEmployees = data.suggested_profiles.filter(
            (item) => !prev.some((p) => p.id === item.id)
          );

          return [...prev, ...newEmployees];
        });
        setHasMore(data.suggested_profiles.length === 10);
        setPage(pageNum);
      } catch (err) {
        console.log(" Error fetching jobs:", err);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    [loading, isFetchingMore]
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchEmployees(1);
    }
  }, [fetchEmployees]);

  const fetchFeeds = async () => {
    try {
      setFeedLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/feed-post`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setFeeds(data.feeds);
      setUser(data.editprofile);
    } catch (err) {
      console.log(" Feed fetch error:", err);
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab == "feeds") {
      fetchFeeds();
    }
  }, [activeTab]);



  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{ paddingVertical: 10 }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  };

  const renderEmployerCard = ({ item, index }) => {
    const isLastItem = index === employees.length - 1;
    return <EmployerCard item={item} lastItem={isLastItem} />;
  };

  function renderHeader() {
    return (
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
            onPress={() => {
              navigation.navigate("EmployerCategory");
            }}
          >
            <Text style={styles.tabText}>Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.smallTab,
              activeTab === "favourites" && { backgroundColor: "#C96B59" },
            ]}
            onPress={() => navigation.navigate("FavoriteEmployee")}
          >
            <Text style={styles.tabText}>Favourite Employees</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const renderFeedItem = ({ item }) => {
    return (
      <FeedPost
        author={item.full_name}
        subtitle={item.profile_title_employee || item.profile_title_employer}
        time={new Date(item.created_at).toLocaleDateString()}
        text={item.message}
        avatar={{ uri: item.photo }}
        image={item.message_type === 1 ? { uri: item.file_name } : null}
        video={item.message_type === 2 ? item.signed_url : null}
        likes={item.likes_count}
        comments={item.comment_count}
        onPress={() =>
          navigation.navigate("EmployeeAccount", { name: item?.name })
        }
        isCommented={item.is_commented_by_current_user}
      />
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <HeaderBar/>
          {/* <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "feeds" && styles.activeTab]}
              onPress={() => setActiveTab("feeds")}
            >
              <Text
                style={
                  activeTab === "feeds" ? styles.activeTabText : styles.tabText
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
          </View> */}

          {/* Jobs Tab */}
          {activeTab === "jobs" ? (
            loading && page == 1 ? (
              <ActivityIndicator
                size="large"
                color="#fff"
                style={styles.loaderOverlay}
              />
            ) : (
              <FlatList
                data={employees}
                renderItem={renderEmployerCard}
                keyExtractor={(item) => item?.id?.toString()}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                onEndReached={() => {
                  if (
                    !onEndReachedCalledDuringMomentum.current &&
                    hasMore &&
                    !isFetchingMore &&
                    !loading
                  ) {
                    fetchEmployees(page + 1);
                    onEndReachedCalledDuringMomentum.current = true;
                  }
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
              />
            )
          ) : (
            <>
              <ScrollView
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.postcontainer}>
                  <View style={styles.postBox}>
                    <TouchableOpacity
                      style={styles.feed}
                      onPress={() =>
                        navigation.navigate("CreateFeedPost", {
                          name: user?.full_name,
                        })
                      }
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
                        <Entypo
                          name="chevron-small-down"
                          size={20}
                          color="#fff"
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
                {/* <View>
                  {feedLoading ? (
                    <Loading />
                  ) : (
                    <FlatList
                      data={feeds}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={renderFeedItem}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 80 }}
                      scrollEnabled={false}
                    />
                  )}
                </View> */}
              </ScrollView>
            </>
          )}
        </View>
        {/* <Modal
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
                        <Text style={styles.employerColor}>Employer</Text>{" "}
                        Profile
                      </Text>
                    </View>

                    <Text style={styles.modalDescription}>
                      A space for businesses to post jobs, showcase their
                      company, and manage hiring with reviews and ratings.
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
                      Start <Text style={styles.djobzyColor}>Djobzy</Text>{" "}
                      Journey
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
        </Modal> */}
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
  title: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 20,
    color: "#ffffff",
  },
  header: {
    marginTop: 65,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 15,
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
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    justifyContent: "center",
  },

  chip: {
    backgroundColor: "#ffffff1a",
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
    textAlign: "center",
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // tabContainer: {
  //   flexDirection: "row",
  //   borderColor: "#c5c5c591",
  //   borderWidth: 1,
  //   borderRadius: 12,
  //   marginTop: 70,
  // },

  // tab: {
  //   flex: 1,
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   paddingVertical: 14,
  // },
  // tabText: {
  //   color: "#c3c3c3c3",
  //   fontSize: 16,
  //   fontFamily: "Montserrat_500Medium",
  // },

  // activeTab: {
  //   backgroundColor: "#C96B59",
  //   padding: 10,
  //   outlineColor: "#C96B59",
  //   outlineWidth: 1,
  //   borderRadius: 10,
  // },
  // activeTabText: {
  //   color: "#ffff",
  //   fontFamily: "Montserrat_600SemiBold",
  //   fontSize: 16,
  // },
  postcontainer: {
    backgroundColor: "#FFFFFF1a",
    marginTop: 25,
    borderRadius: 10,
    marginBottom: 25,
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 45,
    paddingRight: 15,
  },
  popup: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    elevation: 7,
  },

  text: {
    fontSize: 15,
    color: "#000",
  },
});

export default DuplicateEmp;
