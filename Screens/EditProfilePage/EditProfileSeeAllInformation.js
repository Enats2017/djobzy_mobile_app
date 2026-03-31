import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import QuestionMark from "../../components/QuestionMark";
import { tooltipMessage } from "../../components/TooltipMessage";

// Modals
import DateOfBirthModal from "./modals/DateOfBirthModal";
import AddLanguageModal from "./modals/AddLanguageModal";
import AddEducationModal from "./modals/AddEducationModal";
import AddAssetsModal from "./modals/AddAssetsModal";
import AddVehicleModal from "./modals/AddVehicleModal";
import AddLicensesModal from "./modals/AddLicensesModal";
import AddCertificatesModal from "./modals/AddCertificatesModal";

export default function EditProfileSeeAllInformation ({ navigation }) {
    const [seeAllOpen, setSeeAllOpen] = useState(false);

    // Modal visibility states
    const [dobModalVisible, setDobModalVisible] = useState(false);
    const [ageVisible, setAgeVisible] = useState(true);
    const [moneyVisible, setMoneyVisible] = useState(true);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [educationModalVisible, setEducationModalVisible] = useState(false);
    const [assetsModalVisible, setAssetsModalVisible] = useState(false);
    const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
    const [licensesModalVisible, setLicensesModalVisible] = useState(false);
    const [certificatesModalVisible, setCertificatesModalVisible] = useState(false);

    // Handlers
    const handleAgeAdd = () => setDobModalVisible(true);
    const handleAgeVisibility = () => setAgeVisible(prev => !prev);
    const handleMoneyVisibility = () => setMoneyVisible(prev => !prev);
    const openLanguageModal = () => setLanguageModalVisible(true);
    const openEducationModal = () => setEducationModalVisible(true);
    const openAssetsModal = () => setAssetsModalVisible(true);
    const openVehicleModal = () => setVehicleModalVisible(true);
    const openLicensesModal = () => setLicensesModalVisible(true);
    const openCertificatesModal = () => setCertificatesModalVisible(true);

    // Save handlers — replace console.log with your API calls
    const handleSaveDob = (date) => {
        console.log("DOB saved:", date);
        setDobModalVisible(false);
    };

    const handleSaveLanguage = (language, level) => {
        console.log("Language saved:", language, level);
        setLanguageModalVisible(false);
    };

    const handleSaveEducation = (data) => {
        console.log("Education saved:", data);
        setEducationModalVisible(false);
    };

    const handleSaveAssets = (data) => {
        console.log("Asset saved:", data);
        setAssetsModalVisible(false);
    };

    const handleSaveVehicle = (data) => {
        console.log("Vehicle saved:", data);
        setVehicleModalVisible(false);
    };

    const handleSaveLicenses = (data) => {
        console.log("License saved:", data);
        setLicensesModalVisible(false);
    };

    const handleSaveCertificates = (data) => {
        console.log("Certificate saved:", data);
        setCertificatesModalVisible(false);
    };

    return (
        <View style={styles.body}>
            <TouchableOpacity
                style={styles.header}
                onPress={() => setSeeAllOpen((prev) => !prev)}
                activeOpacity={0.85}
            >
                <Text style={styles.headerText}>See All Information</Text>
                <Ionicons
                    name={seeAllOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#fff"
                />
            </TouchableOpacity>

            {seeAllOpen && (
                <View style={styles.body}>
                    {/* Age */}
                    <View style={styles.row}>
                        <View style={styles.leftSection}>
                            <MaterialIcons
                                name="cake"
                                size={22}
                                color="#fff"
                                style={styles.leftIcon}
                            />
                            <Text style={styles.label}>Age</Text>
                        </View>
                        <View style={styles.rightSection}>
                            <TouchableOpacity
                                style={styles.circleBtn}
                                onPress={handleAgeAdd}
                            >
                                <Ionicons name="add" size={25} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.circleBtn}
                                onPress={handleAgeVisibility}
                            >
                                <Ionicons
                                    name={ageVisible ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color="#000"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Money Earned */}
                    <View style={styles.row}>
                        <View style={styles.leftSection}>
                            <Text style={styles.cadLabel}>CAD</Text>
                            <Text style={styles.label}>Money Earned</Text>
                        </View>
                        <View style={styles.rightSection}>
                            <Text style={styles.value}>200K</Text>
                            <TouchableOpacity
                                style={styles.circleBtn}
                                onPress={handleMoneyVisibility}
                            >
                                <Ionicons
                                    name={moneyVisible ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color="#000"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Number of Jobs */}
                    <TouchableOpacity style={styles.row} activeOpacity={0.85}>
                        <View style={styles.leftSection}>
                            <Ionicons
                                name="briefcase-outline"
                                size={22}
                                color="#fff"
                                style={styles.leftIcon}
                            />
                            <Text style={styles.label}>Number of Jobs</Text>
                        </View>
                        <Text style={styles.value}>2</Text>
                    </TouchableOpacity>

                    {/* Languages */}
                    <View style={styles.row}>
                        <View style={styles.leftSection}>
                            <Ionicons
                                name="language-outline"
                                size={22}
                                color="#fff"
                                style={styles.leftIcon}
                            />
                            <Text style={styles.label}>Languages</Text>
                        </View>
                        <TouchableOpacity style={styles.circleBtn} onPress={openLanguageModal}>
                            <Ionicons name="add" size={25} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Education */}
                    <View style={styles.row}>
                        <View style={styles.leftSection}>
                            <Ionicons
                                name="book-outline"
                                size={22}
                                color="#fff"
                                style={styles.leftIcon}
                            />
                            <Text style={styles.label}>Education</Text>
                        </View>
                        <TouchableOpacity style={styles.circleBtn} onPress={openEducationModal}>
                            <Ionicons name="add" size={25} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Assets and software programs */}
                    <View style={styles.row}>
                        <View style={styles.leftSection}>
                            <Ionicons
                                name="construct-outline"
                                size={22}
                                color="#fff"
                                style={styles.leftIcon}
                            />
                            <View style={styles.label}>
                                <QuestionMark
                                    title="Assets and software programs"
                                    iconColor="#fff"
                                    textFamily="Montserrat_500Medium"
                                    tooltipMessage={tooltipMessage.tooltip_asset}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.circleBtn} onPress={openAssetsModal}>
                            <Ionicons name="add" size={25} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Vehicle */}
                    <View style={styles.row}>
                        <View style={styles.leftSection}>
                            <Ionicons
                                name="car-outline"
                                size={22}
                                color="#fff"
                                style={styles.leftIcon}
                            />
                            <View style={styles.label}>
                                <QuestionMark
                                    title="Vehicle"
                                    iconColor="#fff"
                                    textFamily="Montserrat_500Medium"
                                    tooltipMessage={tooltipMessage.tooltip_Vehicle}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.circleBtn} onPress={openVehicleModal}>
                            <Ionicons name="add" size={25} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Licenses */}
                    <View style={styles.row}>
                        <View style={styles.leftSection}>
                            <Ionicons
                                name="card-outline"
                                size={22}
                                color="#fff"
                                style={styles.leftIcon}
                            />
                            <View style={styles.label}>
                                <QuestionMark
                                    title="Licenses"
                                    iconColor="#fff"
                                    textFamily="Montserrat_500Medium"
                                    tooltipMessage={tooltipMessage.tooltip_licenses}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.circleBtn} onPress={openLicensesModal}>
                            <Ionicons name="add" size={25} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Certificates */}
                    <View style={styles.row}>
                        <View style={styles.leftSection}>
                            <Ionicons
                                name="ribbon-outline"
                                size={22}
                                color="#fff"
                                style={styles.leftIcon}
                            />
                            <View style={styles.label}>
                                <QuestionMark
                                    title="Certificates"
                                    iconColor="#fff"
                                    textFamily="Montserrat_500Medium"
                                    tooltipMessage={tooltipMessage.tooltip_certificate}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.circleBtn} onPress={openCertificatesModal}>
                            <Ionicons name="add" size={25} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* ── Modals ── */}
            <DateOfBirthModal
                visible={dobModalVisible}
                onClose={() => setDobModalVisible(false)}
                onSave={handleSaveDob}
            />

            <AddLanguageModal
                visible={languageModalVisible}
                onClose={() => setLanguageModalVisible(false)}
                onSave={handleSaveLanguage}
            />

            <AddEducationModal
                visible={educationModalVisible}
                onClose={() => setEducationModalVisible(false)}
                onSave={handleSaveEducation}
            />

            <AddAssetsModal
                visible={assetsModalVisible}
                onClose={() => setAssetsModalVisible(false)}
                onSave={handleSaveAssets}
            />

            <AddVehicleModal
                visible={vehicleModalVisible}
                onClose={() => setVehicleModalVisible(false)}
                onSave={handleSaveVehicle}
            />

            <AddLicensesModal
                visible={licensesModalVisible}
                onClose={() => setLicensesModalVisible(false)}
                onSave={handleSaveLicenses}
            />

            <AddCertificatesModal
                visible={certificatesModalVisible}
                onClose={() => setCertificatesModalVisible(false)}
                onSave={handleSaveCertificates}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        marginTop: 16,
    },
    header: {
        // height: 48,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 10,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
    },
    body: {
        marginTop: 10,
        gap: 8,
    },
    row: {
        backgroundColor: "#43A37A",
        borderRadius: 8,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8
    },
    leftSection: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        // paddingRight: 8,
        gap: 8
    },
    label: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_500Medium',
        flexShrink: 1,
    },
    cadLabel: {
        color: "#fff",
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        flexShrink: 1,
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    value: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "Montserrat_700Bold",
    },
    circleBtn: {
        width: 30,
        height: 30,
        borderRadius: 100,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    infoIcon: {
        marginLeft: 4,
    },
});
