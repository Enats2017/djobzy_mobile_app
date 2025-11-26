import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons, Foundation } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import UploadBox from "../../components/UploadBox";
import GradientButton from "../../components/GradientButton";

export default function IDVerificationUploadScreen() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selected, setSelected] = useState("Blog Categories");
  const [method, setMethod] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();

  const data = ["Driving license", "Passport", "National ID"];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <PageNameHeaderBar
          title="Identity Verification"
          navigation={navigation}
        />
        <Text style={styles.title}>Update Identity Verification</Text>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setOpenDropdown(!openDropdown)}
          >
            <Text style={styles.dropdownText}>{selected}</Text>
            <Ionicons
              name={openDropdown ? "chevron-up" : "chevron-down"}
              size={22}
            />
          </TouchableOpacity>
          {openDropdown && (
            <View style={styles.dropdownBody}>
              {data.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelected(item);
                      setOpenDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                  {index !== data.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          )}
        </View>
        {/* <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: '#e27f73'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={data}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select document type' : '...'}
          value={method}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setMethod(item.value);
            setIsFocus(false);
          }}
          renderRightIcon={() => <Text style={styles.chev}>▾</Text>}
        /> */}
        <View style={{ paddingTop: 20 }}>
          <Text style={styles.sectionLabel}>Personal Photo</Text>
          <UploadBox
            label="Upload Personal Photo"
            type="image"
            onSelect={(file) => {
              console.log("Selected image:", file);
            }}
          />

          <Text style={[styles.sectionLabel, { marginTop: 14 }]}>
            Document Image (Front)* & (Back)
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.uploadBox, styles.smallBox]}
              activeOpacity={0.8}
            >
              <Foundation name="upload" size={24} color="#fff" />
              <Text style={styles.uploadText}>Upload File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadBox, styles.smallBox]}
              activeOpacity={0.8}
            >
              <Foundation name="upload" size={24} color="#fff" />
              <Text style={styles.uploadText}>Upload File</Text>
            </TouchableOpacity>
          </View>

            <GradientButton title="Verify Identity"/>
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ID Verification</Text>
              <Text style={styles.badgeTick}>✔</Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>Interview</Text>
              <Text style={styles.badgeTick}>✔</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { paddingHorizontal: 20, flex: 1, backgroundColor: "#222222" },
  title: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
    fontFamily: "Montserrat_600SemiBold",
  },
  sectionLabel: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },

  dropdownWrapper: {
    width: "100%",
  },
  dropdownHeader: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#444",
  },
  dropdownBody: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#222",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  uploadBox: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#FFFFFF33",
    borderRadius: 8,
    height: 110,
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  uploadIcon: { fontSize: 20, color: "#9fa4a6", marginBottom: 6 },
  uploadText: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 4,
  },
  smallBox: { flex: 1, marginRight: 6 },

  verifyBtn: {
    backgroundColor: "#e27f73",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 18,
    alignItems: "center",
  },
  verifyText: { color: "#fff", fontWeight: "600" },

  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141414",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  badgeText: { color: "#b8b8b8", marginRight: 8 },
  badgeTick: { color: "#3fc77a" },
});
