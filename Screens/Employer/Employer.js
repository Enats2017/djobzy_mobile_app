import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { API_URL , API_ICON} from "../../api/ApiUrl";
import { truncateWords } from "../../api/TruncateWords";
import { SafeAreaView } from "react-native-safe-area-context";


const Employer = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("employees");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // Fetch jobs from API
  const fetchJobs = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setIsFetchingMore(true);
      const res = await fetch(`${API_URL}/job-search-result?page=${pageNum}`);
      const data = await res.json();

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
      console.log("something went wrong", err)
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);
  const Navbar = () => (
    <View style={styles.navbar}>
      <Image
        source={require("../../assets/images/logo-login.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      {!menuVisible && (
        <TouchableOpacity
          style={styles.menuAnchor}
          onPress={() => setMenuVisible(true)}
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      )}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.closetag}
            onPress={() => setMenuVisible(false)}
          >
            <Ionicons name="close" size={34} color="#fff" />
          </TouchableOpacity>

          <View style={styles.menuPanel}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginBtn}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.loginBtn}>SignUP</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log("About Us clicked")}>
              <Text style={styles.menuItem}>About Us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
  const JobPage = () => (
    <View style={{ paddingHorizontal: 10 }}>
      {/* Advanced Search */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => setSearchOpen(!searchOpen)}
      >
        <Text style={styles.searchText}>Advanced Search</Text>
        <Ionicons
          name={searchOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#000"
        />
      </TouchableOpacity>

      {searchOpen && (
        <View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "jobs" && styles.activeTab]}
              onPress={() => setSelectedTab("jobs")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "jobs" && styles.activeTabText,
                ]}
              >
                Find Jobs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === "employees" && styles.activeTab,
              ]}
              onPress={() => setSelectedTab("employees")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "employees" && styles.activeTabText,
                ]}
              >
                Find Employees
              </Text>
            </TouchableOpacity>
          </View>
          {selectedTab === "employees" ? (
            <View style={styles.section}>
              <TextInput
                placeholder="Keyword"
                style={styles.input}
                placeholderTextColor="#888"
              />
              <Text style={styles.label}>Category</Text>
              <View style={styles.row}>
                <TextInput
                  placeholder="Add a category"
                  style={styles.input}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.plus}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Hourly Price</Text>
              <View style={styles.row}>
                <TextInput
                  placeholder="From"
                  style={styles.smallInput}
                  keyboardType="numeric"
                />
                <Text style={styles.toText}>-</Text>
                <TextInput
                  placeholder="To"
                  style={styles.smallInput}
                  keyboardType="numeric"
                />
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <TextInput
                placeholder="Job Title"
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Location"
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Salary Range"
                style={styles.input}
                placeholderTextColor="#888"
              />
            </View>
          )}
        </View>
      )}

      <Text style={styles.heading}>Jobs Near Me</Text>
      <Text style={styles.subheading}>Suggested categories:</Text>
      <Text style={styles.categories}>
        Fashion Design, Web Design, Front End, Back End, Web Development
      </Text>

      <TouchableOpacity style={styles.sortButton}>
        <Text style={styles.sortText}>Sort By</Text>
        <Ionicons name="filter" size={18} color="#000" />
      </TouchableOpacity>
    </View>
  );
  const JobCard = ({ job, navigation }) => {
    const maxVisibleServices = 2;
    const servicesCount = job.gigServices ? job.gigServices.length : 0;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{job.title}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>CAD</Text>
          <Text style={styles.value}>Total Price: {job.fixed_minimum}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>Expected Hour: {job.expected_hour}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hourly Rate:</Text>
          <Text style={styles.value}>{job.hour_minimum}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="people-outline" size={16} color="#ffbc6b" />
          <Text style={styles.value}> Bids: {job.bids}</Text>
        </View>
        {job.isRemoteJob ? (
          <View style={styles.remoteTag}>
            <Ionicons name="earth" size={16} color="#000" />
            <Text style={styles.remoteText}> Remote</Text>
          </View>
        ) : null}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="tomato" />
          <Text style={styles.description}>
            {job.location || "No location specified"}
          </Text>
        </View>
        <View style={styles.tagsContainer}>
          {servicesCount > 0 ? (
            <>
              {job.gigServices.map((service, index) => (
                <View key={index} style={styles.tagWrapper}>
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

                  {/* Show subcategory + category */}
                  <View>
                    <Text style={styles.tag}>
                      {service.sub_services.subname || "No Subcategory"}
                    </Text>
                  </View>
                </View>
              ))}

              {servicesCount > maxVisibleServices && (
                <View style={styles.moreTag}>
                  <Text style={styles.moreText}>
                    +{servicesCount - maxVisibleServices} More
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.noData}>No Data Found</Text>
          )}
        </View>
        <Text style={styles.description}>
          {truncateWords(job.description, 20)}
        </Text>
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Image source={{ uri: job.photo }} style={styles.Profilelogo} />
            <View>
              <Text style={styles.company}>{job.full_name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#ffbc6b" />
                <Text style={styles.rating}>{job.rating}</Text>
                <Ionicons
                  name="shield-checkmark"
                  size={14}
                  color="#2ecc71"
                  style={{ marginLeft: 8 }}
                />
                <Text style={styles.rating}>{job.verification_count}/7</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={() =>
            navigation.navigate("JobProfile", { gid: job.request_slug })
          }
        >
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Navbar />
      <ScrollView style={{ flex: 1 }}>
        <JobPage />
        {loading ? (
          <ActivityIndicator
            size="large"
            color="tomato"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={jobs}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => (
              <JobCard job={item} navigation={navigation} />
            )}
            onEndReached={() => {
              if (hasMore && !isFetchingMore) fetchJobs(page + 1);
            }}
            onEndReachedThreshold={0.5}
            scrollEnabled={false}
            ListFooterComponent={
              isFetchingMore ? (
                <ActivityIndicator size="small" color="gray" />
              ) : null
            }
            ListEmptyComponent={
              !loading ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No jobs found
                </Text>
              ) : null
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    
  },
  logo: {
    width: 110,
    height: 50,
    margin: 10,
  },
  menuAnchor: {
   margin:10
  },
  overlay: {
    flex: 1,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  closetag: {
    position: "absolute",
    top: 50,
    right: 0,
    padding: 6,
    borderRadius: 20,
    zIndex: 100,
  },
  menuItem: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
  },
  loginButton: {
    backgroundColor: "#e67c73",
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: "75%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
  },
  loginBtn: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#1b1b1bff",
    margin: 15,
    borderRadius: 10,
    padding: 15,
  },
  searchText: { fontSize: 16, fontWeight: "600" },
  dropdown: {
    marginHorizontal: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#2ca46c",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    marginTop: 4,
    padding: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    width: "100%",
    height: "45",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#2ca46c",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 8,
    borderRadius: 6,
  },
  plus: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,

    flex: 1,
  },
  toText: {
    marginHorizontal: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 15,
    marginTop: 15,
    paddingVertical: 8,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 15,
    paddingVertical: 8,
  },
  categories: {
    marginHorizontal: 15,
    marginVertical: 8,
    fontSize: 17,
    maxWidth: "80%",
    color: "#444",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 15,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  sortText: { marginRight: 5, fontSize: 15, fontWeight: "600" },
  card: {
    backgroundColor: "#2c2c2c",
    padding: 16,
    borderRadius: 12,
    margin: 12,
    width: "100%",
    maxWidth: "95%",
    alignSelf: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    color: "#ff9c7c",
    fontWeight: "bold",
  },
  value: {
    color: "#fff",
  },
  remoteTag: {
    backgroundColor: "#ffd580",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  remoteText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  location: {
    color: "#fff",
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 9,
    maxWidth: "100%",

    padding: 5,
  },
  tag: {
    backgroundColor: "#444",
    color: "#fff",
    fontSize: 15,
    paddingHorizontal: 7,
    paddingVertical: 9,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  description: {
    color: "#ddd",
    fontSize: 13,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  Profilelogo: {
    width: 50,
    height: 50,
    borderRadius: 22,
    marginRight: 10,
    marginTop: 2,
  },
  company: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 16,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  rating: {
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 5,
  },

  viewText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  locationText: { marginLeft: 4, color: "#fff" },
  viewProfileButton: {
    backgroundColor: "#e67c73",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,

    alignItems: "center",
  },
});
export default Employer;
