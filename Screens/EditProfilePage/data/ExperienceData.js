import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEditProfileStore } from "../useEditProfileStore";

const ExperienceData = ({ isEdit = true }) => {
    const experiences = useEditProfileStore((state) => state.form.experiences);
    const setField = useEditProfileStore((state) => state.setField);
    const deleteItem = useEditProfileStore((s) => s.deleteItem);

    if (!experiences || experiences.length === 0) return null;

    const handleDelete = (item, index) => {
        deleteItem("experiences", item, index);
    };

    return (
        <View style={styles.section}>
            {experiences.map((item, index) => (
                <View key={index} style={styles.item}>
                    <View style={styles.topRow}>
                        <Text style={styles.title}>{item.title}</Text>

                        {isEdit && (
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleDelete(item, index)}
                            >
                                <Ionicons name="trash-outline" size={22} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.descContainer}>
                        <Text style={styles.description}>
                            {item.description}
                        </Text>
                    </View>

                </View>
            ))}
        </View>
    );
};

export default ExperienceData;

const styles = StyleSheet.create({
    section: {
        flex: 1,
        marginTop: 15,
    },

    item: {
        padding: 10,
        borderColor: "#ffffff1a",
        borderWidth: 0.7,
        borderRadius: 5,
        marginBottom: 10,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10
    },

    title: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        flex: 1,
    },

    descContainer: {
        marginTop: 4,
    },

    description: {
        color: "#c3c3c3",
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
        lineHeight: 16,
        width: "97%",
    },
});