import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EmailCheck from "./EmailCheck";
import NewPassword from "./NewPassword";
import Resert from "./Resert";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { SafeAreaView } from "react-native-safe-area-context";

const PasswordResert = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);


  return (
    <>
     <SafeAreaView style={{flex:1}}>
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
          <EmailCheck email={email} onNext={() => setActiveTab(2)}  onResend={() => {
      setEmail("");
      setActiveTab(0); // 👈 GO BACK TO TAB 0
    }} />
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
        {activeTab  === 1 && (
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
      </View>
     </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222", 
    paddingHorizontal:20,
  },
  mainSection:{
    paddingTop:40,
    alignItems:"center"
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
