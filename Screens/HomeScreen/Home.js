import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale } from "../../utils/scale";
import AppNewVersionUpdateModal from "../../components/AppNewVersionUpdateModal";
import useAppVersionCheck from "../../context/useAppVersionCheck";
import { runStorageMigration } from "../../utils/storageMigration";
import { AUTH_ROUTES, resolveLaunchRoute } from "../../utils/session";

const { width } = Dimensions.get("window");
export default function HomeScreen() {
  const navigation = useNavigation();
  const [checking, setChecking] = useState(false);
  const { showUpdate, updateInfo, checkAppVersion, } = useAppVersionCheck();

  // Started on mount rather than on tap so a session left behind by an update
  // or a restored backup is gone before anything can read it.
  const migration = useRef(null);

  useEffect(() => {
    checkAppVersion();
    migration.current = runStorageMigration();
  }, []);

  const checkAuth = async () => {
    if (checking) return;
    setChecking(true);

    try {
      await migration.current;

      const { route } = await resolveLaunchRoute();
      navigation.reset({ index: 0, routes: [{ name: route }] });
    } catch (error) {
      console.log("Auth check failed:", error);
      navigation.reset({
        index: 0,
        routes: [{ name: AUTH_ROUTES.ONBOARDING }],
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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

            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={checkAuth}
              disabled={checking}
            >
              {checking ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="arrow-forward" size={22} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <AppNewVersionUpdateModal
        visible={showUpdate}
        data={updateInfo}
      />
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
    bottom: 15,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 40,
    backgroundColor: "#e67c63",
    justifyContent: "center",
    alignItems: "center",
  },
});
