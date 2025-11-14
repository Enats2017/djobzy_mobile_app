// Loading.js
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Loading = ({ color = "#ffffff", size = "large" }) => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        backgroundColor: "#222222",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Loading;
