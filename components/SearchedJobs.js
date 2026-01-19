import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const SearchedJobs = ({ data }) => {
  const navigation = useNavigation();

  const orderedData = [
    ...data.filter(item => item.type === "job"),
    ...data.filter(item => item.type === "service"),
  ];

  return (
    <View>
      {orderedData.map((item, index) => {
        if (item.type === "job") {
          return (
            <TouchableOpacity
              key={`job-${index}`}
              style={styles.row}
              // onPress={() =>
              //   navigation.navigate("JobDetails", {
              //     slug: item.job_url?.split("/").pop(),
              //   })
              // }
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="briefcase-outline" size={16} color="#000" />
              </View>

              <Text style={styles.title}>{item.subject}</Text>
            </TouchableOpacity>
          );
        }

        if (item.type === "service") {
          return (
            <TouchableOpacity
              key={`service-${index}`}
              style={styles.row}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="brush-outline" size={16} color="#000" />
              </View>

              <View style={styles.textWrapper}>
                <Text style={styles.title}>{item.text}</Text>
                <Text style={styles.subTitle}>category</Text>
              </View>
            </TouchableOpacity>
          );
        }

        return null;
      })}
    </View>
  );
};

export default SearchedJobs;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#333",
  },

  iconWrapper: {
    backgroundColor: "#fff",
    width: 36,
    height: 36,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  textWrapper: {
    flexDirection: "column",
  },

  title: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },

  subTitle: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
});
