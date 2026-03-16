import { Ionicons } from "@expo/vector-icons";
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

export default function FirstPage({ onNext }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#C96B59", "#D17B68"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        {/* Images */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/Ellipse 1596.png")}
            resizeMode="contain"
            style={styles.bgCircle}
          />

          <Image
            source={require("../../assets/images/Group.png")}
            resizeMode="contain"
            style={styles.mainImage}
          />
        </View>

        {/* Heading */}
        <View style={styles.textWrapper}>
          <Text style={styles.heading}>
            Where{"\n"}
            <Text style={styles.bold}>
              Talent Meets{"\n"} Opportunity
            </Text>
          </Text>

          <Text style={styles.subtext}>
            Welcome to{"\n"}the services marketplace
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={onNext}>
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
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D17B68",
    alignItems: "center",
  },


  logoContainer: {
    flex: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  bgCircle: {
    width: "70%",
    position: "absolute",
    opacity: 0.9,
    left: scale(25),
    bottom: scale(-10),
  },

  mainImage: {
    width: "65%",
    zIndex: 2,
  },

  /* TEXT */
  textWrapper: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(20),
  },

  heading: {
    fontSize: fontScale(35),
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
  },

  bold: {
    fontSize: fontScale(35),
    fontFamily: "Montserrat_700Bold",
    color: "#ffffff",
  },

  subtext: {
    fontSize: fontScale(16),
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
    color: "#ffffff",
    marginTop: scale(12),
  },
  
  /* BUTTON */
  buttonWrapper: {
    flex: 2,
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
