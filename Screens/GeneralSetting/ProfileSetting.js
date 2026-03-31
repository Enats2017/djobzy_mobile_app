import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import LineDivider from "../../components/LineDivider";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useProfileStore } from "../../components/useProfileStore";
import ServicesCategoryModal from "../../components/ServicesCategoryModal";
import { API_URL, API_ICON } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GradientButton from "../../components/GradientButton";
import EmployerFooter from "../../components/EmployerFooter";
import Footer from "../../components/Footer";
import { Linking } from "react-native";

export default function ProfileSetting() {
  const route = useRoute();
  const { useradmin } = route.params || {};

  const { employeeCategories, employerCategories, setField, setEditType } =
    useProfileStore();
  const navigation = useNavigation();
  const [switchLoading, setSwitchLoading] = useState(false);
  const [adminType, setAdminType] = useState(useradmin || 0);
  const [emp, setemp] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEditEmployer = () => {
    setField(
      "categories",
      employerCategories.map((c) => ({
        subId: c.subid || c.subservice_id,
        name: c.subname || c.name,
      })),
    );
    setEditType(1);
    setModalVisible(true);
  };

  const handleEditEmployee = () => {
    setField(
      "categories",
      employeeCategories.map((c) => ({
        subId: c.subid || c.subservice_id,
        name: c.subname || c.name,
      })),
    );
    setEditType(2);
    setModalVisible(true);
  };
  // const handleEditEmployee = () => {
  //   store.reset();

  //   const mapped = employee.map((item) => ({
  //     serviceId: item.service_id,
  //     subId: item.subid,
  //     name: item.subname,
  //   }));

  //   store.setCategories(mapped);
  //   store.setEditType(2); // 1 = Employee
  //   setModalVisible(true);
  // };

  const changeUserType = async () => {
    try {
      setSwitchLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/change-type`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.status === 200 && data.user) {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        const saved = await AsyncStorage.getItem("user");
        const parsed = JSON.parse(saved);
        console.log("💾 Saved in AsyncStorage:", parsed);
        console.log("💾 Saved admin:", parsed?.admin);

        setAdminType(data.user.admin);
      }
    } catch (error) {
      console.log("Change type error:", error);
    } finally {
      setSwitchLoading(false);
    }
  };

  const removeCategory = (subId) => {
    setemp((prev) => prev.filter((item) => item.subid !== subId));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar title="Profile Setting" navigation={navigation} />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Employer Section */}
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <Text style={styles.heading}>
                Default Categories for Employer's Profile
              </Text>
              <TouchableOpacity onPress={handleEditEmployer}>
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.desc}>
              Please choose the categories that you want to employer people on.
            </Text>
            <View style={styles.categoryContainer}>
              {employerCategories.map((item, index) => (
                <View key={index} style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{item.subname}</Text>
                  <TouchableOpacity>
                    <Ionicons name="close" size={16} color="#000" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          <LineDivider />

          {/* Employee Section */}
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <Text style={styles.heading}>
                Default Categories for Employee's Profile
              </Text>

              <TouchableOpacity onPress={handleEditEmployee}>
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.desc}>
              Please choose the categories that you like to be employed in.
            </Text>

            <View style={styles.categoryContainer}>
              {employeeCategories.map((item, index) => (
                <View key={index} style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{item.subname}</Text>
                  <TouchableOpacity onPress={() => removeCategory(item.subId)}>
                    <Ionicons name="close" size={16} color="#000" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <LineDivider />
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Default Profile</Text>
            <Text style={styles.desc}>
              Your default profile is the one that you use more often. When you
              open Djobzy your default profile will launch first.
            </Text>
            {adminType === 0 ? (
              <>
                <GradientButton title="Employee"
                  onPress={changeUserType}
                  disabled={switchLoading}
                  loading={switchLoading}
                />
                <View style={styles.secondaryBtn}>
                  <Text style={styles.secondaryBtnText}>
                    Change to Employer
                  </Text>
                </View>
              </>
            ) : (
              <>
                <GradientButton title="Employer"
                  onPress={changeUserType}
                  disabled={switchLoading}
                  loading={switchLoading}
                />
                <View style={styles.secondaryBtn}>
                  <Text style={styles.secondaryBtnText}>
                    Change to Employee
                  </Text>
                </View>
              </>
            )}
          </View>
          <Text style={styles.heading}>Linked Accounts</Text>
          <View style={styles.googlesection}>
            <View style={styles.googleRow}>
              <Image
                source={require("../../assets/images/Google.png")}
                style={styles.avatar}
              />
              <Text style={styles.googleText}>Google</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity>
                <Ionicons name="link" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 10 }}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.terms}>
              You agree to our{" "}
              <Text
                style={styles.linkText}
                onPress={() =>
                  Linking.openURL("https://www.djobzy.com/terms-of-use")
                }
              >
                Terms & Conditions and Cookie Policy
              </Text>
              . You may receive SMS notifications from us or Google and can
              opt-out at any time.
            </Text>
          </View>
        </ScrollView>
      </View>
      <ServicesCategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      {useradmin == 2 ? <EmployerFooter /> : <Footer />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  heading: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    width: "85%",
  },
  desc: {
    color: "#c3c3c3",
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
    fontFamily: "Montserrat_400Regular",
  },

  /* Categories Pills */
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDC8B8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryText: {
    color: "#000000",
    marginRight: 6,
    fontFamily: "Montserrat_500Medium",
    fontSize: 11,
  },

  /* Buttons */
  primaryBtn: {
    backgroundColor: "#e5634e",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  secondaryBtn: {
    marginTop: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
  },
  googlesection: {
    backgroundColor: "#ffffff1a",
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
  },

  /* Linked Accounts */
  googleRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  googleText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 10,
    fontFamily: "Montserrat_500Medium",
  },
  linkText: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
    fontFamily: "Montserrat_400Regular",
  },
  terms: {
    color: "#FFFFFF",
    fontFamily: "Montserrat_400Regular",
    marginTop: 5,
  },
  loaderWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
