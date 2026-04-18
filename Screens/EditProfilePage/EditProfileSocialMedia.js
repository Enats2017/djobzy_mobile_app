import React, {useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddSocialMediaModal from "./modals/AddSocialMediaModal";

const EditProfileSocialMedia = () => {
    const [socialMediaModal, setSocialMediaModal] = useState(false);

    return (
        <View style={styles.section}>
            <Text style={styles.label}>Social Media</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setSocialMediaModal(true)}>
                <Text style={styles.socialText}>Add Your Social Media Accounts</Text>
                <View style={styles.circleBtn}>
                    <Ionicons name="add" size={25} color="#000" />
                </View>
            </TouchableOpacity>

            <AddSocialMediaModal
                visible={socialMediaModal}
                onClose={() => setSocialMediaModal(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section:{
        marginBottom: 15
    },
    label: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_700Bold",
    },
    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },

    socialText: {
        color: "#F4C366",
        fontSize: 16,
        fontFamily: "Montserrat_700Bold",
    },
    circleBtn: {
        width: 30,
        height: 30,
        borderRadius: 100,
        backgroundColor: "#F4C366",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default EditProfileSocialMedia;
