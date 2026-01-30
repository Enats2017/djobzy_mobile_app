import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { API_ICON } from "../api/ApiUrl";
import { useGlobalSearch } from "../Screens/SearchScreen/useGlobalSearch";

const SearchedJobs = ({ data }) => {
  const navigation = useNavigation();
  const setKeyword = useGlobalSearch(state => state.setKeyword);

  const orderedData = [
    ...data.filter(item => item.type === "job"),
    ...data.filter(item => item.type === "service"),
  ];

  const handleCategorySearch = (text) => {
    setKeyword(text);
    navigation.navigate("SearchResult")
  }

  return (
    <View>
      {orderedData.map((item, index) => {
        if (item.type === "job") {
          return (
            <TouchableOpacity
              key={`job-${index}`}
              style={styles.row}
              onPress={item.job_url}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="briefcase-outline" size={20} color="#000" />
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
              onPress={() => handleCategorySearch(item.text)}
            >
              <View style={styles.iconWrapper}>
                {
                  item.icon ? (
                    <Image
                      source={{
                        uri: `${API_ICON}/images/servicephoto/png-image/${item.icon}`,
                      }}
                      style={styles.image}
                    />
                  ) : (
                    <MaterialIcons name="category" size={20} color="#000" />
                  )
                }
              </View>

              <View>
                <Text style={styles.name}>{item.text}</Text>
                <Text style={styles.sub}>{item.sub_service ?? 'category'}</Text>
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
    width: 38,
    height: 38,
    borderRadius: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  image: {
    width: 22,
    height: 22,
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
