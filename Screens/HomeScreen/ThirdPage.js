import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
 import { useNavigation } from "@react-navigation/native";
const ThirdScreen = () => {
  const { width, height } = useWindowDimensions();
  const isSmall = width < 380;
  const isTablet = width > 768;
  const titleSize = isSmall ? 30 : isTablet ? 52 : 40;
  const subtitleSize = isSmall ? 25 : isTablet ? 48 : 38;
  const descriptionSize = isSmall ? 17 : isTablet ? 20 : 22;
  const buttonPaddingV = isSmall ? 8 : isTablet ? 18 : 10;
  const buttonPaddingH = isSmall ? 27 : isTablet ? 34 : 38;
  const buttonTextSize = isSmall ? 18 : isTablet ? 28 : 24;
  const arrowCircle = isSmall ? 22 : isTablet ? 34 : 28;
  const arrowSize = isSmall ? 14 : isTablet ? 22 : 18;
  const img1Width = isSmall
    ? width * 0.65
    : isTablet
    ? width * 0.65
    : width * 0.9;
  const img2Width = isSmall
    ? width * 0.78
    : isTablet
    ? width * 0.78
    : width * 0.95;
  const marginTop = isSmall ? -10 : isTablet ? 30 : 20;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/Group2.png")}
          style={{ width: img1Width, margin: marginTop }}
          resizeMode="contain"
        />
        <Image
          source={require("../../assets/images/Group3.png")}
          style={{ width: img2Width, marginTop: -130 }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textcontainer}>
        <Text style={[styles.title, { fontSize: titleSize }]}>Djobzy</Text>
        <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>
          Interview Smarter.{"\n"}Get Hired Faster
        </Text>
        <Text style={[styles.description, { fontSize: descriptionSize }]}>
          Join a vibrant network of professionals, employers, and service
          seekers.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              paddingVertical: buttonPaddingV,
              paddingHorizontal: buttonPaddingH,
              borderRadius: buttonTextSize,
            },
          ]}
           onPress={()=>navigation.navigate("FourthScreen")}
        >
          <Text style={[styles.buttonText, { fontSize: buttonTextSize }]}>
            Get Started
          </Text>
          <View
            style={[
              styles.arrowcon,
              {
                width: arrowCircle,
                height: arrowCircle,
                borderRadius: arrowCircle / 2,
                marginRight: -20,
              },
            ]}
          >
            <Text style={[styles.arrow, { fontSize: arrowSize }]}> ➝ </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1abc9c",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  textcontainer: {
    alignItems: "center",
    marginTop: 25,
  },
  title: {
    fontFamily: "Montserrat_400Regular",
    color: "#fff",
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  description: {
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 35,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 10,
  },
  arrowcon: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    color: "#111",
    fontWeight: "600",
  },
});
export default ThirdScreen;
