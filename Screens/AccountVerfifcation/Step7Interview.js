import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import GradientButton from "../../components/GradientButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";

const Step7Interview = () => {
  const [loading, setLoading] = useState(false);
  const [isInterviewRequested, setIsInterviewRequested] = useState(0);

  const loadUser = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      console.log("11111", user);
      setIsInterviewRequested(user?.is_interview_requested);
    };
    useEffect(() => {
      loadUser();
    }, []);

  const handleFinish = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const response = await fetch(`${API_URL}/request_interview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    const result = await response.json();
    }catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text style={styles.setptext}>STEP 7</Text>
      <Text style={styles.headtext}>Interview & Background Check</Text>
      <View>
        <Text style={styles.setptext}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      </View>
      {isInterviewRequested == 1 ? (
        <View style={styles.thankcontainer}>
          <Text style={styles.title}>
            Thank you for verifying to the last step
          </Text>
          <Text style={styles.subtitle}>
            Your request is sent!
          </Text>
          <Text style={styles.subtitle}>
            Our representative will contact you shortly
          </Text>
        </View>
      ) : (
        <GradientButton onPress={handleFinish} loading={loading} />
      )}
      <TouchableOpacity style={styles.nextBtn}>
        <Text style={styles.nextText}>Finish</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  setptext: {
    color: "#c3c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  headtext: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 5,
  },
  nextBtn: {
    backgroundColor: "#FDBF2D",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: {
    color: "#000000",
    fontFamily: "Montserrat_700Bold",
    fontSize: 20
  },
  thankcontainer: {
    fontFamily: "Montserrat_700Bold",
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 5,
    padding: 15,
    color: "#000000"

  },
  title: {
    fontSize: 15,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16
  }
})
export default Step7Interview;
