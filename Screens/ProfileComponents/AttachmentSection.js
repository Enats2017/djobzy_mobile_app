import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AttachmentData from "../EditProfilePage/data/AttachmentData";
import { useEditProfileStore } from "../EditProfilePage/useEditProfileStore";
import EmptyState from "../../components/EmptyState";

const AttachmentSection = () => {
    const attachments = useEditProfileStore((state) => state.form.attachments);

    return (
        <View style={styles.attachmentRow}>
            <Text style={styles.label}>Attachments</Text>
            {attachments.length > 0 ? (
                <View style={styles.attachmentSection}>
                    <AttachmentData isEdit={false} />
                </View>
            ) : (
                <EmptyState
                    icon="attach-outline"
                    title="No Attachments"
                    subtitle="Attachments will appear here once added."
                />
            )}
        </View>
    );
};

export default AttachmentSection;

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
        marginTop: 10,
        marginBottom: 0
    },
});