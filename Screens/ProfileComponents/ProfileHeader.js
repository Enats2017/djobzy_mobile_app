import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
} from "react-native";

import {
    MaterialIcons,
    Octicons,
    Entypo,
    Ionicons,
    FontAwesome,
    Feather
} from "@expo/vector-icons";

import LineDivider from "../../components/LineDivider";
import { useEditProfileStore } from "../EditProfilePage/useEditProfileStore";
import SocialMediaLinks from "../../components/SocialMediaLinks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CopyLinkModal from "./CopyLinkModal";
import DownloadModal from "./DownloadModal";

const ProfileHeader = ({
    navigation,
    socialLinks,
    employeeLink,
    employerLink,
    onCopy,
    onShare,
    initialActive = "employee",
    job = []
}) => {
    const profile = useEditProfileStore((state) => state.profile);
    const userAdmin = useEditProfileStore((state) => state.form.userAdmin);
    const statBoxBgColor = userAdmin === 2 ? "#C97863" : "#46A282";
    const [copyModal, setCopyModal] = useState(false);
    const [downloadModal, setDownloadModal] = useState(false);
    const [activeTab, setActiveTab] = useState(initialActive);
    const insets = useSafeAreaInsets();

    return (
        <>
            <View style={styles.profileinfo}>
                <View style={styles.profileRow}>
                    <Image
                        source={{
                            uri:
                                profile?.editprofile?.photo ||
                                "https://randomuser.me/api/portraits/women/44.jpg",
                        }}
                        style={styles.avatar}
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

                        {profile?.timezone?.user_timezone && (
                            <View style={styles.iconbox}>
                                <Octicons name="clock-fill" size={12} color="#c3c3c3c3" />
                                <Text style={styles.infoText}>
                                    {profile?.timezone?.user_timezone}
                                </Text>
                            </View>
                        )}

                        {profile?.editprofile?.address && (
                            <View style={styles.iconbox}>
                                <Entypo name="location-pin" size={14} color="#c3c3c3c3" />
                                <Text style={styles.infoText}>
                                    {profile?.editprofile?.address}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <LineDivider />

            {/* Action Buttons */}
            <View style={styles.iconRow}>
                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => setCopyModal(true)}
                >
                    <Ionicons name="copy" size={20} color="#ffffff" />
                    <Text style={styles.iconText}>Copy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={onShare}
                >
                    <FontAwesome
                        name="share-square-o"
                        size={20}
                        color="#ffffff"
                    />
                    <Text style={styles.iconText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => setDownloadModal(true)}
                >
                    <MaterialIcons name="download" size={20} color="#ffffff" />
                    <Text style={styles.iconText}>Download</Text>
                </TouchableOpacity>

                {userAdmin === 0 && (
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() =>
                            navigation.navigate("ProfileBoostPage", {
                                categories: job,
                            })
                        }
                    >
                        <Ionicons name="rocket" size={20} color="#ffffff" />
                        <Text style={styles.iconText}>Boost</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => navigation.navigate("ProfileEditPage")}
                >
                    <Feather name="edit-3" size={20} color="#fff" />
                    <Text style={styles.iconText}>Edit</Text>
                </TouchableOpacity>
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

            <SocialMediaLinks socialLinks={socialLinks} />

            <CopyLinkModal
                visible={copyModal}
                onClose={() => setCopyModal(false)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                employeeLink={employeeLink}
                employerLink={employerLink}
                handleCopy={onCopy}
                styles={styles}
                insets={insets}
            />

            <DownloadModal
                visible={downloadModal}
                onClose={() => setDownloadModal(false)}
                styles={styles}
                insets={insets}
            />
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
    avatar: {
        width: 80,
        height: 80,
        borderWidth: 1.5,
        borderColor: "#c3c3c3",
        borderRadius: 60,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#fff",
        width: "100%",
        paddingVertical: 25,
        paddingHorizontal: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    modalTitle: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 18,
        color: "#303030",
    },
    modalSubTitle: {
        fontSize: 14,
        color: "#303030",
        marginBottom: 18,
        fontFamily: "Montserrat_400Regular",
    },
    tabContainer: {
        flexDirection: "row",
        borderColor: "#c5c5c591",
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 15,
    },

    tab: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14,
    },
    tabText: {
        color: "#c3c3c3",
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
    },

    activeTabEmployee: {
        backgroundColor: "#46A282",
        padding: 10,
        outlineColor: "#46A282",
        outlineWidth: 1,
        borderRadius: 10,
    },
    activeTabEmployer: {
        backgroundColor: "#FABB05",
        padding: 10,
        outlineColor: "#FABB05",
        outlineWidth: 1,
        borderRadius: 10,
    },

    activeTabTextEmployee: {
        color: "#ffff",
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 16,
    },
    activeTabTextEmployer: {
        color: "#303030",
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 16,
    },
    inputRow: {
        backgroundColor: "#EFEFEF",
        borderColor: "#000000",
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textWrap: {
        flex: 1,
    },
    linkText: {
        paddingHorizontal: 5,
        color: "#000",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        paddingHorizontal: 10,
    },
    copyBtn: {
        backgroundColor: "#CC6D5D",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        outlineColor: "#CC6D5D",
        outlineWidth: 1.3,
        alignItems: "center",
    },
});

export default ProfileHeader;