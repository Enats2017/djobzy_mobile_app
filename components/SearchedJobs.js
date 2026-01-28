import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

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
                <MaterialIcons name="category" size={20} color="#000" />
              </View>

              <View>
                <Text style={styles.name}>{item.text}</Text>
                <Text style={styles.sub}>category</Text>
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
    fontSize: 14,
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
  },

  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderColor: "#fff",
    borderWidth: 1,
  },

  name: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
  },

  sub: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
});
