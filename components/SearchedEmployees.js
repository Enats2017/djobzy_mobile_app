import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const SearchedEmployees = ({ data }) => {
  const navigation = useNavigation();

  const orderedData = [
    ...data.filter(item => item.type === "employee"),
    ...data.filter(item => item.type === "service"),
  ];

  return (
    <View>
      {orderedData.map((item, index) => {
        if (item.type === "service") {
          return (
            <TouchableOpacity
              key={`service-${index}`}
              style={styles.row}
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

        if (item.type === "employee") {
          return (
            <TouchableOpacity
              key={`employee-${index}`}
              style={styles.row}
            >
              <Image source={{ uri: item.photo }} style={styles.avatar} />

              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>
                  ⭐ {item.rating ?? "0"}
                  {item.address && (
                    <>
                      {" • "}
                      {item.address}
                    </>
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }

        return null;
      })}
    </View>
  );
};


export default SearchedEmployees;

const styles = StyleSheet.create({
  heading: {
    paddingVertical: 10,
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    color: "#fff",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.6,
    borderColor: "#ffffff1a",
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
