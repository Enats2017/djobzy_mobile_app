import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";
import BorderButton from "../../components/BorderButton";

const DownloadModal = ({
    visible,
    onClose,
    styles,
    insets
}) => {
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 16 }]}>
                    {/* Header */}
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
                        <GradientButton title="Download Colored Print" />
                        <BorderButton
                            borderColor="#000"
                            color="#000"
                            fontSize={19}
                            title="Download Black & White Print"
                        />
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default DownloadModal;