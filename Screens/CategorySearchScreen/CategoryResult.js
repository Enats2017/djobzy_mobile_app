import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Footer from "../../components/Footer";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AdvanceSearch from "../SearchScreen/AdvanceSearch";
import { API_URL } from "../../api/ApiUrl";
import JobResult from "../SearchScreen/JobResult";
import EmployeeCategoryResult from "../SearchScreen/EmployeeCategoryResult";
import { useGlobalSearch } from "../SearchScreen/useGlobalSearch";
import EmployerFooter from "../../components/EmployerFooter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JobCategoryResult from "./JobCategoryResult";
import { useNotifications } from "../../context/MessageNotificationContext";

const CategoryResult = () => {
  const navigation = useNavigation();
  const { categories, userSearchMode, setUserSearchMode, keyword } = useGlobalSearch();
  const selected = categories?.[0];
  const { admin } = useNotifications();
  const requestIdRef = useRef(0);
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState(admin !== 2);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchCategoryData = async (pageNum = 1) => {
    if (!selected) return;
    const currentRequestId = ++requestIdRef.current;
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      const token = await AsyncStorage.getItem("token");
      const jobType = activeTab ? 1 : 2;
      let url = `${API_URL}/category/${selected.slug}?page=${pageNum}&job_type=${jobType}`;
      if (selected.subslug) {
        url = `${API_URL}/category/${selected.slug}/${selected.subslug}?page=${pageNum}&job_type=${jobType}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      let gigsList = [];
      if (jobType === 1) {
        gigsList = Array.isArray(data.gigs)
          ? data.gigs
          : [];
      } else {
        gigsList = Array.isArray(data.gigs?.data)
          ? data.gigs.data
          : [];
      }

      if (pageNum === 1) {
        setJobs(gigsList);
      } else {
        setJobs((prev) => {
          const merged = [...prev];
          gigsList.forEach((item) => {
            const exists = merged.some((p) =>
              jobType === 1
                ? p.gid === item.gid
                : p.id === item.id
            );

            if (!exists) {
              merged.push(item);
            }
          });

          return merged;
        });
      }

      setPage(pageNum);
      setHasMore(gigsList.length === 10);
    } catch (error) {
      console.log("FETCH ERROR:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    if (!selected) return;

    setJobs([]);
    setPage(1);
    setHasMore(true);

    fetchCategoryData(1);
  }, [selected, activeTab]);

  const fetchMore = () => {
    if ( loading || isFetchingMore || !hasMore || jobs.length === 0 ) {
      return;
    }
    fetchCategoryData(page + 1);
  };

  const switchToJobs = () => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
    setActiveTab(true);
  };

  const switchToEmployees = () => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
    setActiveTab(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar
          title={selected?.name || "Result"}
          navigation={navigation}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <View style={styles.bestmatch}>
            <View style={styles.matchesHeader}>
              <View style={styles.toggleWrapper}>
                <TouchableOpacity
                  style={styles.toggleBtn}
                  onPress={switchToJobs}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      activeTab ? styles.activeText : styles.inactiveText,
                    ]}
                  >
                    Find Jobs
                  </Text>
                  {activeTab && <View style={styles.underline} />}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.toggleBtn}
                  onPress={switchToEmployees}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      !activeTab ? styles.activeText : styles.inactiveText,
                    ]}
                  >
                    Find Employees
                  </Text>
                  {!activeTab && <View style={styles.underline} />}
                </TouchableOpacity>
              </View>

              <View style={styles.iconsContainer}>
                <TouchableOpacity
                  style={[
                    styles.iconCircle,
                    showFilter && styles.iconCircleActive,
                  ]}
                  onPress={() => setShowFilter((prev) => !prev)}
                >
                  <FontAwesome6
                    name="filter"
                    size={18}
                    color={showFilter ? "#000" : "#fff"}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconCircle}>
                  <Octicons name="filter" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* FILTER */}
            {showFilter && <AdvanceSearch />}

            {activeTab ? (
              <JobCategoryResult
                gigs={jobs}
                fetchMore={fetchMore}
                isFetchingMore={isFetchingMore}
                hasMore={hasMore}
              />
            ) : (
              <EmployeeCategoryResult
                gigs={jobs}
                fetchMore={fetchMore}
                isFetchingMore={isFetchingMore}
                hasMore={hasMore}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </View>

      {admin == 2 ? <EmployerFooter /> : <Footer />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  bestmatch: {
    flex: 1,
  },
  matchesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 10,
  },
  toggleWrapper: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  iconCircle: {
    backgroundColor: "#424242",
    borderRadius: 100,
    padding: 10,
  },
  iconCircleActive: {
    backgroundColor: "#fff",
  },
  toggleText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
    textAlign: "center",
  },
  inactiveText: {
    color: "#c3c3c3",
    borderBottomWidth: 1,
    borderColor: "#c3c3c3",
    width: "100%",
    paddingBottom: 8,
  },
  activeText: {
    color: "#ffffff",
    paddingBottom: 8,
  },
  underline: {
    height: 2,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
});

export default CategoryResult;
