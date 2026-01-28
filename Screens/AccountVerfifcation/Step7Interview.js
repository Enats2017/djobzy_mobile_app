import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import GradientButton from "../../components/GradientButton";

const Step7Interview = () => {
  return (
    <>
      <Text style={styles.setptext}>STEP 7</Text>
      <Text style={styles.headtext}>Interview & Background Check</Text>
      <View>
        <Text style={styles.setptext}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      </View>
      <GradientButton/>
       <TouchableOpacity style={styles.nextBtn}>
              <Text style={styles.nextText}>Finish</Text>
            </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  setptext: {
    color: "#c3c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  headtext: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 5,
  },
    nextBtn: {
    backgroundColor: "#FDBF2D",
    paddingVertical:10,
    borderRadius:10,
    marginTop:35,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText:{
    color:"#000000",
    fontFamily:"Montserrat_700Bold",
    fontSize:20
  }
})
export default Step7Interview;
