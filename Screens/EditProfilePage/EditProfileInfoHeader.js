import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";

import {
    MaterialIcons,
    Octicons,
    Entypo,
    Ionicons,
    FontAwesome,
} from "@expo/vector-icons";

import EditProfileUpdatePhoto from "./EditProfileUpdatePhoto";
import LineDivider from "../../components/LineDivider";
import { useEditProfileStore } from "./useEditProfileStore";

const EditProfileInfoHeader = ({ navigation }) => {
    const profile = useEditProfileStore((state) => state.profile);
    const photoUri = useEditProfileStore((state) => state.photoUri);
    const category = useEditProfileStore((state) => state.category);
    const setPhotoUri = useEditProfileStore((state) => state.setPhotoUri);
    const userAdmin = useEditProfileStore((state) => state.form.userAdmin);
    const statBoxBgColor = userAdmin === 2 ? "#C97863" : "#46A282";

    return (
        <>
            <View style={styles.profileinfo}>
                <View style={styles.profileRow}>

                    {/* Profile Photo */}
                    <EditProfileUpdatePhoto
                        photoUri={photoUri}
                        setPhotoUri={setPhotoUri}
                    />

                    <View style={styles.profileInfoRow}>
                        <View style={styles.userNameSection}>
                            <Text style={styles.name}>
                                {profile?.editprofile?.full_name}
                            </Text>
                        </View>

                        <View style={styles.iconbox}>
                            <MaterialIcons name="verified" size={14} color="#c3c3c3c3" />
                            <Text style={styles.infoText}>
                                Verification Level:{" "}
                                {profile?.editprofile?.verification_count}/7
                            </Text>
                        </View>

                        {profile?.timezone && (
                            <View style={styles.iconbox}>
                                <Octicons name="clock-fill" size={12} color="#c3c3c3c3" />
                                <Text style={styles.infoText}>
                                    {profile?.timezone?.user_timezone}
                                </Text>
                            </View>
                        )}

                        <View style={styles.iconbox}>
                            <Entypo name="location-pin" size={14} color="#c3c3c3c3" />
                            <Text style={styles.infoText}>
                                {profile?.editprofile?.address}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <LineDivider />
            {/* Action Buttons */}
            <View style={styles.iconRow}>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="copy" size={20} color="#ffffff" />
                    <Text style={styles.iconText}>Copy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn}>
                    <FontAwesome name="share-square-o" size={20} color="#ffffff" />
                    <Text style={styles.iconText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="download" size={20} color="#ffffff" />
                    <Text style={styles.iconText}>Download</Text>
                </TouchableOpacity>

                {userAdmin === 0 && (
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() =>
                            navigation.navigate("ProfileBoostPage", {
                                categories: category,
                            })
                        }
                    >
                        <Ionicons name="rocket" size={20} color="#ffffff" />
                        <Text style={styles.iconText}>Boost</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Stats */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: statBoxBgColor }]}>
                        <Text style={styles.statValue}>{profile?.count}</Text>
                        <Text style={styles.statLabel}>Number of Jobs</Text>
                    </View>

                    <View style={[styles.statBox, { backgroundColor: statBoxBgColor }]}>
                        <Text style={styles.statValue}>{profile?.earned}</Text>
                        <Text style={styles.statLabel}>
                            {userAdmin === 2 ? "Money spent" : "Money Earned"}
                        </Text>
                    </View>

                    <View style={[styles.statBox, { backgroundColor: statBoxBgColor }]}>
                        <Text style={styles.statValue}>
                            {profile?.followedUsers?.length}
                        </Text>
                        <Text style={styles.statLabel}>My Followers</Text>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    profileinfo: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },
    profileInfoRow: {
        flex: 1,
        gap: 2,
    },

    userNameSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    name: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Montserrat_500Medium",
        marginBottom: 7,
    },
    iconbox: {
        flexDirection: "row",
        gap: 6,
        alignItems: "baseline",
        flexWrap: "wrap",
    },
    infoText: {
        color: "#c3c3c3c3",
        fontSize: 16,
        width: "78%",
        fontFamily: "Montserrat_400Regular",
    },
    iconRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    iconBtn: {
        alignItems: "center",
    },
    iconText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        marginTop: 5,
    },
    statsRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 18,
    },
    sectionLabel: {
        color: "#ffffff",
        fontSize: 16,
        marginBottom: 6,
        fontFamily: "Montserrat_700Bold",
    },
    statBox: {
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

export default EditProfileInfoHeader;