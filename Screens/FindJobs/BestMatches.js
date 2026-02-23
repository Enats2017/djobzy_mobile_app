import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FindEmployees from "./FindEmployees";
import FindJobs from "./FindJobs";
import AdvancedSearch from "../SearchScreen/AdvanceSearch";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DualDropdown from "../../components/DualDropdown";
import { useGlobalSearch } from "../SearchScreen/useGlobalSearch";

const BestMatches = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { searchSort, searchFilter, setSearchSort, setSearchFilter } =
    useGlobalSearch();

  return (
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
            style={[styles.iconCircle, showFilter && styles.iconCircleActive]}
            onPress={() => setShowFilter((prev) => !prev)}
          >
            <FontAwesome6
              name="filter"
              size={18}
              color={showFilter ? "#000" : "#fff"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setShowDropdown((prev) => !prev)}
          >
            <Octicons name="filter" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {showDropdown && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setShowDropdown(false)}
          />

          <View style={styles.dropdownWrapper}>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setSearchSort("Distance");
                  setShowDropdown(false);
                  // navigation.replace("SearchResult");
                }}
              >
                <Text style={styles.dropdownText}>Distance</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setSearchSort("Price");
                  setShowDropdown(false);
                  // navigation.navigate("SearchResult");
                }}
              >
                <Text style={styles.dropdownText}>Price</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.option]}
                onPress={() => {
                  setSearchSort("Date Added");
                  setShowDropdown(false);
                  // navigation.navigate("SearchResult");
                }}
              >
                <Text style={styles.dropdownText}>Date Added</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      {showFilter && <AdvancedSearch />}
      {searchSort && (
        <DualDropdown
          leftLabel={searchSort || "Sort"}
          rightLabel={searchFilter || "Filter"}
          leftOptions={["Distance", "Price", "Date Added"]}
          rightOptions={["Ascending", "Descending"]}
          onLeftSelect={(value) => {
            setSearchSort(value);
          }}
          onRightSelect={(value) => {
            setSearchFilter(value);
          }}
        />
      )}

      {activeTab ? <FindJobs /> : <FindEmployees />}
    </View>
  );
};

const styles = StyleSheet.create({
  bestmatch: {
    flex: 1,
    zIndex: 0,
  },
  matchesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 20,
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
    color: "#c3c3c3",
    fontSize: 14,
    textAlign: "center",
  },
  inactiveText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#c3c3c3",
    fontSize: 14,
    borderColor: "#c3c3c3",
    borderBottomWidth: 1,
    width: "100%",
    paddingBottom: 8,
  },
  activeText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#FFFFFF",
    paddingBottom: 8,
  },
  underline: {
    height: 2,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  scrollView: {
    paddingHorizontal: 1,
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
});

export default BestMatches;
