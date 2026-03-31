import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";

const EditProfileAssets = ({ assets, updateItem, addItem, removeItem }) => {
    return (
        <View styles={styles.section}>
            <Text style={styles.label}>Assets</Text>

            <View style={styles.plusInput}>
                <TextInput
                    style={styles.innerInput}
                    placeholder="Write here"
                    placeholderTextColor="#bfbfbf"
                    value={assets[0]?.value}
                    onChangeText={(t) => updateItem("assets", assets[0].id, t)}
                />
                <TouchableOpacity onPress={() => addItem("assets")}>
                    <Entypo name="circle-with-plus" size={18} color="#ffffff" />
                </TouchableOpacity>
            </View>

            {assets.slice(1).map((item) => (
                <View key={item.id} style={styles.childRow}>
                    <TextInput
                        style={styles.innerInput}
                        placeholder="Write here"
                        placeholderTextColor="#bfbfbf"
                        value={item.value}
                        onChangeText={(t) => updateItem("assets", item.id, t)}
                    />
                    <TouchableOpacity onPress={() => removeItem("assets", item.id)}>
                        <Ionicons name="trash" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            ))}
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
    plusInput: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff1a",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 3,
        marginBottom: 10,
    },
    innerInput: {
        flex: 1,
        color: "#fff",
        fontStyle: "italic",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
    },
    childRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff1a",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: 10,
    },
});

export default EditProfileAssets;
