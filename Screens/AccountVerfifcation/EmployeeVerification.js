import React, { useState, useEffect, memo } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Ionicons,
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
import Step3Social from "./Step3Social";
import EmployerFooter from "../../components/EmployerFooter";
import Step4Address from "./Step4Address";
import Step5Identyfication from "./Step5Identyfication";
import Step6Payment from "./Step6Payment";
import Step7Interview from "./Step7Interview";
import { useNotifications } from "../../context/MessageNotificationContext";

const EmployeeVerification = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const { admin } = useNotifications();

  const fetchVerification = async () => {
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
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, []);

  const currentStep = (userDetails?.verification_count || 0) + 1;

  const getStepState = (step) => {
    if (step < currentStep) return "verified";
    if (step === currentStep) return "active";
    return "locked";
  };

  const isStepEnabled = (step) => step === currentStep;
  const handleStepPress = (step) => {
    if (!isStepEnabled(step)) return;
    setActiveStep(step);
  };

  const goBack = () => {
    setActiveStep(null);
  };

  const goNext = async () => {
    await fetchVerification();
    setActiveStep(null);
  };

  const renderStepScreen = () => {
    switch (activeStep) {
      case 3:
        return <Step3Social onNext={goNext} />;
      case 4:
        return <Step4Address onNext={goNext} />;
      case 5:
        return <Step5Identyfication onNext={goNext} />;
      case 6:
        return <Step6Payment onNext={goNext} />;
      case 7:
        return (
          <Step7Interview
            onNext={goNext}
            interviewRequested={userDetails?.is_interview_requested}
          />
        );
      default:
        return null;
    }
  };

  const StepCard = memo(({ step, label, icon, IconComponent }) => {
    const state = getStepState(step);
    return (
      <TouchableOpacity
        style={[
          styles.box,
          state === "verified"
            ? styles.verified
            : state === "active"
            ? styles.active
            : styles.unverified,
        ]}
        onPress={() => handleStepPress(step)}
        disabled={!isStepEnabled(step)}
        activeOpacity={isStepEnabled(step) ? 0.7 : 1}
      >
        <View style={styles.topRow}>
          <Text
            style={[
              styles.label,
              state === "locked" ? styles.disabledText : styles.activeText,
            ]}
          >
            {label}
          </Text>

          <IconComponent
            name={icon}
            size={18}
            color={state === "locked" ? "#c3c3c3" : "#fff"}
          />
        </View>

        {state !== "verified" && (
          <Text style={styles.time}>1-2 min</Text>
        )}

        <Text
          style={[
            styles.number,
            state === "locked" ? styles.disabledText : styles.activeText,
          ]}
        >
          {String(step).padStart(2, "0")}
        </Text>
      </TouchableOpacity>
    );
  });

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

                <Text style={styles.title}>Verification Level</Text>
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
            contentContainerStyle={{ paddingBottom: 95 }}
          >
            <Text style={styles.sectionTitle}>Your Verification Level</Text>
            <Text style={styles.description}>
              Higher verification levels increase your chances of landing jobs,
              improve trust, and enhance your Djobzy experience.
            </Text>

            <View style={styles.row}>
              <StepCard step={1} label="Email" icon="envelope" IconComponent={FontAwesome} />
              <StepCard step={2} label="Phone Number" icon="phone" IconComponent={Feather} />
            </View>

            <View style={styles.row}>
              <StepCard step={3} label="Social Media Accounts" icon="person-sharp" IconComponent={Ionicons} />
              <StepCard step={4} label="Address" icon="book-bookmark" IconComponent={FontAwesome6} />
            </View>

            <View style={styles.row}>
              <StepCard step={5} label="ID Card & Certificates" icon="contact-card" IconComponent={FontAwesome6} />
              <StepCard step={6} label="Credit / Debit Card" icon="credit-card-alt" IconComponent={FontAwesome} />
            </View>

            <View style={styles.row}>
              <StepCard step={7} label="Interview & Background Check" icon="users" IconComponent={FontAwesome5} />
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
