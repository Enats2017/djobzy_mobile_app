import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function TabsHeader({ activeTab, setActiveTab, tabs = {} }) {
  return (
    <>
  {/* <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "feeds" && styles.activeTab]}
        onPress={() => setActiveTab("feeds")}
      >
        <Text
          style={activeTab === "feeds" ? styles.activeTabText : styles.tabText}
        >
          {tabs.feeds || "Social Feed"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "jobs" && styles.activeTab]}
        onPress={() => setActiveTab("jobs")}
      >
        <Text
          style={activeTab === "jobs" ? styles.activeTabText : styles.tabText}
        >
          {tabs.jobs || "Recommended Jobs"}
        </Text>
      </TouchableOpacity>
    </View>  */}
    
    </>
  );
}

const styles = StyleSheet.create({
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
});
