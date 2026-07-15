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
import Footer from "../../components/Footer";
import HeaderBar from "../../components/HeaderBar";
import { API_URL } from "../../api/ApiUrl";
import JobCard from "../EmployeeJobs/JobCard";
import { ScrollView } from "react-native-gesture-handler";
import Loading from "../../components/Loading";
import LineDivider from "../../components/LineDivider";
import ProfileTutorial from "../../components/ProfileTutorial";
import SocialMediaScreen from "../SocialMediaPage/SocialMediaScreen";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const hasFetched = useRef(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchTimer = useRef(null);
  const [employeeDashModal, setEmployeeDashModal] = useState(false);
  const closeModal = () => setEmployeeDashModal(false);

  const fetchJobs = useCallback(async (pageNum = 1) => {
      try {
        if (loading || isFetchingMore) return;
        if (pageNum === 1) setLoading(true);
        else setIsFetchingMore(true);
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(
          `${API_URL}/employee-dashboard?page=${pageNum}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        const data = await res.json();
        if(data?.skip_tutorial == 0) {
          setEmployeeDashModal(true);
        }
        if (!data?.gigs || data.gigs.length === 0) {
          setHasMore(false);
          return;
        }
        setJobs((prev) => {
          if (pageNum === 1) return data.gigs;
          const newGigs = data.gigs.filter(
            (gig) => !prev.some((j) => j.gid === gig.gid)
          );
          return [...prev, ...newGigs];
        });
        setHasMore(data.gigs.length === 10);
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
      fetchJobs(1);
    }
  }, [fetchJobs]);

  const fetchSuggestions = async (text) => {
    if (text.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const res = await fetch(`${API_URL}/filter-by-keyword`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword: text,
          action: "search_result",
          head: 1,
        }),
      });

      const data = await res.json();
      console.log(data);


    } catch (err) {
      console.log("Suggestion error:", err);
    }
  };

  /* ===================== SUGGESTION CLICK ===================== */
  const handleSuggestionSelect = (item) => {
    setSuggestions([]);

    if (item.type === "service") {
      navigation.navigate("MyFindJobs", {
        keyword: item.title,
      });
    }

    if (item.type === "employee") {
      navigation.navigate("EmployeeAccount", {
        name: item.username,
      });
    }

    if (item.type === "job") {
      navigation.navigate("JobDetails", {
        slug: item.job_slug,
      });
    }
  };

  function renderHeader() {
    return (
      <View>
        <Text style={styles.sectionHeader}>My Jobs</Text>
        <View style={styles.chipRow}>
          {["Current jobs", "Received offers", "My biddings"].map(
            (item, index) => (
              <TouchableOpacity
                key={index + 1}
                style={styles.chip}
                onPress={() => {
                  navigation.navigate("MyJobPage", { tab: index + 1 });
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
                  navigation.navigate("MyFindJobs", { tab: index + 1 });
                }}
              >
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
        <Text style={styles.sectionHeader}>Jobs</Text>
      </View>
    );
  }

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{ paddingVertical: 10 }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  };

  const renderJobCard = useCallback(({ item }) => {
    return <JobCard item={item} navigation={navigation} />;
  }, [navigation, jobs.length]);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <HeaderBar />
          <View style={styles.tabContainer}>
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
          </View>

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
                data={jobs}
                renderItem={renderJobCard}
                keyExtractor={(item) => item.gid.toString()}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
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
                    fetchJobs(page + 1);
                    onEndReachedCalledDuringMomentum.current = true;
                  }
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                ItemSeparatorComponent={() => <LineDivider />}
              />
            )
          ) : (
            <>
              <SocialMediaScreen />
            </>
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={employeeDashModal}
          onRequestClose={closeModal}
        >
          <ProfileTutorial
            role="employee"
            closeModal={closeModal}
            onPrimaryAction={() => {
              closeModal();
              navigation.navigate("PromoteService");
            }}
          />
        </Modal>
        <Footer />
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
  sectionHeader: {
    fontSize: 18,
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 15,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 7,
    justifyContent: "center",
  },

  chip: {
    backgroundColor: "#ffffff1a",
    flex: 1,
    borderRadius: 50,
    padding: 10,
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

  tabContainer: {
    flexDirection: "row",
    borderColor: "#c5c5c591",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 70,
    marginBottom: 10,
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

export default Dashboard;
