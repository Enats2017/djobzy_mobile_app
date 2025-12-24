import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  CheckBox,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import PaymentOption from "../../components/PaymentOption";
import Footer from "../../components/Footer";
import GradientButton from "../../components/GradientButton";
import { useNavigation } from "@react-navigation/native";

const UserPaymentPage = () => {
  const [selected, setSelected] = useState("card");
  const [remember, setRemember] = useState(false);
  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Billing Method" navigation={navigation} />
          <View style={styles.section}>
            <PaymentOption
              title="Credit / Debit Card"
              icon={<FontAwesome5 name="credit-card" size={20} color="#fff" />}
              selected={selected === "card"}
              onPress={() => setSelected("card")}
            />
            <PaymentOption
              title="UPI Payment"
              icon={<Entypo name="paypal" size={24} color="#fff" />}
              selected={selected === "upi"}
              onPress={() => setSelected("upi")}
            />

            <PaymentOption
              title="Cash on Delivery"
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
                I hereby agree to abide by the Terms and Conditions and Policies
                of Djobzy.com.
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <GradientButton title="Aggree"/>
            
          </View>
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
    width: "80%",
    paddingHorizontal: 8,
  },
  rememberMe: { flexDirection: "row", alignItems: "center" },
  rememberText: {
    color: "#fff",
    marginLeft: 10,
    fontFamily: "Montserrat_400Regular",
    fontSize: 15,
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
  button:{
    paddingTop:10
  }
});

export default UserPaymentPage;
