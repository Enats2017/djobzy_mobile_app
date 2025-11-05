import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
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
  View
} from "react-native";

import { API_URL, API_ICON } from "../../api/ApiUrl";
import { truncateWords } from "../../api/TruncateWords";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Employee() {

  const [menuVisible, setMenuVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigation = useNavigation();
  const [maxPrice, setMaxPrice] = useState(6809);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTab, setSelectedTab] = useState("employees");

  const fetchEmployees = async (pageNumber=1) => {
    try {
      if(page===1) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(`${API_URL}/job-result?page=${pageNumber}`);
       if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
     // console.log("Fetched data:", data);
      


      const newEmployees =  Array.isArray(data.gigs) ? data.gigs : [];
      
      const merged = [...employees, ...newEmployees];
      const uniqueEmployees = merged.filter(
        (emp, index, self) => index === self.findIndex((e) => e.id === emp.id)
      );


      setEmployees(uniqueEmployees);
      if(!data.next_page_url) setHasMore(false);
      setLoadingMore(false);
      setLoading(false);
      
      
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
      setLoadingMore(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);
  const handleLoadMore = () => {
    if(hasMore && !loadingMore){
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEmployees(nextPage);
    }
  }

  //  Navbar function (callback inside same file)
  const Navbar = () => (
    <View style={styles.navbar}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo-login.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Menu Icon */}
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={28} color="#fff" margin="10" />
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
        />
        <View style={styles.menu}>
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
      </Modal>
    </View>
  );

  // ✅ Employees Page Content (callback inside same file)
  const EmployeesPage = () => (
    <View style={{ flex: 1 }}>
      {/* Advanced Search */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => setSearchOpen(!searchOpen)}
      >
        <View style={styles.icondtab}>
          <Text style={styles.searchText}>Advanced Search</Text>
          <Ionicons
            name={searchOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#000"
          />
        </View>
        {searchOpen && (
          <View>
            {/* Tabs */}
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

            {/* Conditional Rendering */}
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
                    <Ionicons name="add" size={20} color="black" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Hourly Price</Text>
                <View style={styles.row}>
                  <TextInput
                    style={styles.smallInput}
                    editable={false}
                    value={"0"}
                    placeholder="From"
                  />
                  <Text style={styles.toText}>-</Text>
                  <TextInput
                    style={styles.smallInput}
                    editable={false}
                    value={maxPrice.toString()}
                    placeholder="To"
                  />
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={9999}
                  step={1}
                  minimumTrackTintColor="#D2695D"
                  maximumTrackTintColor="#ccc"
                  thumbTintColor="#D2695D"
                  value={maxPrice}
                  onValueChange={(value) => setMaxPrice(value)}
                />
              </View>
            ) : (
              <View style={styles.section}>
                {/* Jobs Section */}
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
      </TouchableOpacity>

      {/* Dropdown Content */}

      {/* Heading */}
      <Text style={styles.heading}>Employees Near Me</Text>
      <Text style={styles.subheading}>Suggested categories:</Text>

      <Text style={styles.categories}>
        Financial Analysis, Accounting, Finances, Administrative Support, Office
        Management
      </Text>

      {/* Sort Button */}
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.sortText}>Sort By</Text>
        <Ionicons name="filter" size={18} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const EmployeeCard = ({ employee}) => (
    <View style={styles.card}>
      {/* Profile Row */}
      <View style={styles.cardHeader}>
        <Ionicons name="person-circle-outline" size={50} color="#ccc" />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.cardTitle}>{employee. full_name}</Text>
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={16} color="gold" />
            <Text style={styles.ratingText}>{employee.rating}</Text>
            <MaterialCommunityIcons
              name="shield-check"
              size={16}
              color="green"
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.ratingText}>{employee.verification_count}/7</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{truncateWords(employee.about, 15)}</Text>

      {/* Location */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="tomato" />
        <Text style={styles.locationText}>
            {employee.address||"no address"}
        </Text>
      </View>

      {/* Promoted Services */}
      <Text style={styles.sectionTitle}>{employee.promoted}</Text>
      <View style={styles.promotedBox} />

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
    

      {/* View Profile Button */}
      <TouchableOpacity
        style={styles.viewProfileButton}
         onPress={() => {
   
    navigation.navigate("EmployesProfile", { name:employee.name});  
  }}
      >
        <Text style={styles.viewProfileText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
  const EmployeeCard1 = () => (
    <View style={styles.card}>
      {/* Profile Row */}
      <View style={styles.cardHeader}>
        <Ionicons name="person-circle-outline" size={50} color="#ccc" />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.cardTitle}>Everest...</Text>
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={16} color="gold" />
            <Text style={styles.ratingText}>0/5</Text>
            <MaterialCommunityIcons
              name="shield-check"
              size={16}
              color="green"
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.ratingText}>4/7</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}></Text>

      {/* Location */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="tomato" />
        <Text style={styles.locationText}>
          Chandreah Palces,saint Depot Road, Lakshmiben
        </Text>
      </View>

      {/* Promoted Services */}
      <Text style={styles.sectionTitle}>Promoted Services</Text>
      <View style={styles.promotedBox} />

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoryBox}>
        <Ionicons name="calculator-outline" size={18} color="#fff" />
        <Text style={styles.categoryText}></Text>
      </View>

      {/* View Profile Button */}
      <TouchableOpacity
        style={styles.viewProfileButton}
        onPress={() => navigation.navigate("EmployesProfile")}
      >
        <Text style={styles.viewProfileText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
  const EmployeeCard2 = () => (
    <View style={styles.card}>
      {/* Profile Row */}
      <View style={styles.cardHeader}>
        <Ionicons name="person-circle-outline" size={50} color="#ccc" />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.cardTitle}>Sneha Go....</Text>
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={16} color="gold" />
            <Text style={styles.ratingText}>5.0/5</Text>
            <MaterialCommunityIcons
              name="shield-check"
              size={16}
              color="green"
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.ratingText}>4/7</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>Fashion Designer</Text>

      {/* Location */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="tomato" />
        <Text style={styles.locationText}>
          Sneha Fargose Designer Studio, saint Depot Road,
        </Text>
      </View>

      {/* Promoted Services */}
      <Text style={styles.sectionTitle}>Promoted Services</Text>
      <View style={styles.promotedBox}>
        <Text style={styles.promoteText}>CAD 16.53</Text>
        <Text style={{ color: "#ffff" }}>/hour{"\n"} Web Developer</Text>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoryBox}>
        <Ionicons name="calculator-outline" size={18} color="#fff" />
        <Text style={styles.categoryText}>Accounting</Text>
      </View>
      <View style={styles.categoryBox}>
        <Ionicons name="calculator-outline" size={18} color="#fff" />
        <Text style={styles.categoryText}>Finances</Text>
      </View>

      {/* View Profile Button */}
      <TouchableOpacity
        style={styles.viewProfileButton}
        onPress={() => navigation.navigate("EmployesProfile")}
      >
        <Text style={styles.viewProfileText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Call Navbar */}
        <Navbar />
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
 
  
  
  <EmployeesPage />

  {/* Employees list */}
  {loading ? (
    <ActivityIndicator size="large" color="#D2695D" />
  ) : (
    <FlatList
      data={employees}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <EmployeeCard employee={item} navigation={navigation} />
      )}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator size="large" color="#D2695D" /> : null
      }
      scrollEnabled={false} // Important: FlatList inside ScrollView
    />
  )}
</ScrollView>
 
     
      
    </SafeAreaView>
  );
}

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
    margin:10
  },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  menu: {
    position: "absolute",
    top: 60,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    width: "100%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItem: { fontSize: 18, marginBottom: 10, color: "white" },
  //lohin page
  loginButton: {
    backgroundColor: "#e67c73", //  Red background
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: "75%",
    borderRadius: 5, // Rounded corners
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    marginVertical: 10,
  },
  loginBtn: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  //Advance serach Css
  searchContainer: {
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(7, 7, 7, 1)",
    margin: 15,
    borderRadius: 10,
    padding: 15,
  },
  icondtab: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    marginHorizontal: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 12,
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#078d4eff",
  },
  tabText: {
    fontSize: 20,
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
    padding: 7,
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
    position: "relative",
  },
  addButton: {
    right: 10,
    marginBottom: 5,
    borderRadius: 6,
    position: "absolute",
  },
  plus: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    paddingVertical: 8,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,

    flex: 1,
  },
  toText: {
    marginHorizontal: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  //emolyes near Me
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginHorizontal: 15,
    marginTop: 15,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 15,
    marginTop: 5,
  },
  categories: {
    marginHorizontal: 15,
    marginVertical: 8,
    fontSize: 15,
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

  // ✅ Card Styles
  card: {
    backgroundColor: "#2b2b2b",
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ratingText: { color: "#fff", marginLeft: 4 },
  description: { color: "#fff", marginTop: 10 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  locationText: { marginLeft: 4, color: "#fff" },
  sectionTitle: {
    marginTop: 12,
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  promotedBox: {
    height: 100,
    backgroundColor: "#444444ff",
    borderRadius: 8,
    marginTop: 6,
    width: "100",
  },
  promoteText: {
    fontSize: 22,
    color: "#rgba(31, 248, 12, 1)",
    fontWeight: "bold",
  },
  categoryBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a3a",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  categoryText: { color: "#fff", marginLeft: 8 },
  viewProfileButton: {
    backgroundColor: "#e67c73",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  viewProfileText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 10,
  },
});
