import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GradientButton from "../../components/GradientButton";
import LineDivider from "../../components/LineDivider";
import EmptyState from "../../components/EmptyState";

const JobPostList = ({ jobData, navigation }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.infoTitle}>My Job Posts</Text>
            {
                jobData.length > 0 ? (
                    jobData?.map((item, index) => (
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
                                <Text style={styles.row}>Proposals: {item.proposal}</Text>
                                <GradientButton
                                    title="View"
                                    paddingVertical={6}
                                    paddingHorizontal={22}
                                    marginTop={0}
                                    onPress={() =>
                                        navigation.navigate("PostJobDetails", {
                                            jobId: item.request_slug,
                                        })
                                    }
                                />
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
        alignItems: "baseline",
        justifyContent: "space-between",
    },
});

export default JobPostList;