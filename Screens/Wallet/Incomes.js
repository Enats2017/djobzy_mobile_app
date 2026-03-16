import { View, Text, StyleSheet } from "react-native";
import NoTransactions from "./NoTransactions";

export default function Incomes({ data, cardVerification }) {
  const hasTransactions = data?.data?.length > 0;
  const hasCardVerification = !!cardVerification;
  // console.log(hasTransactions);

  return (
    <View style={styles.pageBackground}>
      {
        hasCardVerification && (
          <>
            <Text style={styles.sectionTitle}>Card Verification</Text>
            <View style={styles.visualTableWrapper}>
              <View style={styles.visualTableRow}>
                <Text style={styles.visualTableLabel}>Date</Text>
                <View style={styles.visualTableVerticalAbsolute} />
                <Text style={styles.visualTableValue}>{cardVerification?.created_at}</Text>
              </View>
              <View style={styles.visualTableHorizontalLine} />

              <View style={styles.visualTableRow}>
                <Text style={styles.visualTableLabel}>Income Type</Text>
                <View style={styles.visualTableVerticalAbsolute} />
                <Text style={styles.visualTableValue}>Card verification</Text>
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
                <Text style={styles.visualTableValue}>1</Text>
              </View>
              <View style={styles.visualTableHorizontalLine} />

              <View style={styles.visualTableRow}>
                <Text style={styles.visualTableLabel}>ID</Text>
                <View style={styles.visualTableVerticalAbsolute} />
                <Text style={styles.visualTableValue}>{cardVerification?.reference_id}</Text>
              </View>
            </View>
          </>
        )
      }
      {hasTransactions ? (
        <>
          <Text style={styles.sectionTitle}>Work Income</Text>
          {data.data.map((item, index) => (
            <View key={index} style={styles.visualTableWrapper}>
              <View style={styles.visualTableRow}>
                <Text style={styles.visualTableLabel}>Date</Text>
                <View style={styles.visualTableVerticalAbsolute} />
                <Text style={styles.visualTableValue}>{item.award_date}</Text>
              </View>
              <View style={styles.visualTableHorizontalLine} />

              <View style={styles.visualTableRow}>
                <Text style={styles.visualTableLabel}>Employer</Text>
                <View style={styles.visualTableVerticalAbsolute} />
                <Text style={styles.visualTableValue}>{item.full_name}</Text>
              </View>
              <View style={styles.visualTableHorizontalLine} />

              <View style={styles.visualTableRow}>
                <Text style={styles.visualTableLabel}>Job Name</Text>
                <View style={styles.visualTableVerticalAbsolute} />
                <Text style={styles.visualTableValue}>{item.subject}</Text>
              </View>
              <View style={styles.visualTableHorizontalLine} />

              <View style={styles.visualTableRow}>
                <Text style={styles.visualTableLabel}>Status</Text>
                <View style={styles.visualTableVerticalAbsolute} />
                <Text style={styles.visualTableValue}>{item.payment_release_status == 0 ? "In Escrow Account" : "Completed"}</Text>
              </View>
              <View style={styles.visualTableHorizontalLine} />

              <View style={styles.visualTableRow}>
                <Text style={styles.visualTableLabel}>Amount</Text>
                <View style={styles.visualTableVerticalAbsolute} />
                <Text style={styles.visualTableValue}>{item.actual_price_amount}</Text>
              </View>
              <View style={styles.visualTableHorizontalLine} />

              <View style={styles.visualTableRowLast}>
                <Text style={styles.visualTableLabel}>ID</Text>
                <View style={styles.visualTableVerticalAbsolute} />
                <Text style={styles.visualTableValue}>{item.order_reference_id}</Text>
              </View>
            </View>
          ))}
        </>
      ) : !hasCardVerification ? (
        <NoTransactions />
      ) : null}
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
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginVertical: 10,
    color: "#fff"
  }
});
