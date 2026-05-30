import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Pressable,
    Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import GradientButton from "./GradientButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NoJobAndServiceModal = ({
    visible,
    url,
    text,
    onClose,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 16 }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#303030" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalRow}>
                        <Image
                            source={url}
                            style={styles.modalLogo}
                        />

                        <Text style={styles.modalTitle}>{text}</Text>
                    </View>

                    <GradientButton title="Continue" onPress={onClose} />
                    <TouchableOpacity
                        style={styles.newJobButton}
                        onPress={onClose}
                    >
                        <Text style={styles.newJobButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default NoJobAndServiceModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        fontFamily: "Montserrat_600SemiBold",
    },
    modalLogo: {
        margin: "auto"
    },
    modalTitle: {
        paddingTop: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        lineHeight: 22,
        fontFamily: "Montserrat_700Bold",
        color: "#303030",
        textAlign: "center"
    },
    closeIcon: {
        fontSize: 20,
        color: "#000000",
    },
    newJobButton: {
        borderWidth: 1,
        borderColor: "#000000",
        paddingVertical: 10,
        marginTop: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    newJobButtonText: {
        color: "#000000",
        fontSize: 20,
        fontFamily: "Montserrat_600SemiBold",
    },
});