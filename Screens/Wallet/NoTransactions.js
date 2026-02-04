// components/EmptyState.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function NoTransactions({
    emoji = "📄",
    title = "Nothing here yet",
    subtitle = "",
    buttonLabel = null,
    onPressButton = null,
}) {
    return (
        <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateCard}>
                {emoji && <Text style={styles.emptyStateEmoji}>{emoji}</Text>}

                <Text style={styles.emptyStateTitle}>{title}</Text>

                {subtitle ? <Text style={styles.emptyStateSubtitle}>{subtitle}</Text> : null}

                {buttonLabel && onPressButton && (
                    <TouchableOpacity style={styles.button} onPress={onPressButton}>
                        <Text style={styles.buttonText}>{buttonLabel}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyStateContainer: {
        flex:1,
        paddingVertical: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyStateCard: {
        backgroundColor: "#6464641a",
        borderRadius: 8,
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: "center",
        width: "90%",
    },
    emptyStateEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    emptyStateTitle: {
        color: "#ffffff",
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 6,
    },
    emptyStateSubtitle: {
        color: "#c3c3c3",
        fontSize: 13,
        fontFamily: "Montserrat_400Regular",
        textAlign: "center",
        lineHeight: 18,
    },
});
