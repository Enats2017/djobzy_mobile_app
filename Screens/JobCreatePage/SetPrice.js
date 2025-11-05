import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SetPrice = ({ budgetData, setBudgetData }) => {
  const navigation = useNavigation();
  const { hourlyRate, totalPrice, expectedTime, processingFee } = budgetData;

  const handleHourlyChange = (value) => {
    const hourly = parseFloat(value || 0);
    const total = parseFloat(budgetData.totalPrice || 0);

    let expected = 0;
    if (total && hourly) {
      if (hourly > total) {
        Alert.alert("Invalid Input", "Hourly rate cannot be more than total price.");
      } else {
        expected = Math.ceil(total / hourly);
      }
    }

    setBudgetData((prev) => ({
      ...prev,
      hourlyRate: value,
      expectedTime: expected,
    }));
  };

  const handleTotalPriceChange = (value) => {
    const total = parseFloat(value || 0);
    const hourly = parseFloat(budgetData.hourlyRate || 0);

    let expected = 0;
    if (total && hourly) {
      expected = Math.ceil(total / hourly);
    }

    let fee = 0;
    let finalPayment = 0;
    if (total > 0) {
      fee = total * 0.05;
      finalPayment = total + fee;
    }

    setBudgetData((prev) => ({
      ...prev,
      totalPrice: value,
      expectedTime: expected,
      processingFee: finalPayment.toFixed(2),
    }));
  };

  return (
    <View style={styles.budget}>
      {/* Total Price */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Total Price</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.currencyText}>CAD</Text>
          <View style={styles.separator} />
          <TextInput
            style={styles.input}
            value={totalPrice}
            onChangeText={handleTotalPriceChange}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Hourly Rate */}
      <View style={styles.hourContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Hourly Rate</Text>
          <FontAwesome
            name="question-circle"
            size={15}
            color="#c3c3c3"
            style={{ marginLeft: 7 }}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.currencyText}>CAD</Text>
          <View style={styles.separator} />
          <TextInput
            style={styles.input}
            placeholder="0 / hr"
            keyboardType="numeric"
            value={hourlyRate}
            onChangeText={handleHourlyChange}
          />
          <Text style={styles.prefix}>/ hr</Text>
        </View>
      </View>

      {/* Expected Time */}
      <Text style={styles.expectedText}>
        Expected Time Range: {expectedTime || 0} hours
      </Text>

      {/* Info Note */}
      <View style={styles.noteContainer}>
        <View style={styles.bullet} />
        <Text style={styles.noteText}>
          5% processing fee will be charged on top of the total payment amount.
          <Text style={styles.boldText}>
            {" "}
            (Final payment will be {processingFee || 0} CAD)
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  budget: {
    marginTop: 10,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 17,
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
    color: "#ffffff",
  },

  suffix: {
    fontSize: 13,
    color: "#555",
    marginLeft: 6,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 15,
  },
  bullet: {
    width: 5,
    height: 5,
    backgroundColor: "#e0dfdaff",
    borderRadius: 4,
    marginTop: 5,
    marginRight: 6,
  },
  noteText: {
    fontSize: 13,
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    width: "95%",
    lineHeight: 19,
  },
  boldText: {
    color: "#c3c3c3",
  },
  
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 10,
    marginTop: 9,
    backgroundColor: "#fff",
  },
  currencyText: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#D38979",
  },
  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  input: {
    fontSize: 15,
    color: "#333",
    width: "100%",
  },
  hourContainer: {
    marginTop: 15,
  },
  expectedText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#ccc",
    marginTop: 10,
  },
});

export default SetPrice;
