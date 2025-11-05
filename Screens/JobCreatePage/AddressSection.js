import React, { useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView from "react-native-maps";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddressSection = ({ contractData, setContractData }) => {
  const [requirements, setRequirements] = useState(
    contractData?.requirements || [{ id: 1, value: "" }]
  );
  const [languages, setLanguages] = useState(
    contractData?.languages || [{ id: 1, lang: "", level: "" }]
  );
  const [address, setAddress] = useState(contractData?.address || "");

  // ✅ Whenever these change, update parent state
  useEffect(() => {
    setContractData({ requirements, languages, address });
  }, [requirements, languages, address]);

  // --- existing methods ---
  const addRequirement = () => {
    setRequirements([...requirements, { id: Date.now(), value: "" }]);
  };
  const removeRequirement = (id) => {
    setRequirements(requirements.filter((r) => r.id !== id));
  };
  const updateRequirement = (id, text) => {
    setRequirements(requirements.map((r) => (r.id === id ? { ...r, value: text } : r)));
  };

  const addLanguage = () => {
    setLanguages([...languages, { id: Date.now(), lang: "", level: "" }]);
  };
  const removeLanguage = (id) => {
    setLanguages(languages.filter((l) => l.id !== id));
  };
  const updateLanguage = (id, field, text) => {
    setLanguages(languages.map((l) => (l.id === id ? { ...l, [field]: text } : l)));
  };

  return (
    <View style={{ height: "86%" }}>
      <KeyboardAwareScrollView
        extraScrollHeight={10}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Requirements Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements (Optional)</Text>
            {requirements.map((req, index) => (
              <View key={req.id} style={styles.requirementBox}>
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>{index + 1}.</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Write your requirement here"
                  value={req.value}
                  onChangeText={(text) => updateRequirement(req.id, text)}
                />
                <TouchableOpacity onPress={() => removeRequirement(req.id)}>
                  <FontAwesome5 name="trash" size={15} color="#666666" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={addRequirement}>
              <Text style={styles.addBtnText}>
                <Entypo name="circle-with-plus" size={18} color="black" /> Add Requirement
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Language Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Language (Optional)</Text>
            {languages.map((lang) => (
              <View key={lang.id} style={styles.languageRow}>
                <TextInput
                  style={styles.languageInput}
                  placeholder="Add Language"
                  value={lang.lang}
                  onChangeText={(text) => updateLanguage(lang.id, "lang", text)}
                />
                <TextInput
                  style={styles.languageInput}
                  placeholder="Add Level"
                  value={lang.level}
                  onChangeText={(text) => updateLanguage(lang.id, "level", text)}
                />
                <TouchableOpacity onPress={() => removeLanguage(lang.id)} style={styles.levelInput}>
                  <FontAwesome name="minus-circle" size={18} color="#666666" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={addLanguage}>
              <Text style={styles.addBtnText}>
                <Entypo name="circle-with-plus" size={18} color="black" /> Add Language
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Address Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address The Job</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Write an Address"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#c3c3c3"
            />
            <View style={styles.mapscetion}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 0,
                  longitude: 0,
                  latitudeDelta: 100,
                  longitudeDelta: 100,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapscetion: {
    height: 300,
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },

  header: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    color: "#faf8f8ff",
    marginBottom: 6,
  },
  requirementBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
   addressInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
     height:45,
    paddingHorizontal:12,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: "#666666",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
    color: "#333",
  },

  addBtn: {
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 10,
    marginBottom:10,
    backgroundColor: "#ebbe56",
  },
  addBtnText: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    color: "#000000",
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  languageInput: {
    flex: 1,
    fontSize: 15,
    marginRight: 5,
    fontFamily: "Montserrat_500Medium",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  levelInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#ffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",

    marginBottom: 10,
  },
});

export default AddressSection;
