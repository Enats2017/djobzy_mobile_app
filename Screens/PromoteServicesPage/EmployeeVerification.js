import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { API_URL } from "../../api/ApiUrl";
import Footer from "../../components/Footer";

const EmployeeVerification = () => {
  const [selected, setSelected] = useState([]);
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState([]);
  const fectchVerfication = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/user-verification-step`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setUserDetails(data.userDetails);
      const verificationCount = data.userDetails.verification_count;
      setUserDetails(data.userDetails);
      console.log(verificationCount);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fectchVerfication();
  }, []);

  const isVerified = (step) => {
    return userDetails?.verification_count >= step;
  };

  isVerified(1) ? styles.verified : styles.unverified;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PageNameHeaderBar title="Verification" navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Your Verification Level</Text>
          <Text style={styles.description}>
            Higher Verification levels increase your chances of landing a job or
            finding employees, Showing you higher in search results, Enabling
            you to gain others trust easier, and enhancing your Djobzy
            Experience.
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.box,
                isVerified(1) ? styles.verified : styles.unverified,
              ]}
            >
              <View style={styles.topRow}>
                <Text
                  style={[styles.label, isVerified(1) && styles.activeText]}
                >
                  Email
                </Text>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={isVerified(1) ? "#fff" : "#c3c3c3"}
                />
              </View>
              <Text style={[styles.number, isVerified(1) && styles.activeText]}>
                01
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.box,
                isVerified(2) ? styles.verified : styles.unverified,
              ]}
            >
              <View style={styles.topRow}>
                <Text
                  style={[styles.label, isVerified(1) && styles.activeText]}
                >
                  Phone Number
                </Text>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={isVerified(2) ? "#fff" : "#c3c3c3"}
                />
              </View>
              <Text style={[styles.number, isVerified(1) && styles.activeText]}>
                02
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.box,
                isVerified(3) ? styles.verified : styles.unverified,
              ]}
            >
              <View style={styles.topRow}>
                <Text
                  style={[styles.label, isVerified(1) && styles.activeText]}
                >
                  Social Media Accounts
                </Text>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={isVerified(3) ? "#fff" : "#c3c3c3"}
                />
              </View>
              <Text style={[styles.number, isVerified(1) && styles.activeText]}>
                03
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.box,
                isVerified(4) ? styles.verified : styles.unverified,
              ]}
            >
              <View style={styles.topRow}>
                <Text
                  style={[styles.label, isVerified(1) && styles.activeText]}
                >
                  Address
                </Text>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={isVerified(4) ? "#fff" : "#c3c3c3"}
                />
              </View>
              <Text style={styles.time}>1-2 min</Text>
              <Text style={[styles.number, isVerified(1) && styles.activeText]}>
                04
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.box,
                isVerified(5) ? styles.verified : styles.unverified,
              ]}
            >
              <View style={styles.topRow}>
                <Text
                  style={[styles.label, isVerified(1) && styles.activeText]}
                >
                  ID Card & Certificates
                </Text>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={isVerified(5) ? "#fff" : "#c3c3c3"}
                />
              </View>
              <Text style={styles.time}>1-2 min</Text>
              <Text style={[styles.number, isVerified(1) && styles.activeText]}>
                05
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.box,
                isVerified(6) ? styles.verified : styles.unverified,
              ]}
            >
              <View style={styles.topRow}>
                <Text style={styles.label}>
                  Credit / Debit Card Verification
                </Text>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={isVerified(6) ? "#fff" : "#c3c3c3"}
                />
              </View>
              <Text style={styles.time}>1-2 min</Text>
              <Text style={[styles.number, isVerified(1) && styles.activeText]}>
                06
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.box,
                isVerified(7) ? styles.verified : styles.unverified,
              ]}
            >
              <View style={styles.topRow}>
                <Text style={styles.label}>Interview & Background Check</Text>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={isVerified(7) ? "#fff" : "#c3c3c3"}
                />
              </View>
              <Text style={styles.time}>1-2 min</Text>
              <Text style={[styles.number, isVerified(1) && styles.activeText]}>
                07
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>Address</Text>
            <Text style={styles.description}>
              Please provide your official address. Please submit an official
              bill dated within the past 3 months to verify your address.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Postal code"
              placeholderTextColor="#aaa"
            />
          </View>
        </ScrollView>
      </View>
      <Footer/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    paddingHorizontal: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
      fontFamily:"Montserrat_600SemiBold",
    marginBottom: 6,
  },
  description: {
    color: "#c3c3c3c3",
    fontSize: 14,
    fontFamily:"Montserrat_400Regular",
    lineHeight: 20,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  box: {
    width: "48%",
    height: 90,
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  verified: {
    backgroundColor: "#46A282",
  },
  unverified: {
    backgroundColor: "#565656",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#c3c3c3c3",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    maxWidth: 100,
  },
  time: {
    color: "#A0A0A0",
    fontSize: 12,
    marginTop: 4,
  },
  number: {
    position: "absolute",
    bottom: 8,
    right: 10,
    color: "#c3c3c3c3",
    fontSize: 16,
  },
  timeText: {
    color: "#c3c3c3c3",
    fontSize: 11,
    marginTop: 4,
  },
  addressSection: {
    marginTop: 10,
  },
  addressTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 5,
  },
  addressDesc: {
    color: "#bbb",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#2b2b2b",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
  },
});

export default EmployeeVerification;
