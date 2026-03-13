import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import GradientButton from "../../components/GradientButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import { toastError, toastSuccess } from "../../utils/toast";

const Step7Interview = ({ onNext, interviewRequested }) => {
  const [loading, setLoading] = useState(false);
  const [isInterviewRequested, setIsInterviewRequested] = useState(interviewRequested);

  useEffect(() => {
    setIsInterviewRequested(interviewRequested);
  }, []);

  const handleFinish = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/request-interview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if(data.status === 200) {
        toastSuccess(data.message);
        setIsInterviewRequested(data.is_interview_requested);
      } else {
        toastError('Unable to submit your interview request. Please try again.');
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text style={styles.setptext}>STEP 7</Text>
      <Text style={styles.headtext}>Interview & Background Check</Text>
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
      <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
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
