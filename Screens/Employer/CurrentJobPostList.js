import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import GradientButton from "../../components/GradientButton";
import LineDivider from "../../components/LineDivider";
import EmptyState from "../../components/EmptyState";

const CurrentJobPostList = ({ currentJobData, navigation, label, admin }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.infoTitle}>Current Contracts</Text>

            {currentJobData.length > 0 ? (
                currentJobData.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.heading}>{item.subject}</Text>
                        <Text style={styles.desc}>{item.description}</Text>

                        <Text style={styles.row}>
                            <Text style={styles.label}>Total Price:</Text> CAD{" "}
                            {item.fixed_minimum}
                            {"   "}
                            <Text style={styles.label}>Hourly Rate:</Text> CAD{" "}
                            {item.hour_minimum}
                        </Text>

                        <Text style={styles.row}>
                            <Text style={styles.label}>Project Length:</Text>{" "}
                            {item.expected_hour}
                        </Text>

                        <LineDivider />

                        <View style={styles.gridentbtn}>
                            {admin === 0 && (
                                <View style={styles.nameSection}>
                                    <Image source={{ uri: item.photo }} style={styles.avatar} />
                                    <Text
                                        style={styles.userName}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {item.full_name}
                                    </Text>
                                </View>
                            )}
                            <View style={admin !== 0 ? { marginLeft: 'auto' } : null}>
                                <GradientButton
                                    title="View"
                                    paddingVertical={6}
                                    paddingHorizontal={22}
                                    marginTop={0}
                                    onPress={() =>
                                        navigation.navigate("ViewCurrentJobPost", {
                                            gid: item.request_slug,
                                        })
                                    }
                                />
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                <EmptyState
                    icon="briefcase-outline"
                    title="No Active Contracts"
                    subtitle="You don’t have any active contracts yet. Once you hire a freelancer, active contracts will appear here."
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginTop: 10
    },
    infoTitle: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_700Bold",
    },
    card: {
        borderWidth: 1,
        borderColor: "#ffffff1a",
        borderRadius: 7,
        padding: 13,
        marginTop: 10,
    },
    heading: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 16,
        color: "#fff",
        marginBottom: 6,
    },
    desc: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 13,
        color: "#bfbfbf",
        marginBottom: 10,
        lineHeight: 18,
    },
    row: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,
        color: "#fff",
        marginBottom: 6,
    },
    label: {
        fontFamily: "Montserrat_500Medium",
        color: "#fff",
    },
    gridentbtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        width: '100%',
    },
    nameSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#374151',
    },
    userName: {
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
        color: '#F9FAFB',
        flex: 1
    },
});

export default CurrentJobPostList;