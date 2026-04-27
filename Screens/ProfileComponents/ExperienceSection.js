import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useEditProfileStore } from "../EditProfilePage/useEditProfileStore";
import EmptyState from "../../components/EmptyState";
import ExperienceData from "../EditProfilePage/data/ExperienceData";

const ExperienceSection = () => {
    const experiences = useEditProfileStore((state) => state.form.experiences);

    return (
        <View style={styles.attachmentRow}>
            <Text style={styles.label}>Other Experience</Text>
            {experiences.length > 0 ? (
                <View style={styles.attachmentSection}>
                    <ExperienceData isEdit={false} />
                </View>
            ) : (
                <EmptyState
                    icon="briefcase-outline"
                    title="Your Experience Section is Empty"
                    subtitle="Add your professional background to highlight your expertise."
                />
            )}
        </View>
    );
};

export default ExperienceSection;

const styles = StyleSheet.create({
    attachmentRow: {
        marginBottom: 10,
        flexDirection: 'column',
    },
    label: {
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        color: '#ffffff',
        lineHeight: 24,
    },
    attachmentSection: {
        marginBottom: 0
    },
});