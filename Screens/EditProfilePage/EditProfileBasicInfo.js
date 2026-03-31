import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import EditProfileSocialMedia from "./EditProfileSocialMedia";
import QuestionMark from "../../components/QuestionMark";
import { tooltipMessage } from "../../components/TooltipMessage";

const EditProfileBasicInfo = ({
    userType,
    profileTitle,
    setProfileTitle,
    description,
    setDescription,
}) => {
    const isEmployer = userType === "employer";

    return (
        <View style={styles.section}>
            <View style={styles.label}>
                <QuestionMark title="Profile Title" iconColor="#fff" tooltipMessage={tooltipMessage.employee_profile_title_tooltip} />
            </View>
            <TextInput
                style={styles.inputBox}
                placeholder={
                    isEmployer
                        ? "Looking for skilled developers..."
                        : "I am a UI/UX designer with 10+ years experience"
                }
                placeholderTextColor="#bfbfbf"
                multiline
                textAlignVertical="top"
                value={profileTitle}
                onChangeText={setProfileTitle}
            />

            {/* Social Media Card */}
            <EditProfileSocialMedia />

            {/* DESCRIPTION */}
            <View style={styles.label}>
                <QuestionMark title={isEmployer ? "About Company" : "About Me"} iconColor="#fff" tooltipMessage={tooltipMessage.employee_profile_title_tooltip} />
            </View>

            <TextInput
                style={styles.desBox}
                placeholder={
                    isEmployer
                        ? "Describe your company and hiring needs..."
                        : "Describe your experience and skills..."
                }
                placeholderTextColor="#bfbfbf"
                multiline
                value={description}
                onChangeText={setDescription}
            />
        </View>
    );
};

export default EditProfileBasicInfo;

const styles = StyleSheet.create({
    section: {
        marginTop: 15,
    },
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
        marginBottom: 15,
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
    },
    desBox: {
        backgroundColor: "#ffffff1a",
        borderRadius: 10,
        color: "#c3c3c3",
        padding: 10,
        fontSize: 14,
        fontStyle: "italic",
        height: 158,
        fontFamily: "Montserrat_500Medium",
        textAlignVertical: "top",
        marginBottom: 15,
    },
});