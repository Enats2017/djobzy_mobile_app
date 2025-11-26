import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Text, TextInput , TouchableOpacity} from "react-native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import GradientButton from "../../components/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import BorderButton from "../../components/BorderButton";
import { useNavigation } from "@react-navigation/native";

const AccountSetting = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState("");
  const[name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeEnabled, setCodeEnabled] = useState(false);
  const [password, setPassword] = useState([]);
  const navigation = useNavigation();
  const handleSend = () => {
    if (!email) return;
    setCodeEnabled(true);
    // you can trigger API call here
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {activeTab == 0 && (
            <View style={styles.Section}>
              <PageNameHeaderBar title="Account Setting" navigation={navigation} />
              <View style={styles.header}>
                <Text style={styles.label}>Confirm Password</Text>
                <Text style={styles.info}>
                  Password ensures your account safety. Please don’t share it
                  with anyone.
                </Text>
              </View>
              <View style={styles.passwordsection}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="*********"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>
          )}

          {activeTab == 1 && (
            <View style={styles.Section}>
              <PageNameHeaderBar title="Account" />
              <Text style={styles.label}>Email</Text>
                <View style={styles.emailContainer}>
                    <TextInput
                    style={styles.emailInput}
                    placeholder="info.got@gmail.com"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    />

                    <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSend}
                    >
                    <Ionicons name="paper-plane" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

             
              <TextInput
                style={[
                  styles.codeInput,
                  { backgroundColor: codeEnabled ? "#fff" : "#6b6b6b" },
                ]}
                placeholder="Enter code"
                placeholderTextColor="#c8c8c8"
                value={code}
                onChangeText={setCode}
                editable={codeEnabled}
              /> 
              <View style={styles.namesection}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="info.got"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    />
                    
                    
                </View>  
                <View style={styles.namesection}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="info.got@gmail.coom"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    />
                    
                    
                </View>  
            </View>
          )}
          <View style={styles.button}>
           <GradientButton
                title={activeTab === 0 ? "Continue" : "Save Changes"}
                onPress={() => {
                if (activeTab === 0) {
                    setActiveTab(1);   // move to next tab
                } else {
                    
                    console.log("Save API call here");
                }
                }}
            />
            {activeTab== 1 && (
                <BorderButton title="Close your account"/>

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
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    marginBottom: 5,
  },
  info: {
    color: "#c3c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  passwordsection: {
    paddingTop: 15,
  },
  passwordInput: {
    backgroundColor: "#ffff",
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 10,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap:7, 
    
  },
  emailInput: {
    flex: 1,
    color: "#000",
    paddingHorizontal: 10,
    height: 45,
    borderRadius: 8,
     backgroundColor: "#fff",
    fontFamily: "Montserrat_400Regular"
  },
  sendButton: {
    width: 45,
    height: 44,
    borderRadius: 6,
    backgroundColor: "#29a37d",
    justifyContent: "center",
    alignItems: "center"
  },
  codeInput: {
    marginTop: 12,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 10,
    color: "#000",
    fontFamily: "Montserrat_400Regular"
  },
  namesection:{
    paddingTop:15
  },
  button:{
    paddingTop:20
  }
});

export default AccountSetting;
