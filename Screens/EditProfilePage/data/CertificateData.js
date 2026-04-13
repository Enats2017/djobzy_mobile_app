import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEditProfileStore } from "../useEditProfileStore";
import { Feather } from "@expo/vector-icons";
import AddCertificatesModal from "../modals/AddCertificatesModal";

const CertificateData = ({ isEdit = true }) => {
    const certificates = useEditProfileStore((state) => state.form.certificates);
    const deleteItem = useEditProfileStore((s) => s.deleteItem);
    const [editingItem, setEditingItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    if (!certificates || certificates.length === 0) return null;

    const getKey = (item) => item.tempId || item.id;
    const handleDelete = (item, index) => {
        deleteItem("certificates", item, index);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {certificates.map((item, index) => (
                <View key={getKey(item)} style={styles.card}>

                    {/* Top Row */}
                    <View style={styles.topRow}>
                        <Text style={styles.year}>
                            {item.start_date} - {item.end_date}
                        </Text>

                        {isEdit && (
                            <View style={styles.rowIcon}>
                                <TouchableOpacity onPress={() => handleEdit(item)}>
                                    <Feather name="edit" size={18} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item, index)}>
                                    <Ionicons name="trash-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>
                        {item.name}
                    </Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>
                        {item.description}
                    </Text>
                </View>
            ))}

            <AddCertificatesModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditingItem(null);
                }}
                editingItem={editingItem}
            />
        </View>
    );
};

export default CertificateData;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        borderTopColor: "#fff",
        borderTopWidth: 0.5,
        paddingTop: 10,
    },
    card: {
        marginBottom: 12,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rowIcon: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    year: {
        color: "#e5e5e5",
        fontSize: 12,
        marginBottom: 2,
        fontFamily: "Montserrat_500Medium",
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
    },
    subtitle: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
    },
});