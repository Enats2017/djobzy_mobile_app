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
  Modal
} from "react-native";
import HeaderBar from "../../components/HeaderBar";
import { API_URL } from "../../api/ApiUrl";
import FeedPost from "../SocialMediaPage/FeedComponent/FeedPost";
import { ScrollView } from "react-native-gesture-handler";
import EmployerCard from "./EmployerCard";
import EmployerFooter from "../../components/EmployerFooter";
import { useGlobalSearch } from "../SearchScreen/useGlobalSearch";
import ProfileTutorial from "../../components/ProfileTutorial";
import SocialMediaScreen from "../SocialMediaPage/SocialMediaScreen";

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState("employee");
  const [employees, setEmployees] = useState([]);
  const [empDashModal, setEmpDashModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState([]);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const hasFetched = useRef(false);
  const closeModal = () => setEmpDashModal(false);
  const [refreshing, setRefreshing] = useState(false);

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
          },
        );
        const data = await res.json();
        if (data?.skip_tutorial_popup_employer == 0) {
          setEmpDashModal(true);
        }
        if (!data?.suggested_profiles || data.suggested_profiles.length === 0) {
          setHasMore(false);
          return;
        }
        setEmployees((prev) => {
          if (pageNum === 1) return data.suggested_profiles;
          const newEmployees = data.suggested_profiles.filter(
            (item) => !prev.some((p) => p.id === item.id),
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
    [loading, isFetchingMore],
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchEmployees(1);
    }
  }, [fetchEmployees]);

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    await fetchEmployees(1);
    setRefreshing(false);
  };

  const handleCreateJobNavigation = () => {
    const store = useGlobalSearch.getState();
    store.reset();
    store.clearCategories();
    navigation.navigate("EmployerCategory");
  };

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
            onPress={handleCreateJobNavigation}
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
              style={[styles.tab, activeTab === "employee" && styles.activeTab]}
              onPress={() => setActiveTab("employee")}
            >
              <Text
                style={
                  activeTab === "employee" ? styles.activeTabText : styles.tabText
                }
              >
                Recommended Employee
              </Text>
            </TouchableOpacity>
          </View>

          {/* Jobs Tab */}
          {activeTab === "employee" ? (
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
                refreshing={refreshing}
                onRefresh={onRefresh}
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
          visible={empDashModal}
          onRequestClose={closeModal}
        >
          <ProfileTutorial
            role="employer"
            onClose={closeModal}
            onPrimaryAction={() => {
              closeModal();
              navigation.navigate("CreateJob");
            }}
          />
        </Modal>
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
    marginTop: 15,
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

  // social media
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
    paddingTop: 80,
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
  loaderOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default EmployerDashboard;
