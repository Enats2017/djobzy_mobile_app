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

const UserPaymentPage = () => {
  const [selected, setSelected] = useState("");
  const [remember, setRemember] = useState(false);
  const [paypalId, setPaypalId] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { profileData } = route.params || {};

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
            {/* Payment Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>
                Make a Payment for{"\n"}
                <Text style={styles.highlightText}>
                  {profileData?.subject}
                </Text>{" "}
                job boosting
              </Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Contract ID</Text>
                <Text style={styles.summaryValue}>{profileData?.gid}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount</Text>
                <Text style={styles.summaryValue}>
                  {profileData?.bid_price} CAD
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Processing Fee</Text>
                <Text style={styles.summaryValue}>
                  {processingFee.toFixed(2)} CAD
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Payment</Text>
                <Text style={styles.totalValue}>
                  {" "}
                  {TotalAmount?.toFixed(2)} CAD
                </Text>
              </View>
            </View>

            <View style={styles.section}>
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
                    <Ionicons name="checkmark" size={14} color="#fff" />
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
    backgroundColor: "#f76c6c",
    borderColor: "#f76c6c",
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
