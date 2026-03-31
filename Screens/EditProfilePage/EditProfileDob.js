import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditProfileDob = ({ dob, showPicker, openPicker, onChangeDate }) => {
    return (
        <View>
            <Text style={styles.label}>Date of Birth</Text>

            <TouchableOpacity onPress={openPicker} activeOpacity={0.8}>
                <View pointerEvents="none">
                    <TextInput
                        style={styles.inputBox}
                        placeholder="Date of Birth"
                        placeholderTextColor="#bfbfbf"
                        value={dob}
                        editable={false}
                    />
                </View>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={dob ? new Date(dob) : new Date()}
                    mode="date"
                    display="calendar"
                    onChange={onChangeDate}
                />
            )}
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

export default EditProfileDob;
