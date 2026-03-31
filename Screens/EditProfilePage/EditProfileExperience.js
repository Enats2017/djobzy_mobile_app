import React, {useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import QuestionMark from "../../components/QuestionMark";
import { tooltipMessage } from "../../components/TooltipMessage";
import { AntDesign } from "@expo/vector-icons";
import AddExperienceModal from "./modals/AddExperienceModal";

const EditProfileExperience = ({ navigation }) => {
    const [experienceModalVisible, setExperienceModalVisible] = useState(false);

    const openExperienceModal = () => setExperienceModalVisible(true);
    const handleSaveExperience = (data) => {
        console.log("Experience saved:", data);
        setExperienceModalVisible(false);
    };

    return (
        <View style={styles.section}>
            <View style={styles.label}>
                <QuestionMark title="Experience" iconColor="#fff" tooltipMessage={tooltipMessage.tooltip_provided_services} />
            </View>

            <TouchableOpacity style={styles.plusbtn} onPress={openExperienceModal}>
                <AntDesign name="plus" size={16} color="#030303" />
                <Text style={styles.plustext}>
                    Add Experience
                </Text>
            </TouchableOpacity>

            <AddExperienceModal
                visible={experienceModalVisible}
                onClose={() => setExperienceModalVisible(false)}
                onSave={handleSaveExperience}
            />
        </View>
    );
};

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
    plusbtn: {
        alignSelf: "flex-start",
        flexDirection: "row",
        gap: 5,
        backgroundColor: "#fff",
        borderRadius: 100,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    plustext: {
        color: "#030303",
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,
        lineHeight: 19
    },
});

export default EditProfileExperience;
