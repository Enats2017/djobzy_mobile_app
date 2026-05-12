import React, { useEffect, useState } from "react";
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    Platform,
    StatusBar,
    Text,
    ActivityIndicator,
    Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useNotifications } from "../../context/MessageNotificationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderMenuModal from "../../components/HeaderMenuModal";
import { API_URL } from "../../api/ApiUrl";

const VerificationStepHeader = ({ showMenu = true, showSearch = true }) => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleLogout = async () => {
        try {
            setSubmitting(true);
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/logout`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.status === 200) {
                await AsyncStorage.clear();
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                });
            }
        } catch (error) {
            console.log("Template API error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.left}>
                    <Image
                        source={require("../../assets/images/d_logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.right}>
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() => setMenuVisible(true)}
                    >
                        <Feather name="menu" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal visible={menuVisible} animationType="fade" transparent>
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                />
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.logoutContainer}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutLabel}>Logout</Text>
                        {submitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <MaterialIcons name="logout" size={24} color="#ffffff" />
                        )}
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: "#222222",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        zIndex: 100,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    logo: {
        width: 40,
        height: 40,
    },
    right: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconWrapper: {
        position: "relative",
        marginLeft: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#2d2d2d",
        alignItems: "center",
        justifyContent: "center",
    },
    overlay: {
        flex: 1,
        backgroundColor: "#8686861A",
    },

    modalContainer: {
        position: "absolute",
        right: 15,
        top: 60,
        width: 200,
    },
    logoutContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#E8251A",
        borderRadius: 10,
        padding: 15,
    },
    logoutLabel: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Montserrat_600SemiBold",
    },
});

export default VerificationStepHeader;
