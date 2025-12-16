import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NoTransactions from "./NoTransactions";
import PaypalWithdrawalModalDetail from "./PaypalWithdrawalModalDetail";
import BankwithdrawalModalDetails from "./BankwithdrawalModalDetails";
import CardWithdrawalModalDetails from "./CardWithdrawalModalDetails";

export default function Withdrawals({ data }) {
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const hasData = data?.data?.length > 0;

  // ✅ RENDER MODAL BASED ON MODE
  const renderModal = () => {
    if (!selectedItem) return null;

    const commonProps = {
      visible: detailsModal,
      onClose: () => setDetailsModal(false),
      data: selectedItem,
    };

    console.log(selectedItem.withdraw_mode);
    switch (selectedItem.withdraw_mode) {
      case "paypal":
        return <PaypalWithdrawalModalDetail {...commonProps} />;

      case "bank_transfer":
        return <BankwithdrawalModalDetails {...commonProps} />;

      case "credit_debit_card":
        return <CardWithdrawalModalDetails {...commonProps} />;

      default:
        return null;
    }
  };


  return (
    <View style={styles.pageBackground}>
      {hasData ? (
        data.data.map((item, index) => (
          <View key={index} style={styles.visualTableWrapper}>
            <View style={styles.visualTableRow}>
              <Text style={styles.visualTableLabel}>Date</Text>
              <View style={styles.visualTableVerticalAbsolute} />
              <Text style={styles.visualTableValue}>{item.created_date}</Text>
            </View>
            <View style={styles.visualTableHorizontalLine} />

            <View style={styles.visualTableRow}>
              <Text style={styles.visualTableLabel}>Withdraw Mode</Text>
              <View style={styles.visualTableVerticalAbsolute} />
              <Text style={styles.visualTableValue}>{item.modes}</Text>
            </View>
            <View style={styles.visualTableHorizontalLine} />

            <View style={styles.visualTableRow}>
              <Text style={styles.visualTableLabel}>Status</Text>
              <View style={styles.visualTableVerticalAbsolute} />
              <Text style={styles.visualTableValue}>{item.withdraw_status == 'pending' ? "Pending" : "Completed"}</Text>
            </View>
            <View style={styles.visualTableHorizontalLine} />

            <View style={styles.visualTableRow}>
              <Text style={styles.visualTableLabel}>Amount</Text>
              <View style={styles.visualTableVerticalAbsolute} />
              <Text style={styles.visualTableValue}>
                {item.withdraw_amt} CAD
              </Text>
            </View>
            <View style={styles.visualTableHorizontalLine} />

            <View style={styles.visualTableRowLast}>
              <Text style={styles.visualTableLabel}>ID</Text>
              <View style={styles.visualTableVerticalAbsolute} />
              <Text style={styles.visualTableValue}>{item.withdraw_id}</Text>
            </View>
            <View style={styles.visualTableHorizontalLine} />

            <View style={styles.visualTableRow}>
              <Text style={styles.visualTableLabel}>Details</Text>
              <View style={styles.visualTableVerticalAbsolute} />
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  setSelectedItem(item);
                  setDetailsModal(true);
                }}
              >
                <Ionicons name="document-text" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <NoTransactions />
      )}
      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  pageBackground: {
    flex: 1,
    backgroundColor: "#222222",
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
