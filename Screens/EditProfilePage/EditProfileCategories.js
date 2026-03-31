import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import QuestionMark from "../../components/QuestionMark";
import { tooltipMessage } from "../../components/TooltipMessage";

const EditProfileCategory = ({ category }) => {
    const [showAllCategories, setShowAllCategories] = useState(false);
    const displayedCategories = showAllCategories ? category : category?.slice(0, 5);

    return (
        <View style={styles.section}>
            {/* TITLE */}
            <View style={styles.label}>
                <QuestionMark title="Employee Category" iconColor="#fff" tooltipMessage={tooltipMessage.tooltip_involved_category} />
            </View>

            <View style={styles.pillsWrapper}>
                <TouchableOpacity
                    style={styles.addBtn}
                // onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="add" size={18} color="#000" />
                    <Text style={styles.addText}>Add Category</Text>
                </TouchableOpacity>

                {displayedCategories.map((item) => (
                    <View key={item.subid} style={styles.categoryPill}>
                        <Text style={styles.categoryText}>{item.subname}</Text>

                        <TouchableOpacity
                            onPress={() =>
                                handleOpenDelete(item.service_id, item.subname)
                            }
                        >
                            <Ionicons
                                name="close"
                                size={16}
                                color="#fff"
                                style={{ marginLeft: 6 }}
                            />
                        </TouchableOpacity>
                    </View>
                ))}
                {category.length > 5 && (
                    <TouchableOpacity
                        onPress={() => setShowAllCategories((prev) => !prev)}
                        style={styles.showMoreBtn}
                    >
                        <Text style={styles.showMoreText}>
                            {showAllCategories ? "Show Less" : "Show More"}
                        </Text>

                        <Ionicons
                            name={showAllCategories ? "chevron-up" : "chevron-down"}
                            size={14}
                            color="#000"
                            style={{ marginLeft: 5 }}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default EditProfileCategory;

const styles = StyleSheet.create({
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 6,
        fontFamily: "Montserrat_700Bold",
    },
    pillsWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },

    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffff",
        paddingVertical: 5,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 8,
    },
    addText: {
        color: "#000",
        marginLeft: 4,
        fontSize: 14,
    },
    categoryPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff33",
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginBottom: 4,
    },
    categoryText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
    },
    showMoreBtn: {
        marginTop: 10,
        paddingVertical: 7.5,
        paddingHorizontal: 12,
        backgroundColor: "#ececec",
        borderRadius: 20,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
    },

    showMoreText: {
        fontSize: 12,
        fontFamily: "Montserrat_500Medium",
        color: "#000",
    },

});