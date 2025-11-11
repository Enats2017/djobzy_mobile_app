import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Withdrawals() {
  const [detailsModal, setDetailsModal] = useState(false);

  return (
    <View style={styles.pageBackground}>
      <View style={styles.visualTableWrapper}>
        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Date</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>16.10.2025</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Withdraw Mode</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>Paypal</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Details</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setDetailsModal(true)}
          >
            <Ionicons name="document-text" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Status</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>Success</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Amount</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>50 CAD</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRowLast}>
          <Text style={styles.visualTableLabel}>ID</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>94736</Text>
        </View>
      </View>

      <View style={styles.visualTableWrapper}>
        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Date</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>16.10.2025</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Withdraw Mode</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>Paypal</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Details</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setDetailsModal(true)}
          >
            <Ionicons name="document-text" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Status</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>Success</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRow}>
          <Text style={styles.visualTableLabel}>Amount</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>50 CAD</Text>
        </View>
        <View style={styles.visualTableHorizontalLine} />

        <View style={styles.visualTableRowLast}>
          <Text style={styles.visualTableLabel}>ID</Text>
          <View style={styles.visualTableVerticalAbsolute} />
          <Text style={styles.visualTableValue}>94736</Text>
        </View>
      </View>

      <Modal
        visible={detailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailsModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Details</Text>
              <TouchableOpacity onPress={() => setDetailsModal(false)}>
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetDivider} />

            <Text style={styles.sheetLabel}>PayPal</Text>

            <View style={styles.emailBox}>
              <Text style={styles.emailText}>info@gmail.com</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#000000",
  },
  sheetLabel: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 10,
    fontFamily: "Montserrat_500Medium",
  },
  emailBox: {
    backgroundColor: "#00000019",
    padding: 14,
    borderRadius: 10,
  },
  emailText: {
    color: "#000000",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
  },

  sheetDivider: {
    height: 1,
    backgroundColor: "#00000033",
    marginBottom: 15,
  },
});
