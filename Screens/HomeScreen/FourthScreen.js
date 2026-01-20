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

const BUTTON_SIZE = width * 0.45;

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
            You can switch between your Recruiter and Job Seeker accounts at any
            time
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: "#39A881" }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Login")}
          >
            <Image
              source={require("../../assets/images/Group-vector.png")}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={[styles.circleText, { color: "#fff" }]}>
              I'm a Job Seeker
            </Text>
            <Text style={[styles.descText, { color: "#fff" }]}>
              looking for a job
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: "#fff" }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Login")}
          >
            <Image
              source={require("../../assets/images/Group-icon.png")}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={[styles.circleText, { color: "#111" }]}>
              I'm a Recruiter
            </Text>
            <Text style={[styles.descText, { color: "#111" }]}>
              looking for a service
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
    backgroundColor: "#222222",
  },

  scroll: {
    flexShrink: 1,
    flexGrow:1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom:50
   
  },

  imageContainer: {
    width: width * 2.9,
    height: height * 0.39,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

 
  baseImage: {
    position: "absolute",
    top: 25,
    left:0,
    width: "100%",
  },
  
  overlayImage: {
    width: "100%",
    height: "100%",
  },
 

  section: {
    alignItems: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },

  heading: {
    fontSize: scale(36),
    fontFamily: "Montserrat_400Regular",
    color: "#ffffff",
  },

  bold: {
    fontSize: scale(36),
    fontFamily: "Montserrat_700Bold",
    color: "#ffffff",
  },

  subheading: {
    fontSize: scale(16),
    fontFamily: "Montserrat_400Regular",
    color: "#ffffff",
    textAlign: "center",
    
  },

  buttons: {
    flexDirection: width < 360 ? "column" : "row",
    gap: 15,
    alignItems: "center",
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
    marginBottom: 12,
  },

  circleText: {
    fontSize: scale(13),
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },

  descText: {
    fontSize: scale(11),
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    marginTop: 4,
  },
});
