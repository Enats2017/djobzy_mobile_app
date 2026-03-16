import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fontScale, scale } from "../../utils/scale";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const ThirdScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#39A881", "#218E67"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/Group2.png")}
            style={styles.imageTop}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/images/Group3.png")}
            style={styles.imageBottom}
            resizeMode="contain"
          />
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Djobzy</Text>
          <Text style={styles.subtitle}>Get Hired Faster</Text>

          <Text style={styles.description}>
            Connecting ambition{"\n"}to opportunity
          </Text>
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("FourthScreen")}
          >
            <Text style={styles.buttonText}>Get Started</Text>

            <View style={styles.arrowContainer}>
              <Feather name="arrow-right" size={27} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: "#39A881",
  },

  /* IMAGE SECTION */
  logoContainer: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  imageTop: {
    width: "100%",
    position: "relative",
    top: scale(70),
  },

  imageBottom: {
    width: "100%",
    bottom: scale(30),
  },

  /* TEXT */
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(20),
  },

  title: {
    fontFamily: "Montserrat_400Regular",
    fontSize: fontScale(35),
    lineHeight: scale(40),
    color: "#fff",
  },

  subtitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: fontScale(35),
    color: "#fff",
    textAlign: "center",
  },

  description: {
    fontSize: fontScale(16),
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    marginTop: scale(10),
  },

  /* BUTTON */
  buttonContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: scale(10),
    borderRadius: scale(30),
  },

  buttonText: {
    color: "#fff",
    fontSize: fontScale(18),
    fontFamily: "Montserrat_700Bold",
    paddingHorizontal: 17,
  },

  arrowContainer: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: scale(12), // horizontal spacing only (OK)
  },
});

export default ThirdScreen;
