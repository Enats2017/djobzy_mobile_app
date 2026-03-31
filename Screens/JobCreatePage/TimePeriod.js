import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCreateJobGlobalStore } from "../../components/useCreateJobGlobalStore";

const TimePeriod = ({ timeError, setTimeError }) => {
  const { selectedTerm, selectedOption, customDays, setField } =
    useCreateJobGlobalStore();

  const handleSelectTerm = (term) => {
    setTimeError(false);
    setField("selectedTerm", term);
    setField("selectedOption", "");
    setField("customDays", "");
  };

  const handleSelectOption = (option) => {
    setTimeError(false);

    setField("selectedOption", option);
    setField("customDays", "");
    
  };

  const handleCustomDays = (value) => {
    setTimeError(false);
    setField("customDays", value);
  };

  return (
    <View style={styles.duration}>
      {/* ===== TABS ===== */}
      <View><Text style={styles.mainText}>Select the Duration of Contract</Text></View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTerm === "short" && styles.activeTab]}
          onPress={() => handleSelectTerm("short")}
        >
          <Text
            style={[
              styles.tabTitle,
              selectedTerm === "short" && styles.activeTabTitle,
            ]}
          >
            Short-Term
          </Text>
          <Text
            style={[
              styles.tabSubtitle,
              selectedTerm === "short" && styles.activeTabSubtitle,
            ]}
          >
            Less than 10 days.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTerm === "employee" && styles.activeTab]}
          onPress={() => handleSelectTerm("employee")}
        >
          <Text
            style={[
              styles.tabTitle,
              selectedTerm === "employee" && styles.activeTabTitle,
            ]}
          >
            Long-Term
          </Text>
          <Text
            style={[
              styles.tabSubtitle,
              selectedTerm === "employee" && styles.activeTabSubtitle,
            ]}
          >
            More than 10 days.
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== SHORT TERM ===== */}
      {selectedTerm === "short" && (
        <>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionRow,
                selectedOption === "1" && styles.optionRowSelected,
              ]}
              onPress={() => handleSelectOption("1")}
            >
              <Text style={styles.optionText}>1 Day or less</Text>
              <View
                style={[
                  styles.radio,
                  selectedOption === "1" && styles.radioSelected,
                ]}
              >
                {selectedOption === "1" && (
                  <MaterialIcons name="done" size={14} color="#000" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionRow,
                selectedOption === "1-7" && styles.optionRowSelected,
              ]}
              onPress={() => handleSelectOption("1-7")}
            >
              <Text style={styles.optionText}>1 - 7 Days</Text>
              <View
                style={[
                  styles.radio,
                  selectedOption === "1-7" && styles.radioSelected,
                ]}
              >
                {selectedOption === "1-7" && (
                  <MaterialIcons name="done" size={14} color="#000" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.customRow}>
            <TouchableOpacity
              onPress={() => handleSelectOption("custom")}
              style={[
                styles.optionCol,
                selectedOption === "custom" && styles.optionRowSelected,
              ]}
            >
              <View
                style={[
                  styles.radio,
                  selectedOption === "custom" && styles.radioSelected,
                ]}
              >
                {selectedOption === "custom" && (
                  <MaterialIcons name="done" size={14} color="#000" />
                )}
              </View>
              <Text style={[styles.optionText, { marginLeft: 7 }]}>
                Custom Days
              </Text>
            </TouchableOpacity>

            <View style={styles.customInput}>
              <TextInput
                style={styles.inputBox}
                value={customDays}
                onChangeText={handleCustomDays}
                keyboardType="numeric"
                placeholder="15"
                editable={selectedOption === "custom" ? true : false}
                placeholderTextColor="#c3c3c3c3"
             
              />
            </View>
          </View>

          {timeError &&
            (selectedOption === "custom" || selectedOption === "customEmp") && (
              <Text style={{ color: "red" , fontFamily:"Montserrat_400Regular"}}>Please enter custom days</Text>
            )}
        </>
      )}

      {/* ===== EMPLOYEE ===== */}
      {selectedTerm === "employee" && (
        <>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionRow,
                selectedOption === "10-30" && styles.optionRowSelected,
              ]}
              onPress={() => handleSelectOption("10-30")}
            >
              <Text style={styles.optionText}>1 Month or Less</Text>
              <View
                style={[
                  styles.radio,
                  selectedOption === "10-30" && styles.radioSelected,
                ]}
              >
                {selectedOption === "10-30" && (
                  <MaterialIcons name="done" size={14} color="#000" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionRow,
                selectedOption === "30+" && styles.optionRowSelected,
              ]}
              onPress={() => handleSelectOption("30+")}
            >
              <Text style={styles.optionText}>1–3 Months</Text>
              <View
                style={[
                  styles.radio,
                  selectedOption === "30+" && styles.radioSelected,
                ]}
              >
                {selectedOption === "30+" && (
                  <MaterialIcons name="done" size={14} color="#000" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.customRow}>
            <TouchableOpacity
              onPress={() => handleSelectOption("customEmp")}
              style={[
                styles.optionCol,
                selectedOption === "customEmp" && styles.optionRowSelected,
              ]}
            >
              <View
                style={[
                  styles.radio,
                  selectedOption === "customEmp" && styles.radioSelected,
                ]}
              >
                {selectedOption === "customEmp" && (
                  <MaterialIcons name="done" size={14} color="#000" />
                )}
              </View>
              <Text style={[styles.optionText, { marginLeft: 7 }]}>
                Custom Months
              </Text>
            </TouchableOpacity>

            <View style={styles.customInput}>
              <TextInput
                style={styles.inputBox}
                value={customDays}
                onChangeText={handleCustomDays}
                editable={selectedOption === "customEmp" ? true : false}
                keyboardType="numeric"
                placeholder="15"
                placeholderTextColor="#c3c3c3c3"
              />
            </View>
          </View>

           {timeError &&
            (selectedOption === "custom" || selectedOption === "customEmp") && (
              <Text style={{ color: "red" , fontFamily:"Montserrat_400Regular"}}>Please enter custom Months</Text>
            )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    borderColor: "#ffffff33",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 22,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#CB7767",
    borderRadius: 10,
  },
  tabTitle: {
    fontSize: 16,
    color: "#c3c3c3",
    fontFamily: "Montserrat_600SemiBold",
  },
  tabSubtitle: {
    fontSize: 12,
    color: "#c3c3c3",
    marginTop: 2,
    fontFamily: "Montserrat_400Regular",
  },
  activeTabTitle: { color: "#fff" },
  activeTabSubtitle: { color: "#fff" },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    borderColor: "#ffffff33",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  optionRowSelected: {
    borderColor: "#EBBE56",
  },
  optionCol: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderColor: "#ffffff33",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  mainText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
    paddingTop: 10,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ffffff33",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    backgroundColor: "#EBBE56",
    borderColor: "#EBBE56",
  },
  customRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  customInput: {
    width: 60,
    height: 40,
    backgroundColor: "#f7f2f2",
    borderRadius: 8,
    position: "absolute",
    right: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    textAlign: "center",
    color: "#0e0d0d",
    fontSize: 16,
  },
});

export default TimePeriod;
