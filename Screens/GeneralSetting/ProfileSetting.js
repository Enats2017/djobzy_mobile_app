import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import LineDivider from "../../components/LineDivider";

export default function ProfileSetting() {
  const [employeeCategories, setEmployeeCategories] = useState([
    "Microbiologist",
    "Microbiologist",
  ]);

  //   const handleEditEmployer = () => {
  //     console.log("Edit Employer Categories clicked");
  //   };

  //   const handleEditEmployee = () => {
  //     console.log("Edit Employee Categories clicked");
  //   };

  const removeCategory = (item) => {
    setEmployeeCategories((prev) => prev.filter((cat) => cat !== item));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar title="Profile Setting" />
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          {/* Employer Section */}
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <Text style={styles.heading}>
                Default Categories for Employer's Profile
              </Text>

              <TouchableOpacity>
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.desc}>
              Please choose the categories that you want to employ people on.
            </Text>
          </View>
          <LineDivider />

          {/* Employee Section */}
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <Text style={styles.heading}>
                Default Categories for Employee's Profile
              </Text>

              <TouchableOpacity>
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.desc}>
              Please choose the categories that you like to be employed in.
            </Text>

            <View style={styles.categoryContainer}>
              {employeeCategories.map((item, index) => (
                <View key={index} style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeCategory(item)}>
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <LineDivider />
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Default Profile</Text>
            <Text style={styles.desc}>
              Your default profile is the one that you use more often. When you
              open Djobzy your default profile will launch first.
            </Text>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Change to Employer</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heading}>Linked Accounts</Text>
          <View style={styles.googlesection}>
            <View style={styles.googleRow}>
              <Image
                source={require("../../assets/images/Google.png")}
                style={styles.avatar}
              />
              <Text style={styles.googleText}>Google</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity>
                <Ionicons name="link" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 10 }}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.terms}>
              You agree to our Terms & Conditions and Cookie Policy. You may
              receive SMS notifications from us or Google and can opt-out at any
              time.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  heading: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    width: "85%",
  },
  desc: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  /* Categories Pills */
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f27d61",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryText: {
    color: "#fff",
    marginRight: 6,
    fontSize: 13,
  },

  /* Buttons */
  primaryBtn: {
    backgroundColor: "#e5634e",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
    marginBottom:15,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  googlesection:{
    backgroundColor:"#ffffff1a",
    padding:10,
    borderRadius:10,
    marginTop:6,
  },

  /* Linked Accounts */
  googleRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
   
  },
  googleText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 10,
  },
  terms: {
    color: "#888",
    fontSize: 12,
    marginTop: 10,
    lineHeight: 17,
  },
});
