import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const EditProfileNumberofJobs = ({ jobs, setJobs }) => {
    return (
        <View styles={styles.section}>
            <Text style={styles.label}>Number Of Jobs</Text>

            <TextInput
                style={styles.inputBox}
                placeholder="02"
                placeholderTextColor="#bfbfbf"
                multiline
                textAlignVertical="top"
                value={jobs}
                onChangeText={setJobs}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 6,
        fontFamily: "Montserrat_700Bold",
    },
    inputBox: {
        backgroundColor: "#ffffff1a",
        borderRadius: 10,
        color: "#fff",
        fontStyle: "italic",
        padding: 13,
        marginBottom: 12,
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
    },
});

export default EditProfileNumberofJobs;
