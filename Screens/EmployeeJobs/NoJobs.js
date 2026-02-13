import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GradientButton from "../../components/GradientButton";
import { useNavigation } from "@react-navigation/native";

const NoJobs = () => {
  const navigation = useNavigation();
  return (
    <>
    <View style={styles.noJobContainer}>
      <Image
        source={require("../../assets/images/Jobs.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.noContractText}>You don't have any contract</Text>
      <View style={{width:"100%"}}>

      <GradientButton title="View" onPress={()=>navigation.navigate("MyFindJobs")}/>
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  noJobContainer: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
  
  },

  noContractText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    paddingVertical: 10,
    fontFamily: "Montserrat_500Medium",
  },


});

export default NoJobs;
