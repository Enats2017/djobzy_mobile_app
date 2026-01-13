import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SearchedEmployees = ({ data }) => {
  const navigation = useNavigation();
 
  

  return (
    <View>
      <Text style={styles.heading}>Employees</Text>

      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.row}
          onPress={() =>{
              console.log(item);
              navigation.navigate("PublicEmployeeProfile", {
                name: item?.username,
              })

          }
          }
        >
          <Image source={{ uri: item.photo }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sub}>
              ⭐ {item.rating} • {item.location}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SearchedEmployees;

const styles = StyleSheet.create({
  heading: {
    padding: 10,
    fontFamily:"Montserrat_700Bold",
    fontSize:18,
    color: "#fff",
    
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.6,
    borderColor: "#ffffff1a",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderColor:"#fff",
    borderWidth:1,
  },
  name: {
    fontSize: 14,
    color:"#fff",
    fontFamily:"Montserrat_400Regular"
  },
  sub: {
    fontSize: 12,
    color: "#777",
  },
});
