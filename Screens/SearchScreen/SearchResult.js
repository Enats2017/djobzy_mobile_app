import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Footer from "../../components/Footer";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import FindJobs from "../FindJobs/FindJobs";
import FindEmployees from "../FindJobs/FindEmployees";
import { useNavigation } from "@react-navigation/native";

import AdvanceSearch from "./AdvanceSearch";



const SearchResult = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(true);

  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>

          <PageNameHeaderBar title="Result" navigation={navigation} />
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

          <PageNameHeaderBar title="Result" navigation={navigation}/>
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
                  <TouchableOpacity style={styles.iconCircle}>
                    <Octicons name="filter" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {showFilter && <AdvanceSearch />}

              {activeTab ? <FindJobs /> : <FindEmployees />}
            </View>
          </KeyboardAvoidingView>
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
    borderColor: "#fff",
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
});

export default SearchResult;
