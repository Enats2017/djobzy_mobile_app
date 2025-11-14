import Footer from "../../components/Footer";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";

const JobApplyPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { gig, award } = route?.params || {};


  const [agree, setAgree] = useState(false);
  const [myTotalPrice, setMyTotalPrice] = useState("");
  const [myHourlyRate, setMyHourlyRate] = useState("");
  const [myFinalTotalPrice, setMyFinalTotalPrice] = useState("");
  const [introLetter, setIntroLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expectedTime, setExpectedTime] = useState(0);

  const handleSubmitOffer = async () => {
    if (!myTotalPrice || !myHourlyRate || !introLetter) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.navigate("Login");
        return;
      }
      const payload = {
        id: gig.gid,
        price: myTotalPrice,
        final_price: myFinalTotalPrice,
        description: introLetter,
        hourly_rate: myHourlyRate,
        total_hour: expectedTime,
      };
      const response = await fetch(`${API_URL}/job-apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.status === 200) {
        setMyTotalPrice("");
        setMyHourlyRate("");
        setIntroLetter("");
        Alert.alert("Success", "Application submitted");
        navigation.goBack();
      } else {
        alert(result.message || "Failed to submit proposal");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleHourlyChange = (value) => {
    setMyHourlyRate(value);
    const total = parseInt(myTotalPrice);
    const hourly = parseInt(value);
    if (!total || !hourly) {
      setExpectedTime(0);
      return;
    }
    if (hourly > total) {
      Alert.alert(
        "Invalid Input",
        "Hourly rate cannot be more than total price."
      );
      setExpectedTime(0);
      return;
    }
    const result = total / hourly;
    setExpectedTime(Math.ceil(result));
  };

  const handleTotalPriceChange = (value) => {
    setMyTotalPrice(value);
    const finalPrice = parseInt(value);
    const hourly = parseInt(myHourlyRate);

    if (!finalPrice || !hourly) {
      setExpectedTime(0);
      return;
    }
    const result = finalPrice / hourly;
    setExpectedTime(Math.ceil(result));
  };

  const handleProcessingFeePriceChange = (value) => {
    setMyTotalPrice(value);
    const calculateProcessingTotal = parseFloat(value);
    if (!calculateProcessingTotal || calculateProcessingTotal <= 0) {
      setMyFinalTotalPrice(0);
    } else {
      const fee = calculateProcessingTotal * 0.15;
      const finalPayment = calculateProcessingTotal + fee;
      setMyFinalTotalPrice(finalPayment.toFixed(2));
    }
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#222222" }}>
        <View style={styles.container}>
          <PageNameHeaderBar navigation={navigation} title="Apply to Jobs" />
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleheader}>
            <Text style={styles.title}>{gig.subject}</Text>
          </View>

          <Text style={styles.sectionTitle}>Employer's offered price</Text>
          <View style={styles.row}>
            <View style={styles.box}>
              <Text style={styles.label}>Total Price</Text>
              <View style={styles.valueBox}>
                <Text style={styles.currency}>CAD</Text>
                <View style={styles.divider} />
                <Text style={styles.value}>{gig.fixed_minimum}</Text>
              </View>
            </View>

            <View style={styles.box}>
              <Text style={styles.label}>Hourly Rate</Text>
              <View style={styles.valueBox}>
                <Text style={styles.currency}>CAD</Text>
                <View style={styles.divider} />
                <Text style={styles.value}>{gig.hour_minimum}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.note}>
            <Text style={styles.bold}>{gig.expected_hour} Hours </Text>
            is expected for the job to be done.
          </Text>

          {/* My Offer */}
          <View style={styles.offerHeader}>
            <Text style={styles.sectionTitle}>My Offer</Text>
            <FontAwesome
              name="question-circle"
              size={15}
              color="#c3c3c3c3"
              style={{ marginTop: 2 }}
            />
          </View>

          <View style={styles.offerRow}>
            <View style={styles.offerBox}>
              <Text style={styles.label}>Total Price</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currency}>CAD</Text>
                <View style={styles.divider} />
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={myTotalPrice}
                  onChangeText={(text) => {
                    handleTotalPriceChange(text);
                    handleProcessingFeePriceChange(text);
                    setMyTotalPrice(text.replace(/[^0-9.]/g, ""));
                  }}
                />
              </View>
            </View>

            <View style={styles.offerBox}>
              <Text style={styles.label}>Hourly Rate</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currency}>CAD</Text>
                <View style={styles.divider} />
                <TextInput
                  style={styles.input}
                  placeholder="0 / hr"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={myHourlyRate}
                  onChangeText={(text) => {
                    handleHourlyChange(text);
                    setMyHourlyRate(text.replace(/[^0-9.]/g, ""));
                  }}
                />
              </View>
            </View>
          </View>
          <Text style={styles.note}>
            <Text style={styles.bold}>{expectedTime} Hours </Text>
            is expected for the job to be done.
          </Text>
          {/* Introduction Letter */}
          <Text style={styles.sectionTitle}>
            Introduction Letter (Required)
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Description"
            placeholderTextColor="#c3c3c3c3"
            multiline
            textAlignVertical="top"
            value={introLetter}
            onChangeText={(text) => setIntroLetter(text)}
          />

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgree(!agree)}
          >
            <View style={[styles.checkbox, agree && styles.checkedBox]}>
              {agree && (
                <MaterialIcons name="check" size={18} color="#ffffff" />
              )}
            </View>
            <Text style={styles.agreeText}>
              I agree to abide by the{" "}
              <Text style={styles.link}>Terms and Conditions</Text> of
              DJobzy.com
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sendButton,
              submitting && { backgroundColor: "#ccc" },
            ]}
            onPress={handleSubmitOffer}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
        </View>

        <Footer />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal:15,
  },
  titleheader:{
    paddingBottom:10,

  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "Montserrat_600SemiBold",
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 8,
  },
  offerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  offerBox: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#ffffff",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  box: {
    flex: 1,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 6,
  },
  valueBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
   perviousBox:{
     flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF33",
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom:15,

  },
  currency: {
    color: "#D38979",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: "70%",
    backgroundColor: "#00000033",
    marginHorizontal: 7,
  },
  value: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
   perviousvalue:{
      color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",

  },
  input: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  note: {
    color: "#ffffff",
    fontSize: 12,
    fontStyle: "italic",
    fontFamily: "Montserrat_400Medium",
    marginTop: 7,
    marginBottom: 16,
  },
  bold: {
    color: "#ffffff",
    fontStyle: "italic",
    fontSize: 12,
    fontFamily: "Montserrat_600SemiBold",
  },
  offerHeader: {
    flexDirection: "row",
    gap: 6,
  },
  textArea: {
    backgroundColor: "#FFFFFF0D",
    color: "#c3c3c3c3",
    borderRadius: 12,
    fontFamily: "Montserrat_400Medium",
    fontStyle: "italic",
    fontSize: 14,
    paddingHorizontal: 15,
    minHeight: 150,
    marginTop: 6,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: "#C57B63",
    borderColor: "#C57B63",
  },
  agreeText: {
    color: "#ffffff",
    fontSize: 14,
    width: "80%",
    fontFamily: "Montserrat_400Regular",
  },
  link: {
    color: "#C57B63",
    textDecorationLine: "underline",
  },
  sendButton: {
    backgroundColor: "#C96B59",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
});

export default JobApplyPage;
