import React, { memo } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { MaterialIcons, Octicons, Entypo } from "@expo/vector-icons";
import LineDivider from "../../components/LineDivider";

const FollowerProfileHeader = memo(({ profile, count }) => (
    <View style={styles.profileCard}>
        <View style={styles.profileinfo}>
            <View style={styles.profileRow}>
                <Image
                    source={{
                        uri: profile?.profile_image
                            ? profile.profile_image
                            : "https://via.placeholder.com/150",
                    }}
                    style={styles.avatar}
                />
                <View style={styles.profileInfoRow}>
                    <View style={styles.userNameSection}>
                        <Text style={styles.name}>{profile?.full_name}</Text>
                    </View>
                    <View style={styles.iconbox}>
                        <Octicons name="clock-fill" size={12} color="#c3c3c3c3" />
                        <Text style={styles.infoText}>GMT+05:30</Text>
                    </View>
                    <View style={styles.iconbox}>
                        <MaterialIcons name="verified" size={14} color="#c3c3c3c3" />
                        <Text style={styles.infoText}>
                            Verification Level: {profile.verification_count}/7
                        </Text>
                    </View>
                    <View style={styles.iconbox}>
                        <Entypo name="location-pin" size={14} color="#c3c3c3c3" />
                        <Text style={styles.infoText}>{profile?.address}</Text>
                    </View>
                </View>
            </View>
        </View>
        <LineDivider />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{count?.job_count}</Text>
                    <Text style={styles.statLabel}>Number of Jobs</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{count?.earned}</Text>
                    <Text style={styles.statLabel}>Money Earned</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>
                        {count?.connections?.length || 0}
                    </Text>
                    <Text style={styles.statLabel}>My Followers</Text>
                </View>
            </View>
        </ScrollView>
    </View>
));

const styles = StyleSheet.create({
    profileCard: {
        backgroundColor: "#ffffff1a",
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    profileinfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileRow: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    profileInfoRow: {
        flex: 1,
        gap: 3,
    },
    userNameSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 2,
    },
    name: {
        color: "#fff",
        fontSize: 18,
        flexShrink: 1,
        maxWidth: "90%",
        fontFamily: "Montserrat_500Medium",
        marginBottom: 7,
    },
    followname: {
        color: "#fff",
        fontSize: 18,
        maxWidth: "100%",
        fontFamily: "Montserrat_500Medium",
    },
    iconbox: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 6,
    },
    infoText: {
        color: "#c3c3c3c3",
        fontSize: 16,
        fontFamily: "Montserrat_400Regular",
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "#fff",
    },
    statsRow: {
        flexDirection: "row",
        gap: 10,
    },
    ratingsection: {
        flex: 1,
        gap: 2,
    },
    ratingrow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        maxWidth: "100%",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        gap: 8,
    },
    statBox: {
        backgroundColor: "#C97863",
        paddingVertical: 16,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: "center",
    },
    statValue: {
        color: "#fff",
        fontSize: 22,
        fontFamily: "Montserrat_700Bold",
    },
    statLabel: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        marginTop: 2,
    },
});

export default FollowerProfileHeader;