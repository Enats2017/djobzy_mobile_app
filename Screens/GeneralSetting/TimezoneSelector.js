import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TimezoneSelector = ({
    timezones = [],
    selectedTimezone,
    setSelectedTimezone,
}) => {
    const [openDropdown, setOpenDropdown] = useState(false);

    const formattedTimezones = timezones.map((item) => ({
        label: `${item.timezone} ${item.gmt_difference}`,
        value: item.timezone,
    }));

    const handleSelect = (item) => {
        setSelectedTimezone(item.value);
        setOpenDropdown(false);
    };

    const selectedLabel =
        formattedTimezones.find((t) => t.value === selectedTimezone)?.label;

    return (
        <View style={styles.section}>
            <Text style={styles.label}>Timezone</Text>

            {/* Trigger */}
            <TouchableOpacity
                style={[
                    styles.dropdownTrigger,
                    openDropdown && styles.dropdownTriggerActive,
                ]}
                onPress={() => setOpenDropdown(!openDropdown)}
            >
                <Text
                    style={[
                        styles.dropdownTriggerText,
                        !selectedTimezone && styles.placeholderText,
                    ]}
                >
                    {selectedLabel || "Select Timezone"}
                </Text>

                <Ionicons
                    name={openDropdown ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#000"
                />
            </TouchableOpacity>

            {/* Dropdown List */}
            {openDropdown && (
                <View style={styles.dropdownList}>
                    <ScrollView
                        style={{ maxHeight: 200 }}
                        nestedScrollEnabled={true}   // ✅ important
                        showsVerticalScrollIndicator={true}
                    >
                        {formattedTimezones.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                style={styles.dropdownItem}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={styles.dropdownItemText}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default TimezoneSelector;

const styles = StyleSheet.create({
    section: {
        marginTop: 10,
    },
    label: {
        fontSize: 18,
        fontFamily: "Montserrat_600SemiBold",
        color: "#ffffff",
        marginBottom: 5,
    },

    dropdownTrigger: {
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
    },

    dropdownTriggerText: {
        fontSize: 14,
        color: "#1e1e1e",
        fontFamily: "Montserrat_500Medium",
    },

    placeholderText: {
        color: "#666666",
    },

    dropdownList: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginTop: 5,
        backgroundColor: "#fff",
        overflow: "hidden",
    },

    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    dropdownItemText: {
        fontSize: 14,
        color: "#1e1e1e",
        fontFamily: "Montserrat_400Regular",
    },
});