import React, { useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";

import GroupJobPost from "../assets/images/GroupJobPost.png";
import GroupNext from "../assets/images/GroupNext.png";

const ProfileTutorial = ({ role = "employer", closeModal, onPrimaryAction }) => {
    const pagerRef = useRef(null);
    const [page, setPage] = useState(0);

    const goNext = () => {
        pagerRef.current.setPage(1);
    };

    const isEmployer = role === "employer";

    return (
        <View style={styles.modalBackground}>
            <View style={styles.modalCard}>
                <PagerView
                    ref={pagerRef}
                    style={{ flex: 1, width: "100%" }}
                    initialPage={0}
                    onPageSelected={(e) => setPage(e.nativeEvent.position)}
                >
                    {/* SLIDE 1 */}
                    <View key="1" style={styles.modalContent}>
                        <Image source={GroupNext} style={styles.modalImage} />

                        <View style={styles.modalTitleContainer}>
                            <Text style={styles.modalTitleLine}>Welcome to your</Text>
                            <Text style={styles.modalTitleLine}>
                                <Text style={styles.employerColor}>
                                    {isEmployer ? "Employer" : "Employee"}
                                </Text>{" "}
                                Profile
                            </Text>
                        </View>

                        <Text style={styles.modalDescription}>
                            {isEmployer
                                ? "A space for businesses to post jobs, showcase their company, and manage hiring with reviews and ratings."
                                : "A space where you can explore jobs, apply easily, and track your opportunities."}
                        </Text>

                        <TouchableOpacity style={styles.yellowButton} onPress={goNext}>
                            <Text style={styles.yellowButtonText}>Next</Text>
                        </TouchableOpacity>
                    </View>

                    {/* SLIDE 2 */}
                    <View key="2" style={styles.modalContent}>
                        <Image
                            source={GroupJobPost}
                            style={styles.modalImage}
                            resizeMode="contain"
                        />

                        <Text style={styles.modalTitle}>
                            Start <Text style={styles.djobzyColor}>Djobzy</Text> Journey
                        </Text>

                        <View style={styles.modalDescriptionContainer}>
                            {isEmployer ? (
                                <>
                                    <Text style={styles.modalDescriptionLine}>
                                        In order to get things done, create
                                    </Text>
                                    <Text style={styles.modalDescriptionLine}>
                                        your first job post
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.modalDescriptionLine}>
                                        Find the right opportunities
                                    </Text>
                                    <Text style={styles.modalDescriptionLine}>
                                        and apply to your first job
                                    </Text>
                                </>
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.yellowButton}
                            onPress={onPrimaryAction || closeModal}
                        >
                            <Text style={styles.yellowButtonText}>
                                {isEmployer ? "Create a Job Post" : "Promote Services"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </PagerView>

                {/* Indicators */}
                <View style={styles.slideIndicatorRow}>
                    <View
                        style={[
                            styles.slideDot,
                            page === 0 ? styles.slideDotActive : styles.slideDotInactive,
                        ]}
                    />
                    <View
                        style={[
                            styles.slideDot,
                            page === 1 ? styles.slideDotActive : styles.slideDotInactive,
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

export default ProfileTutorial;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(34,34,34,0.33)",
        justifyContent: "flex-end",
        alignItems: "center",
    },

    modalCard: {
        width: "100%",
        height: 480,
        backgroundColor: "#fffcfa",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 38,
        paddingHorizontal: 16,
        alignItems: "center",
        elevation: 10,
    },

    modalContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },

    modalImage: {
        height: 190,
        marginBottom: 28,
    },

    modalTitle: {
        fontSize: 20,
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 12,
        color: "#303030",
        textAlign: "center",
    },

    djobzyColor: {
        color: "#CB7767",
        fontFamily: "Montserrat_800ExtraBold",
    },

    modalDescription: {
        color: "#303030",
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
        textAlign: "center",
        marginBottom: 20,
    },

    yellowButton: {
        backgroundColor: "#fdbf2d",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginBottom: 15,
        marginTop: 2,
        elevation: 1,
    },

    yellowButtonText: {
        color: "#1d1d1d",
        fontSize: 18,
        fontFamily: "Montserrat_600SemiBold",
    },

    slideIndicatorRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        gap: 6,
    },

    slideDot: {
        width: 20,
        height: 3,
        borderRadius: 10,
    },

    slideDotActive: {
        backgroundColor: "#000",
    },

    slideDotInactive: {
        backgroundColor: "#c3c3c3",
    },

    modalTitleContainer: {
        alignItems: "center",
        marginBottom: 12,
    },

    modalTitleLine: {
        fontSize: 22,
        fontFamily: "Montserrat_600SemiBold",
        color: "#303030",
        textAlign: "center",
        lineHeight: 30,
    },

    employerColor: {
        color: "#cb7767",
        fontFamily: "Montserrat_800ExtraBold",
    },

    modalDescriptionContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
        paddingHorizontal: 10,
    },

    modalDescriptionLine: {
        color: "#222",
        fontSize: 15,
        fontFamily: "Montserrat_400Regular",
        textAlign: "center",
        lineHeight: 22,
    },
});