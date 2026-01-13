import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_ICON } from "../api/ApiUrl";

const SearchedJobs = ({ data }) => {
  const navigation = useNavigation();

  return (
    <View>
      <Text style={styles.heading}>Jobs</Text>

      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.row}
          onPress={() =>
            navigation.navigate("JobDetails", {
              slug: item.job_slug,
            })
          }
        >
         
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SearchedJobs;

const styles = StyleSheet.create({
  heading: {
    padding: 10,
    fontWeight: "600",
    backgroundColor: "#f5f5f5",
  },
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  location: {
    fontSize: 12,
    color: "#777",
  },
    iconimage: {
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 100,
  },
  image: {
    width: 22,
    height: 22,
  },
  
});
