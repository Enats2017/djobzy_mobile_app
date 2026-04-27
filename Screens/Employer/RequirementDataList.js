import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RequirementDataList = ({ data = [] }) => {
    if (!data || data.length === 0) return null;

    return (
        <View style={styles.cardContainer}>
            <Text style={styles.cardHeading}>Requirements</Text>

            <View style={styles.requirementContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.requirementItem}>
                        <View style={styles.circleNumber}>
                            <Text style={styles.circleNumberText}>
                                {index + 1}
                            </Text>
                        </View>

                        <Text style={styles.requirementText}>
                            {item.requirement}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderTopWidth: 1,
        borderTopColor: "#ffffff33",
        paddingTop: 10,
        marginBottom: 8,
    },

    cardHeading: {
        color: "#ffffff",
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 5,
        letterSpacing: 0.1,
    },
    requirementItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
        marginRight: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    circleNumber: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "#ffffff1a",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    circleNumberText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },
    requirementText: {
        fontSize: 15,
        color: "#ffffff",
        fontFamily: "Montserrat_500Medium",
    },
});

export default RequirementDataList;