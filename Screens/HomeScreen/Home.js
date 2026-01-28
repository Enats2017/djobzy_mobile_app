import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale } from "../../utils/scale";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.navigate("SliderScreen");
        return;
      }

      const userStr = await AsyncStorage.getItem("user");
      const user = JSON.parse(userStr);
      const { verification_count, admin } = user;

      if (admin == 2) {
        navigation.navigate("EmployerDashboard");
      } else {
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      navigation.reset({
        index: 0,
        routes: [{ name: "SliderScreen" }],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1c1c1c", "#2d2d2d", "#3a3a3a"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Outer Circle */}
          <View style={styles.outerCircle}>
            {/* Middle Circle */}
            <View style={styles.middleCircle}>
              {/* Inner Circle */}
              <View style={styles.innerCircle}>
                {/* Center Logo */}
                <View style={styles.logoWrapper}>
                  <Image
                    source={require("../../assets/images/djobzy-logo.png")}
                    resizeMode="contain"
                    style={styles.logo}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Arrow Button */}
          <TouchableOpacity style={styles.arrowBtn} onPress={checkAuth}>
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
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
  },

  /* BACKGROUND CIRCLES */
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  outerCircle: {
    width: 670,
    height: 670,
    borderRadius: 500,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  middleCircle: {
    width: 435,
    height: 435,
    borderRadius: 400,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  innerCircle: {
    width: 260,
    height: 260,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 135,
    height: 135,
  },

  arrowBtn: {
    position: "absolute",
    bottom: 34,
    width: 56,
    height: 56,
    borderRadius: 40,
    backgroundColor: "#e67c63",
    justifyContent: "center",
    alignItems: "center",
  },
});
