import { View, Text, StyleSheet } from "react-native";
import NoTransactions from "./NoTransactions";

export default function PromotionalExpenses({ data }) {
    const hasData = data?.data?.length > 0;
    // console.log(hasData);

    return (
        <View style={styles.pageBackground}>
            {hasData ? (
                data.data.map((item, index) => (
                    <View key={index} style={styles.visualTableWrapper}>
                        <View style={styles.visualTableRow}>
                            <Text style={styles.visualTableLabel}>Date</Text>
                            <View style={styles.visualTableVerticalAbsolute} />
                            <Text style={styles.visualTableValue}>{item.payment_date}</Text>
                        </View>
                        <View style={styles.visualTableHorizontalLine} />

                        <View style={styles.visualTableRow}>
                            <Text style={styles.visualTableLabel}>Job/Category Name</Text>
                            <View style={styles.visualTableVerticalAbsolute} />
                            {item.item_type == 1 && (
                                <Text style={styles.visualTableValue}>
                                    {item.get_user_details?.subject || 'No Subject Available'}
                                </Text>
                            )}

                            {item.item_type == 2 && (
                                <Text style={styles.visualTableValue}>
                                    {item.subservices?.[0]?.subservice_names || 'Category Promotion'}
                                </Text>
                            )}

                            {item.item_type == 3 && (
                                <Text style={styles.visualTableValue}>Card Verification</Text>
                            )}
                        </View>
                        <View style={styles.visualTableHorizontalLine} />

                        <View style={styles.visualTableRow}>
                            <Text style={styles.visualTableLabel}>Payment Method</Text>
                            <View style={styles.visualTableVerticalAbsolute} />
                            {item.payment_type == 'paypal' && (
                                <Text style={styles.visualTableValue}>Paypal</Text>
                            )}
                            {item.payment_type == 'stripe' && (
                                <Text style={styles.visualTableValue}>Credit/Debit Card</Text>
                            )}
                            {item.payment_type == 'wallet' && (
                                <Text style={styles.visualTableValue}>Wallet</Text>
                            )}
                        </View>
                        <View style={styles.visualTableHorizontalLine} />
                        <View style={styles.visualTableRow}>

                            <Text style={styles.visualTableLabel}>Status</Text>
                            <View style={styles.visualTableVerticalAbsolute} />
                            <Text style={styles.visualTableValue}>Paid</Text>
                        </View>
                        <View style={styles.visualTableHorizontalLine} />

                        <View style={styles.visualTableRow}>
                            <Text style={styles.visualTableLabel}>Amount</Text>
                            <View style={styles.visualTableVerticalAbsolute} />
                            <Text style={styles.visualTableValue}>{item.price} CAD</Text>
                        </View>
                        <View style={styles.visualTableHorizontalLine} />

                        <View style={styles.visualTableRow}>
                            <Text style={styles.visualTableLabel}>Processing Fee</Text>
                            <View style={styles.visualTableVerticalAbsolute} />
                            <Text style={styles.visualTableValue}>{item.processing_fee} CAD</Text>
                        </View>
                        <View style={styles.visualTableHorizontalLine} />

                        <View style={styles.visualTableRowLast}>
                            <Text style={styles.visualTableLabel}>ID</Text>
                            <View style={styles.visualTableVerticalAbsolute} />
                            <Text style={styles.visualTableValue}>{item.reference_id}</Text>
                        </View>
                    </View>
                ))
            ) : (
                <NoTransactions title="No Promotional Expenses yet" />
            )}
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
});
