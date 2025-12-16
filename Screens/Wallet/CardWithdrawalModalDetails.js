import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CardWithdrawalModalDetails({ visible, onClose, data }) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
                <View style={styles.bottomSheet}>

                    {/* Header */}
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Withdrawal Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sheetDivider} />

                    {/* First Name */}
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.fieldLabel}>First Name</Text>
                        <View style={styles.valueBox}>
                            <Text style={styles.valueText}>
                                {data?.credit_card_name || "-"}
                            </Text>
                        </View>
                    </View>

                    {/* Surname */}
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.fieldLabel}>Surname</Text>
                        <View style={styles.valueBox}>
                            <Text style={styles.valueText}>
                                {data?.credit_card_surname || "-"}
                            </Text>
                        </View>
                    </View>

                    {/* Card Issuing Country */}
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.fieldLabel}>Card Issuing Country</Text>
                        <View style={styles.valueBox}>
                            <Text style={styles.valueText}>
                                {data?.country_name || "-"}
                            </Text>
                        </View>
                    </View>

                    {/* Card Number */}
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.fieldLabel}>Card Number</Text>
                        <View style={styles.valueBox}>
                            <Text style={styles.valueText}>
                                {data?.card_last4 || "XXXX"}
                            </Text>
                        </View>
                    </View>

                    {/* Expiry Date */}
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.fieldLabel}>Card Expiry Date</Text>
                        <View style={styles.valueBox}>
                            <Text style={styles.valueText}>
                                {data?.card_expiry || "-"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
    sheetDivider: {
        height: 1,
        backgroundColor: "#00000033",
        marginBottom: 15,
    },

    fieldWrapper: {
        marginBottom: 14,
    },
    fieldLabel: {
        fontSize: 12,
        color: "#00000099",
        marginBottom: 6,
        fontFamily: "Montserrat_500Medium",
    },
    valueBox: {
        backgroundColor: "#00000019",
        padding: 14,
        borderRadius: 10,
    },
    valueText: {
        color: "#000000",
        fontFamily: "Montserrat_500Medium",
        fontSize: 13,
    },
});
