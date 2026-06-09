// components/EmptyState.js
import React from "react";
import { Image } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function NoConversation() {
    return (
        <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateCard}>
                <Image
                    source={require("../../../assets/images/no-conversation.png")}
                    style={{
                        // width: 130,
                        // height: 110,
                        marginBottom: 10,
                        resizeMode: "contain",
                    }}
                />
                <Text style={styles.emptyStateTitle}>No Conversation Found</Text>
                <Text style={styles.emptyStateSubtitle}>Start a conversation with someone from your network.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyStateContainer: {
        flex: 1,
        paddingVertical: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyStateCard: {
        alignItems: "center",
        width: "90%",
    },
    emptyStateTitle: {
        color: "#ffffff",
        fontSize: 20,
        fontFamily: "Montserrat_600SemiBold",
    },
    emptyStateSubtitle: {
        color: "#ffffff",
        fontSize: 13,
        fontFamily: "Montserrat_400Regular",
        textAlign: "center",
        lineHeight: 18,
    },
});
