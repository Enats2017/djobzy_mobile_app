import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Pressable, Platform, KeyboardAvoidingView, Keyboard, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const isoToEmoji = (iso2 = "") =>
  iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const formatDialCode = (code) => {
  if (!code && code !== 0) return "+1";
  const str = String(code).replace(/\D/g, "");
  return `+${str}`;
};

const CountryPickerModal = ({ visible, countries = [], onSelect, onClose }) => {
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();
  const filtered = useCallback(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        String(c.phonecode).includes(q) ||
        c.iso2?.toLowerCase().includes(q)
    );
  }, [search, countries]);

  useEffect(() => {
    if (!visible) {
      setSearch("");
    }
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    setSearch("");
    onClose();
  };

  const renderItem = ({ item }) => {
    const flag = isoToEmoji(item.iso2);
    const dialCode = formatDialCode(item.phonecode);
    return (
      <TouchableOpacity
        style={styles.countryRow}
        onPress={() => {
          Keyboard.dismiss();
          onSelect({ flag, dialCode, iso2: item.iso2, name: item.name });
          onClose();
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.countryFlag}>{flag}</Text>
        <Text style={styles.countryName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.countryDial}>{dialCode}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={[styles.modalOverlay]} onPress={handleClose}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
          <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Country</Text>
              <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={22} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search country or dial code…"
                placeholderTextColor="#aaa"
                value={search}
                onChangeText={setSearch}
                clearButtonMode="while-editing"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            <FlatList
              data={filtered()}
              keyExtractor={(item) => String(item.id ?? item.iso2)}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={{ paddingBottom: 30 }}
              initialNumToRender={20}
              maxToRenderPerBatch={30}
              windowSize={10}
              removeClippedSubviews={Platform.OS === "android"}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const PhoneNumberInput = ({
  value = "",
  onChange = () => { },
  countries = [],
  defaultFlag,
  defaultCallingCode = "+1",
  defaultCountryISO = "CA",
  placeholder = "999 999 9999",
}) => {
  const initFlag = defaultFlag ?? isoToEmoji(defaultCountryISO);
  const [showPicker, setShowPicker] = useState(false);
  const [flag, setFlag] = useState(initFlag);
  const [callingCode, setCallingCode] = useState(defaultCallingCode);
  const [countryISO, setCountryISO] = useState(defaultCountryISO);
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPhoneNumber(value);
    validateNumber(value, countryISO, callingCode);
  }, [value]);

  // If default props change (e.g. userDetails loaded async)
  useEffect(() => {
    setFlag(defaultFlag ?? isoToEmoji(defaultCountryISO));
    setCallingCode(defaultCallingCode);
    setCountryISO(defaultCountryISO);
  }, [defaultCallingCode, defaultCountryISO, defaultFlag]);

  const validateNumber = (number, iso, dial) => {
    if (!number) {
      setIsValid(false);
      setError("");
      return;
    }
    try {
      const full = `${dial}${number}`;
      const valid = isValidPhoneNumber(full, iso);
      setIsValid(valid);
      setError(valid ? "" : "Invalid phone number");
    } catch {
      setIsValid(false);
      setError("Invalid phone number");
    }
  };

  const handleChange = (text) => {
    const digits = text.replace(/[^0-9]/g, "");
    setPhoneNumber(digits);
    onChange({
      phone: digits,
      countryCode: callingCode.replace("+", ""),
      countryISO,
    });
    validateNumber(digits, countryISO, callingCode);
  };

  const handleCountrySelect = ({ flag: f, dialCode, iso2 }) => {
    setFlag(f);
    setCallingCode(dialCode);
    setCountryISO(iso2);
    onChange({
      phone: phoneNumber,
      countryCode: dialCode.replace("+", ""),
      countryISO: iso2,
    });
    validateNumber(phoneNumber, iso2, dialCode);
  };

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          isValid && styles.inputContainerValid,
        ]}
      >
        <TouchableOpacity
          style={styles.flagButton}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <Text style={styles.flag}>{flag}</Text>
          <Text style={styles.callingCode}>{callingCode}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handleChange}
          returnKeyType="done"
        />

        {isValid && (
          <Ionicons name="checkmark-done-circle-sharp" size={22} color="#28a745" style={styles.validIcon} />
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <CountryPickerModal
        visible={showPicker}
        countries={countries}
        onSelect={handleCountrySelect}
        onClose={() => setShowPicker(false)}
      />
    </View>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "100%",
    maxHeight: "70%",
    // minHeight: 250,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 11,
    backgroundColor: "#fff",
    elevation: 2,
  },
  inputContainerValid: {
    borderColor: "#28a745",
  },
  flagButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 4,
  },
  flag: {
    fontSize: 22,
    marginRight: 5,
  },
  callingCode: {
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
    color: "#303030",
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: "#d0d0d0",
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#303030",
    paddingVertical: 0,
    includeFontPadding: false,
    fontFamily: "Montserrat_500Medium",
  },
  validIcon: {
    marginLeft: 6,
  },
  errorText: {
    color: "#e53935",
    fontSize: 12.5,
    marginTop: 5,
    marginLeft: 2,
    fontFamily: "Montserrat_400Regular",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1e1e1e",
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    height: 42,
  },
  searchIcon: {
    marginRight: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#303030",
    paddingVertical: 0,
    includeFontPadding: false,
    fontFamily: "Montserrat_500Medium",
  },

  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  countryFlag: {
    fontSize: 22,
    width: 36,
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    color: "#1e1e1e",
    fontFamily: "Montserrat_500Medium",
    lineHeight: 22,
  },
  countryDial: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Montserrat_500Medium",
    lineHeight: 22,
    minWidth: 48,
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: "#f2f2f2",
    width: "100%",
  },
});