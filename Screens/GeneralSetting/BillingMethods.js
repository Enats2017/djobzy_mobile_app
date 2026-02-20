import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    CheckBox,
    Text,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { Alert } from "react-native";
import {
    Ionicons,
    FontAwesome5,
    FontAwesome,
    Entypo,
} from "@expo/vector-icons";
import PaymentOption from "../../components/PaymentOption";
import Footer from "../../components/Footer";
import GradientButton from "../../components/GradientButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import Paypal from "../Wallet/PaypalWithdraw";
import CreditCard from "../Wallet/CreditCardWithdraw";
import { ScrollView } from "react-native-gesture-handler";
import QuestionMark from "../../components/QuestionMark";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";

const BillingMethods = () => {
    const [selected, setSelected] = useState("");
    const [remember, setRemember] = useState(false);
    const [paypalId, setPaypalId] = useState("");
    const [cardSaved, setCardSaved] = useState(false);
    const [savedMethod, setSavedMethod] = useState(null);
    const [editingCard, setEditingCard] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { profileData } = route.params || {};
    console.log("profiledata111", profileData);

    const fetchBillingMethod = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const response = await fetch(`${API_URL}/get-billing-method`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.data);
                setSavedMethod(data.data);
            }

        } catch (error) {
            console.log("Fetch error:", error);
        }
    };

    const bidAmount = Number(profileData?.bid_price || 0);

    const processingFee = bidAmount * 0.05;

    const TotalAmount = bidAmount + processingFee;
    const handleCardSave = async ({
        fullName,
        selectedCountry,
        cardNumber,
        expMonth,
        expYear,
    }) => {
        try {
            const token = await AsyncStorage.getItem("token");

            const response = await fetch(`${API_URL}/save-billing-method`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: 1,
                    name: fullName,
                    country: selectedCountry,
                    card_number: cardNumber,
                    expiry_month_card: expMonth,
                    expiry_year_card: expYear,
                    is_checked: 1,
                }),
            });

            const data = await response.json();
            setSelected(" ");

            if (!response.ok) {

                Alert.alert("Error", data.message || "Something went wrong");
                return;
            }

            setCardSaved(true);
            fetchBillingMethod();
            Alert.alert("Success", "Card added successfully!");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");

            const response = await fetch(`${API_URL}/delete-billing-method/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Error", data.message || "Delete failed");
                return;
            }

            Alert.alert("Success", "Deleted successfully");

            fetchBillingMethod();

        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    useEffect(() => {
        fetchBillingMethod();
    }, []);
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <PageNameHeaderBar title="Payment Methods" navigation={navigation} />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.section}>
                            <View style={{ paddingVertical: 7 }}>

                                {/* <QuestionMark title="Payment Method" /> */}
                            </View>
                            <PaymentOption
                                title="Credit / Debit Card"
                                icon={
                                    <FontAwesome name="credit-card-alt" size={20} color="#fff" />
                                }
                                selected={selected === "card"}
                                onPress={() => setSelected("card")}
                            />
                            <PaymentOption
                                title="PayPal"
                                icon={<Entypo name="paypal" size={24} color="#fff" />}
                                selected={selected === "upi"}
                                onPress={() => setSelected("upi")}
                            />

                            <PaymentOption
                                title="Pay via Wallet"
                                icon={<Ionicons name="cash-outline" size={24} color="#fff" />}
                                selected={selected === "cod"}
                                onPress={() => setSelected("cod")}
                            />
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={styles.rememberMe}
                                onPress={() => setRemember(!remember)}
                            >
                                <View
                                    style={[styles.checkbox, remember && styles.checkboxChecked]}
                                >
                                    {remember && (
                                        <Ionicons name="checkmark" size={14} color="#000" />
                                    )}
                                </View>
                                <Text style={styles.rememberText}>
                                    I hereby agree to abide by the{" "}
                                    <Text
                                        style={styles.clickText}
                                        onPress={() => {
                                            console.log("hii");
                                        }}
                                    >
                                        Terms and Conditions
                                    </Text>{" "}
                                    and Policies of Djobzy.com.
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingTop: 15 }}>
                            {selected === "card" && (
                                <CreditCard
                                    button="Save"
                                    onSubmit={handleCardSave}
                                    initialData={editingCard}
                                />
                            )}
                            {selected === "upi" && <Paypal button="Save" />}
                        </View>
                        {savedMethod && savedMethod.length > 0 && !editingCard && (
                            <View style={{ paddingTop: 20 }}>
                                <Text style={styles.currentMethodText}>Current Method</Text>
                            </View>
                        )}
                        {savedMethod && savedMethod.length > 0 && !editingCard && (
                            <View style={styles.savedCardWrapper}>
                                {savedMethod.map((item) => (
                                    <View key={item.id} style={styles.savedCard}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.savedCardTitle}>
                                                Credit / Debit Card
                                            </Text>
                                            <Text style={styles.savedCardNumber}>
                                                ({item.card_number})
                                            </Text>
                                        </View>

                                        <View style={styles.savedIconRow}>
                                            <TouchableOpacity
                                                style={styles.circleIcon}
                                                onPress={() => {
                                                    setEditingCard(item);
                                                    setSelected("card");
                                                }}
                                            >
                                                <FontAwesome name="pencil" size={16} color="#555" />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.circleIcon}
                                                onPress={() => handleDelete(item.id)}
                                            >
                                                <Ionicons name="trash-outline" size={16} color="#444" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                    </ScrollView>
                </View>
                <Footer />
            </SafeAreaView>
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222222",
        paddingHorizontal: 15,
    },

    wrapper: {
        width: "100%",
    },

    box: {
        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 8,
        height: 50,
        paddingVertical: 7,
        marginBottom: 15,
        backgroundColor: "#fff",
    },

    label: {
        flex: 1,
        paddingLeft: 15,
        fontSize: 16,
        color: "#D38979",
        fontFamily: "Montserrat_700Bold"
    },

    verticalLine: {
        width: 1,

        height: "100%",
        backgroundColor: "#0000001a",
    },

    value: {
        flex: 1,
        paddingLeft: 12,
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
        color: "#666666",

    },

    infoText: {
        fontSize: 12,
        fontFamily: "Montserrat_400Medium",
        color: "#ffffff",
        marginTop: 4,
        marginBottom: 13,
    },


    section: {
        marginBottom: 5,
    },
    row: {
        flexDirection: "column",
        flexWrap: "wrap",
        paddingHorizontal: 8,
    },
    rememberMe: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    rememberText: {
        color: "#fff",
        marginLeft: 10,
        flexShrink: 1,
        fontFamily: "Montserrat_400Regular",
        fontSize: 15,
        lineHeight: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: {
        backgroundColor: "#fff",
        borderColor: "#fff",
    },
    button: {
        paddingTop: 10,
    },
    click: {
        alignContent: "center",
    },
    clickText: {
        color: "#fff",
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,

        textDecorationLine: "underline",
    },
    paypalBox: {
        marginTop: 20,
        marginBottom: 10,
        backgroundColor: "#d9d9d91a",
        padding: 12,
        borderRadius: 10,
    },

    paypalTitle: {
        color: "#ffffff",
        fontSize: 18,
        marginBottom: 10,
        fontFamily: "Montserrat_600SemiBold",
    },

    paypalLabel: {
        color: "#ccc",
        fontSize: 16,
        marginBottom: 5,
        fontFamily: "Montserrat_600SemiBold",
        color: "#ffffff",
    },

    paypalInput: {
        backgroundColor: "#ffffff",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
    },
    summaryCard: {
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },

    summaryTitle: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 15,
        fontFamily: "Montserrat_600SemiBold",
        lineHeight: 22,
    },

    highlightText: {
        color: "#f76c6c",
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },

    summaryLabel: {
        color: "#ccc",
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
    },

    summaryValue: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
    },

    divider: {
        height: 1,
        backgroundColor: "#444",
        marginVertical: 8,
    },

    totalLabel: {
        color: "#fff",
        fontSize: 15,
        fontFamily: "Montserrat_600SemiBold",
    },

    totalValue: {
        color: "#f76c6c",
        fontSize: 16,
        fontFamily: "Montserrat_700Bold",
    },
    savedCardWrapper: {
        marginTop: 15,
    },

    savedCard: {
        width: "100%",
        backgroundColor: "#E9E9E9",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    savedCardTitle: {
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        color: "#1a1a1a",
    },

    savedCardNumber: {
        fontSize: 13,
        marginTop: 3,
        color: "#6b6b6b",
        fontFamily: "Montserrat_400Regular",
    },

    savedIconRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    circleIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#dcdcdc",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },

    currentMethodText: {
        color: "white",
        fontSize: 19

    }

});

export default BillingMethods;
