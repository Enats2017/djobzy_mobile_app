// 1. Update AppUpdateModal to have no "Maybe later" and custom message
// 2. Wire correctly in HomeScreen

// ─── AppUpdateModal.js — update these two things ──────────────────
// Remove onLater prop entirely, hardcode the message, add storeUrl prop

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Linking,
} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetIndicator from "./BottomSheetIndicator";
import GradientButton from "./GradientButton";

const AppNewVersionUpdateModal = ({ visible, data }) => {
  const insets = useSafeAreaInsets();

  const handleUpdate = () => {
    Linking.openURL(data.storeUrl);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => { }} // blocks back button — intentional
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <BottomSheetIndicator />
          <View style={styles.logoWrap}>
            <Image
              source={require("../assets/images/logo-landing-bk.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.versionRow}>
            <View style={styles.versionPillOld}>
              <Text style={styles.versionPillOldText}>v{data.currentVersion}</Text>
            </View>
            <Text style={styles.arrow}>
              <Feather name="arrow-right" size={20} color="#D17B68" />
            </Text>
            <View style={styles.versionPillNew}>
              <Text style={styles.versionPillNewText}>v{data.latestVersion}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.message}>{data.message}</Text>

          <View style={styles.updateBtn}>
            <GradientButton title="Update Now" onPress={handleUpdate} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: "center",
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#f9ede9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f0d8d2",
  },
  logo: {
    width: 55,
    height: 55,
  },
  title: {
    fontSize: 22,
    fontFamily: "Montserrat_700Bold",
    color: "#1a1a1a",
    marginBottom: 14,
    textAlign: "center",
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 15,
  },
  versionPillOld: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  versionPillOldText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'Montserrat_500Medium',
  },
  versionPillNew: {
    backgroundColor: '#D17B68',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  versionPillNewText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Montserrat_700Bold",
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#EEF0F4',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#303030",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  updateBtn: {
    width: "100%",
  },
});

export default AppNewVersionUpdateModal;