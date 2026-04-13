import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEditProfileStore } from "../useEditProfileStore";

const LanguageData = ({ isEdit = true }) => {
    const languages = useEditProfileStore((state) => state.form.languages);
    const setField = useEditProfileStore((state) => state.setField);
    const deleteItem = useEditProfileStore((s) => s.deleteItem);

    if (!languages || languages.length === 0) return null;

    const getLevelText = (level) => {
        switch (level) {
            case 1: return "Basic";
            case 2: return "Mid. Level";
            case 3: return "Fluent";
            case 4: return "Native";
            default: return "";
        }
    };

    const getWidth = (level) => {
        switch (level) {
            case 1: return "25%";
            case 2: return "50%";
            case 3: return "75%";
            case 4: return "100%";
            default: return "0%";
        }
    };

    const handleDelete = (item, index) => {
        deleteItem("languages", item, index);
    };

    return (
        <View style={styles.section}>
            {languages.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                    <View style={styles.leftContent}>
                        <View style={styles.topRow}>
                            <Text style={styles.language}>{item.language_name}</Text>
                            <Text style={styles.level}>{getLevelText(item.level)}</Text>
                        </View>
                        <View style={styles.progressBg}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: getWidth(item.level) }
                                ]}
                            />
                        </View>
                    </View>

                    {/* (Delete Icon) */}
                    {isEdit && (
                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => handleDelete(item, index)}
                        >
                            <Ionicons name="trash-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
};

export default LanguageData;

const styles = StyleSheet.create({
    section: {
        flex: 1,
        marginTop: 10,
        borderTopColor: "#fff",
        borderTopWidth: 0.5,
        paddingTop: 10,
    },

    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        gap: 10
    },

    leftContent: {
        flex: 1,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    language: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
    },

    level: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
    },

    progressBg: {
        height: 5,
        backgroundColor: "#265b49",
        borderRadius: 10,
        marginTop: 4,
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
    },
});