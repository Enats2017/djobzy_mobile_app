import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {

  const navigation = useNavigation();
 const [isLogin, setisLogin] = useState(false);
   useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      setisLogin(token);
    });
  }, []);

  const checkAuth = () => {
    if (isLogin) {
         navigation.navigate("Dashboard");
    } else {
       navigation.navigate("SliderScreen");
     
    }
  };
  const { width, height } = useWindowDimensions();
  const isSmall = width < 380;
  const isTablet = width > 768;
  const isLargePhone = width >= 380 && width < 768;
  const logoSize = isSmall
    ? width * 0.3
    : isTablet
    ? width * 0.18
    : width * 0.36;
  const arrowSize = isSmall
    ? width * 0.15
    : isTablet
    ? width * 0.08
    : width * 0.16;
  const iconSize = isSmall
    ? width * 0.065
    : isTablet
    ? width * 0.05
    : width * 0.075;
  return (
    <LinearGradient
      colors={["#1c1c1c", "#2d2d2d", "#3a3a3a"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.circleLarge,
            {
              width: width * 1.53,
              height: width * 1.53,
              borderRadius: width * 1.5,
            },
          ]}
        />
        <View
          style={[
            styles.circleMedium,
            { width: width * 1, height: width * 1, borderRadius: width * 1.5 },
          ]}
        />
        <View
          style={[
            styles.circleSmall,
            {
              width: width * 0.62,
              height: width * 0.62,
              borderRadius: width * 1.5,
            },
          ]}
        />
        <View
          style={[
            styles.logoContainer,
            {
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize / 2,
              marginTop: height * 0.02,
            },
          ]}
        >
          <Image
             source={require("../../assets/images/djobzy-logo.png")}
               resizeMode="contain"
            style={{ width: "80%", height: "80%" }}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.arrowButton,
            {
              bottom: height * 0.14,
              width: arrowSize,
              height: arrowSize,
              borderRadius: arrowSize / 2,
            },
          ]}
           onPress={checkAuth}
        >
          <Ionicons name="arrow-forward" size={iconSize} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circleLarge: {
    position: "absolute",
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  circleMedium: {
    position: "absolute",
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  circleSmall: {
    position: "absolute",
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButton: {
    position: "absolute",
    backgroundColor: "#d17866",
    alignItems: "center",
    justifyContent: "center",
  },
});
