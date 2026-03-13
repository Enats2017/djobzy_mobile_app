import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EmailCheck from "./EmailCheck";
import NewPassword from "./NewPassword";
import Resert from "./Resert";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../components/GradientButton";

const PasswordResert = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* {activeTab > 0 && (
          <PageNameHeaderBar
            title="Back"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navigation={navigation}
          />
        )} */}
          <View style={styles.mainSection}>
            <View style={styles.imglogo}>
              <Image
                source={require("../../assets/images/d_logo.png")}
                style={styles.logo}
              />
            </View>
            <View style={{ display: activeTab === 0 ? "flex" : "none" }}>
              <Resert
                onNext={(userEmail) => {
                  setEmail(userEmail);
                  setActiveTab(1);
                }}
              />
            </View>
            <View style={{ display: activeTab === 1 ? "flex" : "none" }}>
              <EmailCheck
                email={email}
                onNext={() => setActiveTab(2)}
                onResend={() => {
                  setEmail("");
                  setActiveTab(0); // 👈 GO BACK TO TAB 0
                }}
              />
            </View>
            <View style={{ display: activeTab === 2 ? "flex" : "none" }}>
              <NewPassword onNext={() => setActiveTab(3)} />
            </View>
            <View style={{ display: activeTab === 3 ? "flex" : "none" }}>
              <View style={styles.heading}>
                <Text style={styles.title}>Password Reset!</Text>
                <Text style={styles.subtitle}>
                  Your password has been successful reset,{"\n"} click below to
                  continue your access
                </Text>
                <View style={{ paddingTop: 25 }}>
                  <GradientButton title="Continue" />
                </View>
              </View>
            </View>
            {(activeTab === 1 || activeTab === 3) && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("Login")}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text style={styles.backText}> {activeTab === 3 ? "Return to the login screen" : "Back to login"}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 20,
  },
  logo: { width: 50, height: 50, resizeMode: "contain" },
  mainSection: {
    paddingTop: 40,
    alignItems: "center",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  backText: {
    color: "#fff",
    fontSize: 14,
    alignItems: "center",
    marginLeft: 8,
    fontFamily:"Montserrat_400Regular",
  },
  title: {
    fontSize: 34,
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    lineHeight: "24",
  },
});

export default PasswordResert;
