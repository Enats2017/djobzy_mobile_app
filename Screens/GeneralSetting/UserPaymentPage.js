import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  CheckBox,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import {
  Ionicons,
  FontAwesome5,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";
import PaymentOption from "../../components/PaymentOption";
import Footer from "../../components/Footer";
import GradientButton from "../../components/GradientButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import Paypal from "../Wallet/PaypalWithdraw";
import CreditCard from "../Wallet/CreditCardWithdraw";
import { ScrollView } from "react-native-gesture-handler";
import QuestionMark from "../../components/QuestionMark";

const UserPaymentPage = () => {
  const [selected, setSelected] = useState("");
  const [remember, setRemember] = useState(false);
  const [paypalId, setPaypalId] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { profileData } = route.params || {};
  console.log("profiledata111",profileData);
  

  const bidAmount = Number(profileData?.bid_price || 0);

  const processingFee = bidAmount * 0.05;

  const TotalAmount = bidAmount + processingFee;

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Payment Method" navigation={navigation} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.wrapper}>
              <View style={styles.box}>
                <Text style={styles.label}>Contract ID</Text>
                <View style={styles.verticalLine} />
                <Text style={styles.value}>4297</Text>
              </View>

              <View style={styles.box}>
                <Text style={styles.label}>Amount</Text>
                <View style={styles.verticalLine} />
                <Text style={styles.value}>0 CAD</Text>
              </View>
              <Text style={styles.infoText}>
                *You save over 40% of fees, Due to your referral status
              </Text>

              <View style={styles.box}>
                <Text style={styles.label}>Processing Fee</Text>
                <View style={styles.verticalLine} />
                <Text style={styles.value}>4297</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.label}>Total Payment</Text>
                <View style={styles.verticalLine} />
                <Text style={styles.value}>0 CAD</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={{paddingVertical:7}}>

              <QuestionMark title="Payment Method"/>
              </View>
              <PaymentOption
                title="Credit / Debit Card"
                icon={
                  <FontAwesome name="credit-card-alt" size={20} color="#fff" />
                }
                selected={selected === "card"}
                onPress={() => setSelected("card")}
              />
              <PaymentOption
                title="PayPal"
                icon={<Entypo name="paypal" size={24} color="#fff" />}
                selected={selected === "upi"}
                onPress={() => setSelected("upi")}
              />

              <PaymentOption
                title="Pay via Wallet"
                icon={<Ionicons name="cash-outline" size={24} color="#fff" />}
                selected={selected === "cod"}
                onPress={() => setSelected("cod")}
              />
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setRemember(!remember)}
              >
                <View
                  style={[styles.checkbox, remember && styles.checkboxChecked]}
                >
                  {remember && (
                    <Ionicons name="checkmark" size={14} color="#000"/>
                  )}
                </View>
                <Text style={styles.rememberText}>
                  I hereby agree to abide by the{" "}
                  <Text
                    style={styles.clickText}
                    onPress={() => {
                      console.log("hii");
                    }}
                  >
                    Terms and Conditions
                  </Text>{" "}
                  and Policies of Djobzy.com.
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingTop: 15 }}>
              {selected === "card" && <CreditCard button="Pay Now" />}
              {selected === "upi" && <Paypal button="Pay Now" />}
            </View>
          </ScrollView>
        </View>
        <Footer />
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

  wrapper: {
    width: "100%",
  },

  box: {
    flexDirection: "row",
    alignItems: "center",
   
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    height: 50,
    paddingVertical:7,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  label: {
   flex:1,
   paddingLeft:15,
    fontSize: 16,
    color: "#D38979", 
   fontFamily:"Montserrat_700Bold"
  },

  verticalLine: {
    width: 1,
  
    height: "100%",
    backgroundColor: "#0000001a",
  },

  value: {
    flex:1,
    paddingLeft: 12,
    fontSize: 16,
    fontFamily:"Montserrat_500Medium",
    color: "#666666",
    
  },

  infoText: {
    fontSize: 12,
    fontFamily:"Montserrat_400Medium",
    color: "#ffffff",
    marginTop: 4,
    marginBottom:13,
  },


  section: {
    marginBottom: 5,
  },
  row: {
    flexDirection: "column",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  rememberText: {
    color: "#fff",
    marginLeft: 10,
    flexShrink: 1,
    fontFamily: "Montserrat_400Regular",
    fontSize: 15,
    lineHeight: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  button: {
    paddingTop: 10,
  },
  click: {
    alignContent: "center",
  },
  clickText: {
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,

    textDecorationLine: "underline",
  },
  paypalBox: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#d9d9d91a",
    padding: 12,
    borderRadius: 10,
  },

  paypalTitle: {
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "Montserrat_600SemiBold",
  },

  paypalLabel: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
  },

  paypalInput: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  summaryCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },

  summaryTitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Montserrat_600SemiBold",
    lineHeight: 22,
  },

  highlightText: {
    color: "#f76c6c",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  summaryLabel: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },

  summaryValue: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },

  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 8,
  },

  totalLabel: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
  },

  totalValue: {
    color: "#f76c6c",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
});

export default UserPaymentPage;
