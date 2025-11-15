import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Footer from "../../components/Footer";
import HeaderBar from "../../components/HeaderBar";
import { API_URL } from "../../api/ApiUrl";
import JobCard from "../EmployeeJobs/JobCard";

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

  const fetchJobs = useCallback(async (pageNum = 1) => {
    try {
      if (loading || isFetchingMore) return;
      if (pageNum === 1) setLoading(true);
      else setIsFetchingMore(true);
      const token = await AsyncStorage.getItem("token");
      // console.log("📡 Fetching jobs for page:", pageNum);
      const res = await fetch(`${API_URL}/employee-dashboard?page=${pageNum}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!data?.gigs || data.gigs.length === 0) {
        setHasMore(false);
        return;
      }

      setJobs((prev) => {
        const newGigs = data.gigs.filter(
          (gig) => !prev.some((j) => j.gid === gig.gid)
        );
        return [...prev, ...newGigs];
      });
      setHasMore(data.gigs.length === 10);
      setPage(pageNum);
    } catch (err) {
      console.log("❌ Error fetching jobs:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [loading, isFetchingMore]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchJobs(1);
    }
  }, [fetchJobs]);

  function renderHeader() {
    return (
      <View>
        <Text style={styles.sectionHeader}>My Jobs</Text>
        <View style={styles.chipRow}>
          {["Current jobs", "Received offers", "My biddings"].map((item, index) => (
            <TouchableOpacity
              key={index + 1}
              style={styles.chip}
              onPress={() => {
                navigation.navigate("MyJobPage", { tab: index + 1 });
              } }
            >
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Find Jobs</Text>
        <View style={styles.chipRow}>
          {["Best Matches", "Categories", "Favorite jobs"].map((item, index) => (
            <TouchableOpacity
              key={index + 1}
              style={styles.chip}
              onPress={() => {
                navigation.navigate("MyFindJobs", { tab: index + 1 });
              } }
            >
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
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

  const renderJobCard = ({ item, index }) => {
    const isLastItem = index === jobs.length - 1;
    return <JobCard item={item} lastItem={isLastItem} />
  };

  return (
    <>
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
                onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false; }}
                onEndReached={() => {
                  if (!onEndReachedCalledDuringMomentum.current && hasMore && !isFetchingMore && !loading) {
                    fetchJobs(page + 1);
                    onEndReachedCalledDuringMomentum.current = true;
                  }
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
              />
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
        </View>

        <Footer />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: "space-between"
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
