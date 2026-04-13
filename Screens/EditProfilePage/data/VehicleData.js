import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEditProfileStore } from "../useEditProfileStore";

const VehicleData = ({ isEdit = true }) => {
    const vehicles = useEditProfileStore((state) => state.form.vehicles);
    const deleteItem = useEditProfileStore((s) => s.deleteItem);

    if (!vehicles || vehicles.length === 0) return null;

    const handleDelete = (item, index) => {
        deleteItem("vehicles", item, index);
    };

    return (
        <View style={styles.container}>
            {vehicles.map((item, index) => (
                <View key={index} style={styles.card}>

                    <View style={styles.topRow}>
                        <Text style={styles.title}>
                            {item.name}
                        </Text>

                        {isEdit && (
                            <TouchableOpacity onPress={() => handleDelete(item, index)}>
                                <Ionicons name="trash-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};

export default VehicleData;


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

    title: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
    },

    subtitle: {
        color: "#E6FFF6",
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
    },
});