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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Feather,
  FontAwesome6,
  FontAwesome5,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { API_URL } from "../../api/ApiUrl";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import Identity from "../../components/IdentificationPage";
import IDVerificationUploadScreen from "../GeneralSetting/IDVerificationUploadScreen";
import ContactInfo from "../../components/ContactInfo";
//import GoogleMap from "../../components/GoogleMap";
import GradientButton from "../../components/GradientButton";
import BorderButton from "../../components/BorderButton";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import FilePreview from "../../components/FilePreview";
import {
  toastSuccess,
  toastError,
  toastInfo,
  toastWarning,
} from "../../utils/toast";
import Step3Social from "./Step3Social";
import EmployerFooter from "../../components/EmployerFooter";
import Step4Address from "./Step4Address";
import Step5Identyfication from "./Step5Identyfication";
import Step5Payment from "./Step6Payment";
import Step7Interview from "./Step7Interview";

const EmployeeVerification = () => {
  const [selected, setSelected] = useState([]);
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [postal, setPostal] = useState("");
  const [location, setLocation] = useState("");
  const [admin, setAdmin] = useState(0);

  const fectchVerfication = async () => {
    setLoading(true);
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
    
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    console.log("11111", user);
    setAdmin(user?.admin);
  };
  useEffect(() => {
    loadUser();
    fectchVerfication();
  }, []);

  const isVerified = (step) => {
    return step <= userDetails?.verification_count;
  };

  const isActive = (step) => {
    return step === userDetails?.verification_count + 1;
  };

  const isDisabled = (step) => {
    return step > userDetails?.verification_count + 1;
  };

 const handleStepPress = (step) => {
  setActiveStep(step); 
};

  const goBack = () => {
    setActiveStep(null);
  };
  const goNext = async () => {
  await fectchVerfication(); // re-fetch updated verification_count
  setActiveStep(null); // go back to verification list
};
  const renderStepScreen = () => {
    switch (activeStep) {
      case 3:
        return <Step3Social onNext={goNext} />;
      case 4:
        return <Step4Address onNext={goNext} />;
      case 5:
        return <Step5Identyfication  onNext={goNext} />;
      case 6:
        return <Step5Payment onNext={goNext} />;
      case 7:
        return <Step7Interview onNext={goNext} />;

      default:
        return null;
    }
  };

  const getBoxStyle = (step) => {
    if (isVerified(step)) return styles.verified;
    if (isActive(step)) return styles.active;
    return styles.unverified;
  };

  const getTextStyle = (step) => {
    if (isVerified(step) || isActive(step)) return styles.activeText;
    return styles.disabledText;
  };

  const getIconColor = (step) => {
    if (isVerified(step) || isActive(step)) return "#fff";
    return "#c3c3c3";
  };

  // const pickResume = async () => {
  //   const result = await DocumentPicker.getDocumentAsync({
  //     type: "application/pdf",
  //   });

  //   if (!result.canceled && result.assets?.length > 0) {
  //     setResumeFile(result.assets[0]);
  //   }
  // };

  // const removeResume = () => {
  //   setResumeFile(null);
  // };

  // const submitContactInfo = async () => {
  //   if (!postal || !location) {
  //     alert("Fill the  all Input");
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("postal_code", postal);
  //   formData.append("searchInput", location);
  //   formData.append("images", {
  //     uri: resumeFile.uri,
  //     name: resumeFile.name,
  //     type: "application/pdf",
  //   });
  //   try {
  //     setSubmitting(true);
  //     const token = await AsyncStorage.getItem("token");
  //     const res = await fetch(`${API_URL}/step4-post`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         Accept: "application/json",
  //       },
  //       body: formData,
  //     });

  //     const result = await res.json();

  //     if (result.status == 200) {
  //       alert("Contact info saved successfully");
  //     } else {
  //       alert(result.message || "Something went wrong");
  //     }
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     toastWarning("netweork error")

  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  if (activeStep !== null) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity style={styles.dashboardHeader} onPress={goBack}>
                <View style={styles.arrow}>
                  <Ionicons name="chevron-back" size={30} color="#ffffff" />
                </View>

                <Text style={styles.title}>Verification</Text>
              </TouchableOpacity>

              {renderStepScreen()}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        {admin == 2 ? <EmployerFooter /> : <Footer />}
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PageNameHeaderBar title="Verification Level" navigation={navigation} />
        {loading ? (
          <Loading />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: "95" }}
          >
            <Text style={styles.sectionTitle}>Your Verification Level</Text>
            <Text style={styles.description}>
              Higher verification levels increase your chances of landing jobs,
              improve trust, and enhance your Djobzy experience.
            </Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.box, getBoxStyle(1)]}
                onPress={() => handleStepPress(1)}
                disabled={isDisabled(1)}
              >
                <View style={styles.topRow}>
                  <Text style={[styles.label, getTextStyle(1)]}>Email</Text>
                  <FontAwesome
                    name="envelope"
                    size={18}
                    color={getIconColor(1)}
                  />
                </View>
                <Text style={[styles.number, getTextStyle(1)]}>01</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.box, getBoxStyle(2)]}
                onPress={() => handleStepPress(2)}
                disabled={isDisabled(2)}
              >
                <View style={styles.topRow}>
                  <Text style={[styles.label, getTextStyle(2)]}>
                    Phone Number
                  </Text>
                  <Feather name="phone" size={18} color={getIconColor(2)} />
                </View>
                <Text style={[styles.number, getTextStyle(2)]}>02</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.box, getBoxStyle(3)]}
                onPress={() => handleStepPress(3)}
                //disabled={isDisabled(3)}
              >
                <View style={styles.topRow}>
                  <Text style={[styles.label, getTextStyle(3)]}>
                    Social Media Accounts
                  </Text>
                  <Ionicons
                    name="person-sharp"
                    size={18}
                    color={getIconColor(3)}
                  />
                </View>
                <Text style={[styles.number, getTextStyle(3)]}>03</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.box, getBoxStyle(4)]}
                onPress={() => handleStepPress(4)}
                //disabled={isDisabled(4)}
              >
                <View style={styles.topRow}>
                  <Text style={[styles.label, getTextStyle(4)]}>Address</Text>
                  <FontAwesome6
                    name="book-bookmark"
                    size={18}
                    color={getIconColor(4)}
                  />
                </View>
                <Text style={styles.time}>1-2 min</Text>
                <Text style={[styles.number, getTextStyle(4)]}>04</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.box, getBoxStyle(5)]}
                onPress={() => handleStepPress(5)}
                //disabled={isDisabled(5)}
              >
                <View style={styles.topRow}>
                  <Text style={[styles.label, getTextStyle(5)]}>
                    ID Card & Certificates
                  </Text>
                  <FontAwesome6
                    name="contact-card"
                    size={18}
                    color={getIconColor(5)}
                  />
                </View>
                <Text style={styles.time}>1-2 min</Text>
                <Text style={[styles.number, getTextStyle(5)]}>05</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.box, getBoxStyle(6)]}
                onPress={() => handleStepPress(6)}
               // disabled={isDisabled(6)}
              >
                <View style={styles.topRow}>
                  <Text style={[styles.label, getTextStyle(6)]}>
                    Credit / Debit Card
                  </Text>
                  <FontAwesome
                    name="credit-card-alt"
                    size={18}
                    color={getIconColor(6)}
                  />
                </View>
                <Text style={styles.time}>1-2 min</Text>
                <Text style={[styles.number, getTextStyle(6)]}>06</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.box, getBoxStyle(7)]}
                onPress={() => handleStepPress(7)}
                //disabled={isDisabled(7)}
              >
                <View style={styles.topRow}>
                  <Text style={[styles.label, getTextStyle(7)]}>
                    Interview & Background Check
                  </Text>
                  <FontAwesome5
                    name="users"
                    size={18}
                    color={getIconColor(7)}
                  />
                </View>
                <Text style={styles.time}>1-2 min</Text>
                <Text style={[styles.number, getTextStyle(7)]}>07</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
      {admin == 2 ? <EmployerFooter /> : <Footer />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#222222",
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
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 6,
  },
  description: {
    color: "#c3c3c3c3",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
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
  verified: { backgroundColor: "#46A282" },
  active: { backgroundColor: "#333" },
  unverified: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeText: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
  },
  disabledText: { color: "#9e9e9e" },
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
  //pagename section
  dashboardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 20,
    gap: 10,
  },
  arrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#313131",
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  title: {
    fontSize: 20,

    fontStyle: "DegularDisplay_600SemiBold", // ensure this font is available in your project
    color: "#ffffff",
  },
});

export default EmployeeVerification;
