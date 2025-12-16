import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PaypalWithdrawalModalDetails({ visible, onClose, data }) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
                <View style={styles.bottomSheet}>
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>PayPal Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.sheetDivider} />
                    <Text style={styles.sheetLabel}>PayPal</Text>
                    <View style={styles.emailBox}>
                        <Text style={styles.emailText}>
                            {data?.email}
                        </Text>
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
