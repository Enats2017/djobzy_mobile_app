import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GradientButton from "../../components/GradientButton";
import { useNavigation } from "@react-navigation/native";

const Resert = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json(); 
      if (response.ok && data.status === true) {
        Alert.alert("Success", data.message);
        onNext(email);
      } else {
        setError(data.message || "No account found with this email address");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.heading}>
        <View style={ styles.section}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the email associated with your account and we’ll send Instructions to reset your password.
          </Text>
        </View>

        <View style={styles.emalInput}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="xyz@gmail.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error && (
              <Feather
                name="alert-circle"
                size={22}
                color="#d81818ff"
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: [{ translateY: -11 }],
                }}
              />
            )}
          </View>
          
          {error ? (
            <Text style={{ color: "#d81818ff", fontSize: 15, padding: 7 }}>
              {error}
            </Text>
          ) : null}

          <GradientButton 
            marginTop={22} 
            title="Send Email"  
            disabled={loading} 
            loading={loading} 
            onPress={handleForgotPassword}
          />
        </View>
        <TouchableOpacity style={styles.remember} onPress={()=>navigation.goBack()}>
          <Text style={styles.rembertext}>Remember Password?{" "}<Text style={{color:"#C96B59"}}>Login</Text></Text>        
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({

  section:{

   alignItems:"center",

  },
  title: {
    fontSize: 35,
    color: "#fff",
   fontFamily:"Montserrat_600SemiBold",
   
    
    top: 25,
    marginBottom:12,
  },
  subtitle: {
    fontSize: 15,
    color: "#fff",
   textAlign:"center",
    fontFamily:"Montserrat_600SemiBold",
    padding: 10,
    lineHeight:"24"
  
  },
  emalInput: {
   
    paddingTop:25
    
  },
  label: {
    color: "#fff",
    fontFamily:"Montserrat_600SemiBold",
    fontSize:16,
    padding:2,  
  },
    passwordContainer: {
    width: "100%",
    height: 48,
    borderRadius: 6,
    paddingHorizontal: 5,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
      flex: 1,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#000",
  },
  remember:{
    alignItems:"center",
    paddingTop:20
  },
    rembertext:{
      fontFamily:"Montserrat_400Regular",
      fontSize:14,
      color:"#fff",
    }
});

export default Resert;
