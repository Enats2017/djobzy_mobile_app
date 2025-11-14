import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation } from "@react-navigation/native";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";

const PromoteService = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const titleLimit = 60;
  const descLimit = 500;

  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
            <PageNameHeaderBar title="Promote your services" navigation={navigation} />
        </View>
        
        <Text style={styles.label}>Service Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Service title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          maxLength={titleLimit}
        />
        <Text style={styles.charCount}>
          {titleLimit - title.length} characters left
        </Text>

        {/* Service Description */}
        <Text style={styles.label}>Service Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Give details"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          maxLength={descLimit}
          multiline
        />
        <Text style={styles.charCount}>
          {description.length}/{descLimit}
        </Text>

        {/* Hourly Rate */}
        <View style={styles.rateContainer}>
          <Text style={styles.label}>Add hourly rate</Text>
           <Ionicons name="help-circle" size={16} color="#ffffff" style={{ marginLeft: 5, marginBottom:5  }} />
        </View>
        <View style={styles.inlineInputContainer}>
          <Text style={styles.currency}>CAD</Text>
          <TextInput
            style={styles.inlineInput}
            placeholder="0 / h"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={hourlyRate}
            onChangeText={setHourlyRate}
          />
        </View>

        {/* Total Price */}
        <View style={styles.rateContainer}>
          <Text style={styles.label}>Add total price</Text>
          <Ionicons name="help-circle" size={16} color="#ffffff" style={{ marginLeft: 5, marginBottom:5  }} />
        </View>
        <View style={styles.inlineInputContainer}>
          <Text style={styles.currency}>CAD</Text>
          <TextInput
            style={styles.inlineInput}
            placeholder="0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={totalPrice}
            onChangeText={setTotalPrice}
          />
        </View>

        {/* Attach File Button */}
        <TouchableOpacity style={styles.attachBtn}>
          <Text style={styles.attachText}>Attach File</Text>
        </TouchableOpacity>

        <View style={styles.categoryBtn}>
            <GradientButton title="Choose Category" onPress={()=>navigation.navigate("PromoteCategoryPage")} />
          </View>
      </ScrollView>
      <Footer/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#222222",
     
  },
  container: {
    paddingTop:10,
    flex:1,
    paddingHorizontal: 15, 
  },
  
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily:"Montserrat_700Bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF0D",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    color: "#fff",
    fontSize: 14,
  },
  textArea: {
    height: 148,
    textAlignVertical: "top",
  },
  charCount: {
    color: "#888",
    fontSize: 12,
    textAlign: "right",
    marginVertical: 4,
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    
  },
  inlineInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: "space-between",
  },
  currency: {
    color: "#aaa",
    fontSize: 14,
  },
  inlineInput: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    
    textAlign: "right",
  },
  attachBtn: {
    
    borderRadius: 8,
    width:"150",
    borderColor:"#ffffff",
    borderWidth:1,
    marginTop: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  attachText: {
    color: "#fff",
    fontSize: 16,
    fontFamily:"Montserrat_600SemiBold",
  },
  categoryBtn: {
   marginTop: 65,
 },

});
export default PromoteService;
