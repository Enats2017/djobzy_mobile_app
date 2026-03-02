import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const FilterDropdown = ({
    visible,
    options = [],
    selectedValue,
    onSelect,
    onClose,
}) => {
    if (!visible) return null;

    return (
        <>
            {/* Overlay */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            />

            {/* Dropdown */}
            <View style={styles.dropdownWrapper}>
                <View style={styles.dropdownContainer}>
                    {options.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.option,
                                index === options.length - 1 && { borderBottomWidth: 0 },
                            ]}
                            onPress={() => {
                                onSelect(item);
                                onClose();
                            }}
                        >
                            <Text
                                style={[
                                    styles.dropdownText,
                                    selectedValue === item && styles.selectedText,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </>
    );
};

export default FilterDropdown;

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 998,
        elevation: 5,
    },

    dropdownWrapper: {
        position: "absolute",
        top: 45,
        right: 16,
        zIndex: 999,
        elevation: 10,
    },

    dropdownContainer: {
        width: 140,
        backgroundColor: "#fff",
        borderRadius: 4,
        overflow: "hidden",
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
    },

    option: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
    },

    dropdownText: {
        fontFamily: "Montserrat_500Medium",
        fontSize: 14,
        color: "#000",
    },
    dropdownWrapper: {
        position: "absolute",
        top: 45,
        right: 16,
        zIndex: 9999,
        elevation: 20,
    },
});