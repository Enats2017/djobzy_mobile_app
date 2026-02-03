import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, fontScale } from "../../utils/scale";
import { SafeAreaView } from "react-native-safe-area-context";

const SecondPage = ({ onNext }) => {
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      {/* Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/images/Group1.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      {/* Text */}
      <View style={styles.textWrapper}>
        <Text style={styles.heading}>
          Gateway to {"\n"}
          <Text style={styles.blodtext}> Services, Careers & Success</Text> 
        </Text>


        <Text style={styles.subtext}>
          Join a vibrant network of employers, and service seekers.
        </Text>
      </View>

      {/* Button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={onNext}
        >
          <Ionicons
            name="arrow-forward"
            size={fontScale(22)}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#DD9D24"
    
  },

  imageWrapper: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop:scale(20),
  },

  image: {
    width: "80%",
    height: "80%",
  },

  /* TEXT SECTION */
  textWrapper: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(20),
  },

  heading: {
    fontSize: fontScale(36),
    textAlign: "center",
    color: "#fff",
    fontFamily: "Montserrat_300Regular",
  },

  subtext: {
    fontSize: fontScale(18),
    textAlign: "center",
    fontFamily:"Montserrat_300Regular",
    color: "#f5f5f5",
    lineHeight: scale(22),
  },
  blodtext:{
    fontFamily:"Montserrat_700Bold",
  },

  /* BUTTON SECTION */
  buttonWrapper: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },

 
});


export default SecondPage;
