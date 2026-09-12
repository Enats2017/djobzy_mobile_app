import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Platform,
    Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetIndicator from "./BottomSheetIndicator";
import GradientButton from "./GradientButton";
import BorderButton from "./BorderButton";
import { Ionicons } from "@expo/vector-icons";
import { useServiceGlobalStore } from "../Screens/PromoteServicesPage/ServiceGlobalStore";

const PromoteServiceOrHotelModal = ({ visible, onClose, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        activeOpacity={0.8}
                        onPress={onClose}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={22} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.logoWrap}>
                        <Image
                            source={require("../assets/images/service-hotel-image.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Select your service type</Text>
                    <View style={styles.updateBtn}>
                        <BorderButton
                            title="Hourly"
                            onPress={() => {
                                const store = useServiceGlobalStore.getState();
                                store.reset();
                                store.resetUniqueId();
                                onClose?.();
                                navigation.navigate("PromoteService")
                            }}
                            color="#303030"
                            borderColor="#303030"
                            fontSize={20}
                        />
                        <GradientButton
                            title="Hotels"
                            fontSize={20}
                            onPress={() => {
                                onClose?.();
                                navigation.navigate("CreateHotelRoom");
                            }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 24,
        paddingTop: 12,
        alignItems: "center",
        maxHeight: "80%",
    },
    closeBtn: {
        position: 'absolute',
        top: -45,
        right: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    logoWrap: {
        borderRadius: 24,
        backgroundColor: "#f9ede9",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#f0d8d2",
    },
    title: {
        fontSize: 22,
        fontFamily: "Montserrat_700Bold",
        color: "#303030",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center",
    },
    updateBtn: {
        width: "100%",
    },
});

export default PromoteServiceOrHotelModal;