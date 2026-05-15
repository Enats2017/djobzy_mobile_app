import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";
import BorderButton from "../../components/BorderButton";
import { useNotifications } from "../../context/MessageNotificationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import { toastError } from "../../utils/toast";
import * as Linking from "expo-linking";

const DownloadModal = ({ visible, onClose, styles, insets }) => {
    const { admin } = useNotifications();
    const [loading, setLoading] = useState(null);

    const handleSharePdf = async (type) => {
        try {
            setLoading(type);
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_URL}/download-pdf`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ type }),
            });
            const data = await response.json();
            if (data?.url) {
                const profileUrl = `${data.url}?pt=${token}`;
                Linking.openURL(profileUrl);
            } else {
                console.log("No URL found");
                toastError(data?.message || "Unable to generate PDF. Please try again later.");
            }
        } catch (error) {
            console.log("PDF ERROR:", error);
            toastError("An unexpected error occurred while opening the PDF. Please check your internet connection and try again.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View
                    style={[
                        styles.modalContainer,
                        { paddingBottom: insets.bottom + 16 },
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Download PDF</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={26} color="#303030" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.modalSubTitle}>
                        Please download a live PDF-version of your Profile where you can
                        present your great work experience along with the reviews,
                        verifications and all the other unique aspects of your service.
                    </Text>

                    <View style={styles.button}>
                        <GradientButton
                            title="Download Colored Print"
                            onPress={() => handleSharePdf(1)}
                            disabled={loading !== null && loading === 1}
                            loading={loading === 1}
                        />

                        <BorderButton
                            borderColor="#000"
                            color="#000"
                            fontSize={19}
                            title="Download Black & White Print"
                            onPress={() => handleSharePdf(2)}
                            disabled={loading !== null && loading === 2}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DownloadModal;