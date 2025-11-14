import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EmailCheck from "./EmailCheck";
import NewPassword from "./NewPassword";
import Resert from "./Resert";

const PasswordResert = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      <View style={styles.container}>
        {activeTab > 0 && (
          <TouchableOpacity onPress={() => setActiveTab(activeTab - 1)}>
            <Ionicons
              name="arrow-back"
              size={30}
              color="#fff"
              style={{ top: 40, left: -140 }}
            />
            <Text style={{ color: "#fff", top: 15, left: -100, fontSize: 18 }}>
              Back
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.imglogo}>
          <Image
            source={require("../../assets/images/Login-icon.png")}
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
          <EmailCheck email={email} onNext={() => setActiveTab(2)} />
        </View>
        <View style={{ display: activeTab === 2 ? "flex" : "none" }}>
          <NewPassword onNext={() => setActiveTab(3)} />
        </View>
        <View style={{ display: activeTab === 3 ? "flex" : "none" }}>
          <View style={styles.heading}>
            <Text style={styles.title}>Password Reset!</Text>
            <Text style={styles.subtitle}>
              Your password has been successful reset click below to continue
              your access
            </Text>
            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.loginText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
        {activeTab !== 2 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons
              name="arrow-back"
              size={33}
              color="#fff"
              textAlign="center"
            />
            <Text style={styles.backText}>Back to login</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  imglogo: {
    marginTop: 40,
    alignItems: "center",
  },
  logo: {
    top: 35,
  },
  title: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    top: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "#f6f0f0ff",
    textAlign: "center",
    marginHorizontal: 20,
    padding: 10,
    top: 25,
  },
  sub: {
    color: "#ff6666",
    fontSize: 16,
    padding: 15,
    textAlign: "center",
  },
  loginBtn: {
    width: "100%",
    height: 50,
    top: 20,
    backgroundColor: "#f49696eb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  heading: {
    padding: 15,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 19,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    alignItems: "center",
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default PasswordResert;
