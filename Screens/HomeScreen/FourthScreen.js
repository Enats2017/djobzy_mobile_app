import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Responsive helpers
const scale = (size) => (width / 375) * size;

const BUTTON_SIZE = width * 0.41;

const FourthScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Images */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/Group2.png")}
            style={styles.baseImage}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/images/Team work.png")}
            style={styles.overlayImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>Select Your</Text>
          <Text style={styles.bold}>Primary Role</Text>
          <Text style={styles.subheading}>
           switch between your{" "}
            <Text style={styles.boldtext}>Recruiter</Text> and{" "}
            <Text style={styles.boldtext}>Job Seeker</Text> accounts at any time
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: "#39A881" }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Signup")}
          >
            <Image
              source={require("../../assets/images/Group-vector.png")}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={[styles.circleText, { color: "#fff" }]}>
              I'm a Job Seeker{" "}
              <Text style={[styles.descText]}>looking for a job or task</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: "#fff" }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Signup")}
          >
            <Image
              source={require("../../assets/images/Group-icon.png")}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={[styles.circleText, { color: "#111" }]}>
              I'm a Recruiter{"\n"}
              <Text style={[styles.descText, { color: "#111" }]}>
                need a service provider
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FourthScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
    backgroundColor: "#222222",
  },

  imageContainer: {
    width: width * 0.9,
    height: height * 0.39,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  baseImage: {
    position: "absolute",
    top: 25,
    left: 0,
    width: "100%",
  },

  overlayImage: {
    width: "95%",
    height: "95%",
  },

  section: {
    alignItems: "center",
    marginBottom: 12,
    maxWidth: "87%",
  },

  heading: {
    fontSize: scale(36),
    fontFamily: "Montserrat_400Regular",
    color: "#ffffff",
    lineHeight: scale(40),
  },

  bold: {
    fontSize: scale(36),
    fontFamily: "Montserrat_700Bold",
    color: "#ffffff",
  },
  boldtext: {
    fontFamily: "Montserrat_700Bold",
  },

  subheading: {
    fontSize: scale(16),
    fontFamily: "Montserrat_400Regular",
    color: "#ffffff",
    textAlign: "center",
  },

  buttons: {
    flexDirection: width < 360 ? "column" : "row",
    gap: 12,
    alignItems: "center",
    paddingTop: scale(20),
  },

  circleButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    elevation: 4,
  },

  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },

  circleText: {
    fontSize: scale(13),
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },

  descText: {
    fontSize: scale(13),
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    marginTop: 3,
  },
});
