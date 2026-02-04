import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GradientButton from "../../components/GradientButton";

const NoJobs = () => {
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

      <GradientButton title="View"/>
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
