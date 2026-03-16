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
import { LinearGradient } from "expo-linear-gradient";

const SecondPage = ({ onNext }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#F4C366", "#DD9D24"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
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
            <Text style={styles.blodtext}>Services, Careers{"\n"}& Success</Text>
          </Text>
          <Text style={styles.subtext}>
            Join a vibrant network of employers,{"\n"}and service seekers.
          </Text>
        </View>

        {/* Button */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={onNext}
          >
            <Text style={styles.buttonText}>Next</Text>
            <Ionicons
              name="arrow-forward"
              size={fontScale(18)}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DD9D24"

  },

  imageWrapper: {
    flex: 7,
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(20),
  },

  // image: {
  //   width: "100%",
  //   height: "100%",
  // },

  /* TEXT SECTION */
  textWrapper: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(20),
  },

  heading: {
    fontSize: fontScale(35),
    textAlign: "center",
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
    marginTop: scale(15),
  },

  subtext: {
    fontSize: fontScale(16),
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
    color: "#f5f5f5",
    marginTop: scale(10),
  },
  blodtext: {
    fontFamily: "Montserrat_700Bold",
    fontSize: fontScale(35),
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },

  /* BUTTON SECTION */
  buttonWrapper: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: fontScale(16),
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
    color: "#ffffff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5
  },
});


export default SecondPage;
