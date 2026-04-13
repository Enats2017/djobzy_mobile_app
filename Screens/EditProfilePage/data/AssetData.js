import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEditProfileStore } from "../useEditProfileStore";

const AssetData = ({ isEdit = true }) => {
    const assets = useEditProfileStore((state) => state.form.assets);
    const deleteItem = useEditProfileStore((s) => s.deleteItem);
    // console.log('asset data :    ', assets);

    if (!assets || assets.length === 0) return null;

    const handleDelete = (item, index) => {
        deleteItem("assets", item, index);
    };

    return (
        <View style={styles.container}>
            {assets.map((item, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.topRow}>
                        <Text style={styles.title}>{item.name}</Text>
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

export default AssetData;

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
        color: "#fff",
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
    },
});