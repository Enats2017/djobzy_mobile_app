import React, { useState, useEffect } from "react";
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
import AdvanceSearch from "./AdvanceSearch";
import JobResult from "./JobResult";
import EmployeeResult from "./EmployeeResult";
import { useGlobalSearch } from "./useGlobalSearch";
import EmployerFooter from "../../components/EmployerFooter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DualDropdown from "../../components/DualDropdown";
import FilterDropdown from "../../components/FilterDropdown";

const SearchResult = () => {
  const navigation = useNavigation();
  const {
    keyword,
    userSearchMode,
    searchSort,
    sortOrder,
    searchFilter,
    setSearchSort,
    setSearchFilter,
    setField,
    triggerSearch,
  } = useGlobalSearch();

  const [activeTab, setActiveTab] = useState(userSearchMode === 0);
  const [showFilter, setShowFilter] = useState(false);
  const [admin, setAdmin] = useState(0);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    setAdmin(user?.admin);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar title={keyword || "Result"} navigation={navigation} />

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
                  onPress={() => setActiveTab(true)}
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
                  onPress={() => setActiveTab(false)}
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

                <TouchableOpacity style={styles.iconCircle} onPress={() => setShowFilterDropdown((prev) => !prev)}>
                  <Octicons name="filter" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            {showFilterDropdown && (
              <FilterDropdown
                visible={showFilterDropdown}
                selectedValue={searchSort}
                options={["Distance", "Price", "Date Added"]}
                onClose={() => setShowFilterDropdown(false)}
                onSelect={(value) => {
                  setSearchSort(value);
                  setField("sortBy", value);
                  triggerSearch();
                }}
              />
            )}
            {/* FILTER */}
            {showFilter && <AdvanceSearch onClose={() => setShowFilter(false)} />}

            {searchSort && (
              <DualDropdown
                leftLabel={searchSort || "Sort"}
                rightLabel={searchFilter || "Ascending"}
                leftOptions={["Distance", "Price", "Date Added"]}
                rightOptions={["Ascending", "Descending"]}
                onLeftSelect={(value) => {
                  setSearchSort(value);
                  let mappedSort = "";
                  if (value === "Price") mappedSort = "Price";
                  if (value === "Distance") mappedSort = "Distance";
                  if (value === "Date Added") mappedSort = "Date added";

                  setField("sortBy", mappedSort);
                  triggerSearch();
                }}
                onRightSelect={(value) => {
                  setSearchFilter(value);
                  let order = value === "Ascending" ? "ASC" : "DESC";
                  setField("sortOrder", order);
                  triggerSearch();
                }}
              />
            )}
            {/* CONTENT */}
            {activeTab ? <JobResult showData={showFilter} /> : <EmployeeResult showData={showFilter} />}

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
    position: "relative",
    zIndex: 0,
  },
  matchesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 10,
    overflow: "visible",
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998, 
    elevation: 5,
  },

  dropdownWrapper: {
    position: "absolute",
    top: 45,
    right: 16,
    zIndex: 999,
    elevation: 10,
  },

  dropdownContainer: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 4,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },

  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },

  dropdownText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#000",
  },
  dropdownWrapper: {
    position: "absolute",
    top: 45,
    right: 16,
    zIndex: 9999,
    elevation: 20,
  },
});

export default SearchResult;
