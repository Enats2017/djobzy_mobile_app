import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const SecondPage = () => {
  const { width, height } = useWindowDimensions();
  const isSmall = width < 380;
  const isTablet = width > 768;
  const headingSize = isSmall ? 31 : isTablet ? 52 : 45;
  const subtextSize = isSmall ? 14 : isTablet ? 22 : 20;
  const logoWidth = isSmall
    ? width * 0.75
    : isTablet
    ? width * 0.55
    : width * 0.85;
  const marginTop = isSmall ? 11 : isTablet ? 30 : 20;
  const buttonSize = isSmall ? 45 : isTablet ? 70 : 55;
  const iconSize = isSmall ? 18 : isTablet ? 30 : 26;
  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { marginTop }]}>
        <Image
          source={require("../../assets/images/Group1.png")}
          resizeMode="contain"
          style={{ width: logoWidth }}
        />
      </View>
      <Text style={[styles.heading, { fontSize: headingSize, marginTop }]}>
        Gateway to {"\n"} Jobs, Services {"\n"} & Growth
      </Text>
      <Text
        style={[
          styles.subtext,
          { fontSize: subtextSize, marginTop: marginTop / 2 },
        ]}
      >
        Let me Know if You'd like to make it{"\n"} even punchier or more casual!
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            marginTop: marginTop * 1.5,
            width: buttonSize,
            borderRadius: buttonSize / 2,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
        
      >
        <Ionicons name="arrow-forward" size={iconSize} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9af34e8",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontWeight: "bold",
  },
  subtext: {
    textAlign: "center",
    color: "#f5f5f5",
  },
});
export default SecondPage;
