import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { scale, fontScale } from "../../utils/scale";
import GradientButton from "../../components/GradientButton";
import GoogleMap from "../../components/GoogleMap";

const AdvancedSearch = () => {
  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");
  const [remote, setRemote] = useState(false);

  return (
    <>
    <ScrollView contentContainerStyle={styles.scrolcontent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Advanced Search</Text>
        <View style={{ width: 18 }} />
      </View>
      <Text style={styles.label}>Keyword</Text>
      <TextInput style={styles.input} placeholder="Keyword" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.plusInput}>
        <TextInput style={styles.innerInput} placeholder="Add a Categroy" />
        <TouchableOpacity style={styles.inputRow}>
          <FontAwesome6 name="plus" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Hourly Price</Text>
      <View style={styles.offerRow}>
        <View style={styles.offerBox}>
          <View style={styles.inputContainer}>
            <Text style={styles.currency}>Form</Text>

            <TextInput
              style={styles.slideinput}
              value={String(fromPrice)}
              onChangeText={(text) => setFromPrice(Number(text))}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.offerBox}>
          <View style={styles.inputContainer}>
            <Text style={styles.currency}>to</Text>
            <TextInput
              style={styles.slideinput}
              value={String(toPrice)}
              onChangeText={(text) => setToPrice(Number(text))}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
      <View style={styles.sliderRow}>
        <Slider
          style={{ flex: 1 }}
          minimumValue={0}
          maximumValue={5000}
          value={toPrice}
          minimumTrackTintColor="#D17B68"
          maximumTrackTintColor="#888"
          thumbTintColor="#D17B68"
          onValueChange={(v) => setToPrice(Math.floor(v))}
        />
      </View>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setRemote(!remote)}
      >
        <View style={[styles.checkbox, remote && styles.checked]}>
          {remote && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
        
        <Text style={styles.checkboxText}>Remote Jobs</Text>
      </TouchableOpacity>
      <View style={{paddingBottom:10}}>
      <GoogleMap/>
      </View>
      <View style={styles.address}>
        <TextInput style={styles.input} placeholder="Address" />
        <TextInput style={styles.input} placeholder="km" />
        <GradientButton />
      </View>
      </ScrollView>
    </>
  );
};

export default AdvancedSearch;

const styles = StyleSheet.create({
  scrolcontent:{
    
    paddingBottom:50,

  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  label: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    fontFamily: "Montserrat_500Medium",
    borderRadius: 8,
    padding: 12,
  },
  plusInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 3,
  },
  innerInput: {
    flex: 1,
    color: "#000",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  inputRow: {
    backgroundColor: "#666666",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    borderRadius: 20,
    width: 25,
    height: 25,
  },
  offerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  offerBox: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: scale(15),
    borderRadius: 10,
    padding: 2,
  },
  currency: {
    fontFamily: "Montserrat_400Medium",
    fontSize: fontScale(14),
    color: "#666666",
    fontStyle: "italic",
  },
  slideinput: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  priceRow: {
    flexDirection: "row",
    gap: 10,
  },

  priceInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
  },
  sliderRow: {
    paddingTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  remoteRow: {
    margin: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  applyBtn: {
    backgroundColor: "#ff6b5a",
    margin: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "bold",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  address: {
    flexDirection: "column",
    gap: 15,
    marginBottom: 18,
  },
  checked: {
    backgroundColor: "#ff3d3d",
    borderColor: "#ff3d3d",
  },
  checkboxText: {
    color: "#fff",
  },
});
