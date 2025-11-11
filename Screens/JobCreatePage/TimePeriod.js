import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TimePeriod = ({
  durationData,
  setDurationData,
  timeError,
  setTimeError,
}) => {
  const { selectedTerm, selectedOption, customDays } = durationData;

  const setSelectedTerm = (term) => {
    setTimeError(false); // HIDE ERROR WHEN SWITCHING TABS

    setDurationData({
      ...durationData,
      selectedTerm: term,
      selectedOption: "",
      customDays: "",
    });
  };

  const setSelectedOption = (option) => {
    let valueLabel = "";
    if (option === "1") valueLabel = "1 Day or less";
    else if (option === "1-7") valueLabel = "1–7 Days";
    else if (option === "10-30") valueLabel = "1 Month or Less";
    else if (option === "30+") valueLabel = "1–3 Months";
    else if (option === "custom")
      valueLabel = `${durationData.customDays || "Custom"} Days`;
    else if (option === "customEmp")
      valueLabel = `${durationData.customDays || "Custom"} Months`;

    setTimeError(false);

    setDurationData({
      ...durationData,
      selectedOption: option,
      selectedValue: valueLabel,
    });
  };

  const setCustomDays = (days) => {
    setDurationData({
      ...durationData,
      customDays: days,
    });
  };

  return (
    <View style={styles.duration}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTerm === "short" && styles.activeTab]}
          onPress={() => setSelectedTerm("short")}
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
          onPress={() => setSelectedTerm("employee")}
        >
          <Text
            style={[
              styles.tabTitle,
              selectedTerm === "employee" && styles.activeTabTitle,
            ]}
          >
            Employees
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

      {/* Short-Term Section */}
      {selectedTerm === "short" && (
        <>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionRow,
                selectedOption === "1" && styles.optionRowSelected,
              ]}
              onPress={() => setSelectedOption("1")}
            >
              <Text style={styles.optionText}>1 Day or less</Text>
              <View
                style={[
                  styles.radio,
                  selectedOption === "1" && styles.radioSelected,
                ]}
              >
                {selectedOption === "1" && (
                  <MaterialIcons name="done" size={14} color="#000000" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionRow,
                selectedOption === "1-7" && styles.optionRowSelected,
              ]}
              onPress={() => setSelectedOption("1-7")}
            >
              <Text style={styles.optionText}>1 - 7 Days</Text>
              <View
                style={[
                  styles.radio,
                  selectedOption === "1-7" && styles.radioSelected,
                ]}
              >
                {selectedOption === "1-7" && (
                  <MaterialIcons name="done" size={14} color="#000000" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.customRow}>
            <TouchableOpacity
              onPress={() => setSelectedOption("custom")}
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
                  <MaterialIcons name="done" size={14} color="#000000" />
                )}
              </View>
              <Text style={[{ marginLeft: 7 }, styles.optionText]}>
                Custom Days
              </Text>
            </TouchableOpacity>
            <View style={styles.customInput}>
              <TextInput
                style={styles.inputBox}
                value={customDays}
                onChangeText={setCustomDays}
                keyboardType="numeric"
                placeholder="15"
                placeholderTextColor="#000000"
              />
            </View>
          </View>

          {timeError && (
            <Text
              style={{
                color: "red",
                marginTop: 6,
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
              }}
            >
              *Please select at least one option
            </Text>
          )}
        </>
      )}

      {/* Employees Section */}
      {selectedTerm === "employee" && (
        <>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionRow,
                selectedOption === "10-30" && styles.optionRowSelected,
              ]}
              onPress={() => setSelectedOption("10-30")}
            >
              <Text style={styles.optionText}>1 Month or Less</Text>
              <View
                style={[
                  styles.radio,
                  selectedOption === "10-30" && styles.radioSelected,
                ]}
              >
                {selectedOption === "10-30" && (
                  <MaterialIcons name="done" size={14} color="#000000" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionRow,
                selectedOption === "30+" && styles.optionRowSelected,
              ]}
              onPress={() => setSelectedOption("30+")}
            >
              <Text style={styles.optionText}>1–3 Months</Text>
              <View
                style={[
                  styles.radio,
                  selectedOption === "30+" && styles.radioSelected,
                ]}
              >
                {selectedOption === "30+" && (
                  <MaterialIcons name="done" size={14} color="#000000" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.customRow}>
            <TouchableOpacity
              onPress={() => setSelectedOption("customEmp")}
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
                  <MaterialIcons name="done" size={14} color="#000000" />
                )}
              </View>
              <Text style={[{ marginLeft: 7 }, styles.optionText]}>
                Custom Months
              </Text>
            </TouchableOpacity>
            <View style={styles.customInput}>
              <TextInput
                style={styles.inputBox}
                value={customDays}
                onChangeText={setCustomDays}
                keyboardType="numeric"
                placeholder="15"
                placeholderTextColor="#000000"
              />
            </View>
          </View>

          {timeError && (
            <Text
              style={{
                color: "red",
                marginTop: 6,
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
              }}
            >
              *Please select at least one option
            </Text>
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
    right: 6,
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
