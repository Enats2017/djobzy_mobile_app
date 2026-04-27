import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CopyLinkModal = ({
    visible,
    onClose,
    activeTab,
    setActiveTab,
    employeeLink,
    employerLink,
    handleCopy,
    styles,
    insets
}) => {
    const currentLink = activeTab === "employee" ? employeeLink : employerLink;
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
                        <Text style={styles.modalTitle}>Copy Link</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={26} color="#303030" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.modalSubTitle}>
                        Here you can copy a link to any of your profiles.
                    </Text>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === "employee" && styles.activeTabEmployee,
                            ]}
                            onPress={() => {
                                setActiveTab("employee");
                            }}
                        >
                            <Text
                                style={
                                    activeTab === "employee"
                                        ? styles.activeTabTextEmployee
                                        : styles.tabText
                                }
                            >
                                Employee’s Profile
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === "employer" && styles.activeTabEmployer,
                            ]}
                            onPress={() => {
                                setActiveTab("employer");
                            }}
                        >
                            <Text
                                style={
                                    activeTab === "employer"
                                        ? styles.activeTabTextEmployer
                                        : styles.tabText
                                }
                            >
                                Employer’s Profile
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.inputRow}>
                        <View style={styles.textWrap}>
                            <Text
                                style={styles.linkText}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {currentLink}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.copyBtn}
                            onPress={() =>
                                handleCopy(currentLink)
                            }
                        >
                            <Ionicons name="copy-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default CopyLinkModal;