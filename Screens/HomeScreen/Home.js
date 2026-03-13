import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale } from "../../utils/scale";

const { width } = Dimensions.get("window");
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
      console.log("1111",verification_count);

      if (verification_count >= 2 && admin == 2) {
        navigation.navigate("EmployerDashboard");
      } else if (verification_count >= 2 && admin == 0) {
        navigation.navigate("Dashboard");
      } else {
        navigation.navigate("VerificationPage");
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
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#1c1c1c", "#2d2d2d", "#3a3a3a"]}
        style={styles.gradientContainer}
      >
        <View style={styles.container}>
          <View style={styles.circleBox}>
            <View style={styles.outerCircle}>
              <View style={styles.middleCircle}>
                <View style={styles.innerCircle}>
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

            <TouchableOpacity style={styles.arrowBtn} onPress={checkAuth}>
              <Ionicons name="arrow-forward" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circleBox: {
    width: width * 1.8,
    height: width * 1.8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  outerCircle: {
    width: width * 1.6,
    height: width * 1.6,
    borderRadius: 500,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  middleCircle: {
    width: width * 1.15,
    height: width * 1.15,
    borderRadius: 400,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  innerCircle: {
    width: width * 0.7,
    height: width * 0.7,
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
    bottom: 13,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 40,
    backgroundColor: "#e67c63",
    justifyContent: "center",
    alignItems: "center",
  },
});
