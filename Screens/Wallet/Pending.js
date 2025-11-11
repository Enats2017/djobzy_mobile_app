import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Pending() {
  return (
    <>
      <View style={styles.visualTableWrapper}>
        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Date</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>2024-11-01</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Employer</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>John Smith</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Job Name</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>
            Website Redesign & SEO Optimization Project
          </Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Status</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>Completed</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Amount</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>CAD 250.00</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRowLast}>
          <Text style={styles.visualTableLabel}>ID</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>#12345678910</Text>
        </View>
      </View>

      <View style={styles.visualTableWrapper}>
        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Date</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>2024-11-01</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Employer</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>John Smith</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Job Name</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>
            Website Redesign & SEO Optimization Project
          </Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Status</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>Completed</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Amount</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>CAD 250.00</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRowLast}>
          <Text style={styles.visualTableLabel}>ID</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>#12345678910</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pageBackground: {
    flex: 1,
    backgroundColor: "#222222",
    // padding: 15
  },
  visualTableWrapper: {
    backgroundColor: "#00000033",
    borderRadius: 12,
    marginBottom: 10,
    paddingBottom: 8,
  },
  visualTableVerticalAbsolute: {
    width: 1,
    backgroundColor: "#ffffff1a",
  },
  visualTableRow: {
    flexDirection: "row",
  },
  visualTableRowLast: {
    flexDirection: "row",
  },
  visualTableHorizontalLine: {
    height: 1,
    backgroundColor: "#ffffff1a",
    alignSelf: "stretch",
  },
  visualTableLabel: {
    width: 130,
    paddingLeft: 12,
    paddingVertical: 12,
    color: "#c3c3c3",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    textAlignVertical: "center",
    textAlign: "left",
    flexWrap: "wrap",
  },
  visualTableValue: {
    flex: 1,
    paddingLeft: 20,
    paddingVertical: 12,
    color: "#c3c3c3",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    textAlign: "left",
    flexWrap: "wrap",
  },
});
