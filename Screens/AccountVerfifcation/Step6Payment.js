import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";

const Step6Payment = () => {
  const [selected, setSelected] = useState("card");
  return (
    <>
      <Text style={styles.setptext}>STEP 6</Text>
      <Text style={styles.headtext}>Credit / Debit Card Verification</Text>
      <View>
        <Text style={styles.desc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.option, selected === "paypal" && styles.activeOption]}
        onPress={() => setSelected("paypal")}
      >
        {selected === "paypal" && (
          <Ionicons name="checkmark-circle" size={20} color="#000" />
        )}
        <Text style={styles.optionText}>Pay Pal</Text>
        <FontAwesome name="paypal" size={22} color="#003087" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, selected === "card" && styles.activeOption]}
        onPress={() => setSelected("card")}
      >
        {selected === "card" && (
          <Ionicons name="checkmark-circle" size={22} color="#000" />
        )}
        <Text style={styles.optionText}>Credit Card</Text>
        <Ionicons name="card-outline" size={22} color="#1c75bc" />
      </TouchableOpacity>

      <Text style={styles.infoText}>
        You'll be 1 dollar to link a verified account.
      </Text>

      {selected === "card" && (
        <>
          <TextInput
            placeholder="Card number"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#999"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
            />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#999"
              style={[styles.input, { flex: 1 }]}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              placeholder="MM | YY"
              placeholderTextColor="#999"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
            />
            <TextInput
              placeholder="CVV"
              placeholderTextColor="#999"
              style={[styles.input, { flex: 1 }]}
            />
          </View>

          <TextInput
            placeholder="Full Address Associated With the card"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <GradientButton title="Add Payment Method" />
        </>
      )}
      <TouchableOpacity style={styles.nextBtn}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </>
  );
};

export default Step6Payment;

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
  desc: {
    fontFamily: "Montserrat_500Medium",
    color: "#c3c3c3",
    fontSize: 12,
    marginBottom: 10,
  },
  option: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  activeOption: {
    borderColor: "#000",
  },

  optionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",

    color: "#000",
  },

  infoText: {
    color: "#ccc",
    fontSize: 12,
    marginVertical: 10,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
  },
  nextBtn: {
    backgroundColor: "#FDBF2D",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: {
    color: "#000000",
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
  },
});
