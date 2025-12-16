import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BankwithdrawalModalDetails({ visible, onClose, data }) {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Bank Transfer Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Account Holder Name</Text>
                        <TextInput
                            value={data?.account_holder_name}
                            editable={false}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Bank Name</Text>
                        <TextInput
                            value={data?.bank_name}
                            editable={false}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Account Number</Text>
                        <TextInput
                            value={`****${data?.account_last4}`}
                            editable={false}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>IFSC / SWIFT Code</Text>
                        <TextInput
                            value={data?.swift_code}
                            editable={false}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Bank Country</Text>
                        <TextInput
                            value={data?.bank_country}
                            editable={false}
                            style={styles.input}
                        />
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
