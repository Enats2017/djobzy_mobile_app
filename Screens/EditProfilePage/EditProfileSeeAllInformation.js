import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
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
import { useEditProfileStore } from "./useEditProfileStore";
import HideShowConfirmModal from "./modals/HideShowConfirmModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import { toastError, toastSuccess } from "../../utils/toast";
import HideShowMoneyModal from "./modals/HideShowMoneyModal";
import LanguageData from "./data/LanguageData";
import AssetData from "./data/AssetData";
import VehicleData from "./data/VehicleData";
import EducationData from "./data/EducationData";
import LicenseData from "./data/LicenseData";
import CertificateData from "./data/CertificateData";
import { useNotifications } from "../../context/MessageNotificationContext";
import Map from "../../components/Map";

export default function EditProfileSeeAllInformation({ navigation, isEdit = true }) {
    const { admin } = useNotifications();
    const [seeAllOpen, setSeeAllOpen] = useState(false);
    const [hideShowModal, setHideShowModal] = useState(false);
    const [hideShowLoading, setHideShowLoading] = useState(false);
    const [hideShowMoneyModal, setHideShowMoneyModal] = useState(false);
    const [hideShowMoneyLoading, setHideShowMoneyLoading] = useState(false);
    const profile = useEditProfileStore((state) => state.profile);
    const years = useEditProfileStore((state) => state.form.years);
    const ageShowStatus = useEditProfileStore((state) => state.form.ageShowStatus);
    const moneyShowStatus = useEditProfileStore((state) => state.form.moneyShowStatus);
    const languages = useEditProfileStore((state) => state.form.languages);
    const education = useEditProfileStore((state) => state.form.education);
    const assets = useEditProfileStore((state) => state.form.assets);
    const vehicles = useEditProfileStore((state) => state.form.vehicles);
    const licenses = useEditProfileStore((state) => state.form.licenses);
    const certificates = useEditProfileStore((state) => state.form.certificates);
    const setField = useEditProfileStore((state) => state.setField);
    const bgColor = admin === 2 ? "#C97863" : "#46A282";
    const address = profile?.editprofile || [];
    const latitude = address?.latitude ? parseFloat(address.latitude) : null;
    const longitude = address?.longitude ? parseFloat(address.longitude) : null;
    const userAddress = address?.address || "";

    // console.log('admin ', latitude);
    // console.log('admin ', longitude);
    // console.log('admin ', userAddress);
    // console.log('admin ', admin);
    // Modal visibility states
    const [dobModalVisible, setDobModalVisible] = useState(false);
    const [moneyVisible, setMoneyVisible] = useState(true);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [educationModalVisible, setEducationModalVisible] = useState(false);
    const [assetsModalVisible, setAssetsModalVisible] = useState(false);
    const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
    const [licensesModalVisible, setLicensesModalVisible] = useState(false);
    const [certificatesModalVisible, setCertificatesModalVisible] = useState(false);

    // Handlers
    const handleAgeAdd = () => setDobModalVisible(true);
    const openLanguageModal = () => setLanguageModalVisible(true);
    const openEducationModal = () => setEducationModalVisible(true);
    const openAssetsModal = () => setAssetsModalVisible(true);
    const openVehicleModal = () => setVehicleModalVisible(true);
    const openLicensesModal = () => setLicensesModalVisible(true);
    const openCertificatesModal = () => setCertificatesModalVisible(true);

    const handleConfirm = async () => {
        setHideShowLoading(true);
        console.log('clicked');
        try {
            const token = await AsyncStorage.getItem("token");
            const usertype = admin === 0 ? "employee" : "employer";

            const formData = new FormData();
            formData.append("type", 1);
            formData.append("usertype", usertype);

            const response = await fetch(`${API_URL}/change-age-money-status`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: formData,
            });

            const result = await response.json();

            if (result.status === 200) {
                // toggle locally, no need to refetch
                setField("ageShowStatus", ageShowStatus === 1 ? 0 : 1);
                setHideShowModal(false);
                toastSuccess(ageShowStatus === 0 ? "Age shown successfully" : "Age hidden successfully");
            } else {
                toastError("Something went wrong");
            }
        } catch (e) {
            toastError("Network error");
        } finally {
            setHideShowLoading(false);
        }
    };

    const handleMoneyStatusConfirm = async () => {
        setHideShowMoneyLoading(true);
        console.log('clicked');
        try {
            const token = await AsyncStorage.getItem("token");
            const usertype = admin === 0 ? "employee" : "employer";

            const formData = new FormData();
            formData.append("type", 0);
            formData.append("usertype", usertype);

            const response = await fetch(`${API_URL}/change-age-money-status`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: formData,
            });

            const result = await response.json();

            if (result.status === 200) {
                // toggle locally, no need to refetch
                setField("moneyShowStatus", moneyShowStatus === 1 ? 0 : 1);
                setHideShowMoneyModal(false);
                toastSuccess(moneyShowStatus === 0 ? "Money shown successfully" : "Money hidden successfully");
            } else {
                toastError("Something went wrong");
            }
        } catch (e) {
            toastError("Network error");
        } finally {
            setHideShowMoneyLoading(false);
        }
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
                    <Map
                        latitude={latitude}
                        longitude={longitude}
                        address={userAddress}
                        zoom={0.01}
                    />
                    {/* Age */}
                    <View style={[styles.row, { backgroundColor: bgColor }]}>
                        <View style={styles.leftinfo}>
                            <MaterialIcons
                                name="cake"
                                size={22}
                                color="#fff"
                                style={styles.leftIcon}
                            />
                            <Text style={styles.label}>Age</Text>
                        </View>
                        <View style={styles.rightSection}>
                            <Text style={styles.value}>{years}</Text>
                            {isEdit && (
                                <>
                                    {
                                        years != 0 ? (
                                            <TouchableOpacity
                                                style={styles.circleBtn}
                                                onPress={handleAgeAdd}
                                            >
                                                <MaterialIcons name="edit" size={20} color="#000" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                style={styles.circleBtn}
                                                onPress={handleAgeAdd}
                                            >
                                                <Ionicons name="add" size={25} color="#000" />
                                            </TouchableOpacity>
                                        )
                                    }

                                    <TouchableOpacity
                                        style={styles.circleBtn}
                                        onPress={() => setHideShowModal(true)}
                                    >
                                        <Ionicons
                                            name={ageShowStatus ? "eye-off-outline" : "eye-outline"}
                                            size={22}
                                            color="#000"
                                        />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Money Earned */}
                    <View style={[styles.row, { backgroundColor: bgColor }]}>
                        <View style={styles.leftinfo}>
                            <Text style={styles.cadLabel}>CAD</Text>
                            <Text style={styles.label}>{admin === 2 ? "Money spent" : "Money Earned"}</Text>
                        </View>
                        <View style={styles.rightSection}>
                            <Text style={styles.value}>{profile?.earned}</Text>
                            {isEdit && (
                                <TouchableOpacity
                                    style={styles.circleBtn}
                                    onPress={() => setHideShowMoneyModal(true)}
                                >
                                    <Ionicons
                                        name={moneyShowStatus ? "eye-off-outline" : "eye-outline"}
                                        size={22}
                                        color="#000"
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Number of Jobs */}
                    <View style={[styles.row, { backgroundColor: bgColor }]} activeOpacity={0.85}>
                        <View style={styles.leftinfo}>
                            <Ionicons
                                name="briefcase-outline"
                                size={22}
                                color="#fff"
                                style={styles.leftIcon}
                            />
                            <Text style={styles.label}>Number of Jobs</Text>
                        </View>
                        <Text style={styles.value}>{profile?.count}</Text>
                    </View>

                    {/* Languages */}
                    <View style={[styles.sectionContainer, { backgroundColor: bgColor }]}>
                        <View style={styles.leftSection}>
                            <View style={styles.leftinfo}>
                                <Ionicons
                                    name="language-outline"
                                    size={22}
                                    color="#fff"
                                    style={styles.leftIcon}
                                />
                                <Text style={styles.label}>Languages</Text>
                            </View>
                            {isEdit && (
                                <TouchableOpacity style={styles.circleBtn} onPress={openLanguageModal}>
                                    <Ionicons name="add" size={25} color="#000" />
                                </TouchableOpacity>
                            )}
                        </View>
                        {
                            languages.length > 0 && (
                                <View style={styles.rightSection}>
                                    <LanguageData isEdit={isEdit} />
                                </View>
                            )
                        }
                    </View>

                    {/* Education */}
                    <View style={[styles.sectionContainer, { backgroundColor: bgColor }]}>
                        <View style={styles.leftSection}>
                            <View style={styles.leftinfo}>
                                <Ionicons
                                    name="book-outline"
                                    size={22}
                                    color="#fff"
                                    style={styles.leftIcon}
                                />
                                <Text style={styles.label}>Education</Text>
                            </View>
                            {isEdit && (
                                <TouchableOpacity style={styles.circleBtn} onPress={openEducationModal}>
                                    <Ionicons name="add" size={25} color="#000" />
                                </TouchableOpacity>
                            )}
                        </View>
                        {
                            education.length > 0 && (
                                <View style={styles.rightSection}>
                                    <EducationData isEdit={isEdit} />
                                </View>
                            )
                        }
                    </View>

                    {/* Assets and software programs */}
                    <View style={[styles.sectionContainer, { backgroundColor: bgColor }]}>
                        <View style={styles.leftSection}>
                            <View style={styles.leftinfo}>
                                <Ionicons
                                    name="construct-outline"
                                    size={22}
                                    color="#fff"
                                    style={styles.leftIcon}
                                />

                                <QuestionMark
                                    title="Assets and software programs"
                                    iconColor="#fff"
                                    textFamily="Montserrat_500Medium"
                                    tooltipMessage={tooltipMessage.tooltip_asset}
                                />
                            </View>

                            {isEdit && (
                                <TouchableOpacity
                                    style={styles.circleBtn}
                                    onPress={openAssetsModal}
                                >
                                    <Ionicons name="add" size={25} color="#000" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {
                            assets.length > 0 && (
                                <View style={styles.rightSection}>
                                    <AssetData isEdit={isEdit} />
                                </View>
                            )
                        }
                    </View>

                    {/* Vehicle */}
                    <View style={[styles.sectionContainer, { backgroundColor: bgColor }]}>
                        <View style={styles.leftSection}>
                            <View style={styles.leftinfo}>
                                <Ionicons
                                    name="car-outline"
                                    size={22}
                                    color="#fff"
                                    style={styles.leftIcon}
                                />

                                <QuestionMark
                                    title="Vehicle"
                                    iconColor="#fff"
                                    textFamily="Montserrat_500Medium"
                                    tooltipMessage={tooltipMessage.tooltip_Vehicle}
                                />
                            </View>
                            {isEdit && (
                                <TouchableOpacity style={styles.circleBtn} onPress={openVehicleModal}>
                                    <Ionicons name="add" size={25} color="#000" />
                                </TouchableOpacity>
                            )}
                        </View>
                        {
                            vehicles.length > 0 && (
                                <View style={styles.rightSection}>
                                    <VehicleData isEdit={isEdit} />
                                </View>
                            )
                        }
                    </View>

                    {/* Licenses */}
                    <View style={[styles.sectionContainer, { backgroundColor: bgColor }]}>
                        <View style={styles.leftSection}>
                            <View style={styles.leftinfo}>
                                <Ionicons
                                    name="card-outline"
                                    size={22}
                                    color="#fff"
                                    style={styles.leftIcon}
                                />

                                <QuestionMark
                                    title="Licenses"
                                    iconColor="#fff"
                                    textFamily="Montserrat_500Medium"
                                    tooltipMessage={tooltipMessage.tooltip_licenses}
                                />
                            </View>

                            {isEdit && (
                                <TouchableOpacity
                                    style={styles.circleBtn}
                                    onPress={openLicensesModal}
                                >
                                    <Ionicons name="add" size={25} color="#000" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {
                            licenses.length > 0 && (
                                <View style={styles.rightSection}>
                                    <LicenseData isEdit={isEdit} />
                                </View>
                            )
                        }
                    </View>

                    {/* Certificates */}
                    <View style={[styles.sectionContainer, { backgroundColor: bgColor }]}>
                        <View style={styles.leftSection}>
                            <View style={styles.leftinfo}>
                                <Ionicons
                                    name="ribbon-outline"
                                    size={22}
                                    color="#fff"
                                    style={styles.leftIcon}
                                />

                                <QuestionMark
                                    title="Certificates"
                                    iconColor="#fff"
                                    textFamily="Montserrat_500Medium"
                                    tooltipMessage={tooltipMessage.tooltip_certificate}
                                />
                            </View>

                            {isEdit && (
                                <TouchableOpacity
                                    style={styles.circleBtn}
                                    onPress={openCertificatesModal}
                                >
                                    <Ionicons name="add" size={25} color="#000" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {
                            certificates.length > 0 && (
                                <View style={styles.rightSection}>
                                    <CertificateData isEdit={isEdit} />
                                </View>
                            )
                        }
                    </View>
                </View>
            )}

            {/* ── Modals ── */}
            <DateOfBirthModal
                visible={dobModalVisible}
                onClose={() => setDobModalVisible(false)}
                initialDate={profile?.editprofile?.dob}
            />

            <AddLanguageModal
                visible={languageModalVisible}
                onClose={() => setLanguageModalVisible(false)}
            />

            <AddEducationModal
                visible={educationModalVisible}
                onClose={() => setEducationModalVisible(false)}
            />

            <AddAssetsModal
                visible={assetsModalVisible}
                onClose={() => setAssetsModalVisible(false)}
            />

            <AddVehicleModal
                visible={vehicleModalVisible}
                onClose={() => setVehicleModalVisible(false)}
            />

            <AddLicensesModal
                visible={licensesModalVisible}
                onClose={() => setLicensesModalVisible(false)}
            />

            <AddCertificatesModal
                visible={certificatesModalVisible}
                onClose={() => setCertificatesModalVisible(false)}
            />

            <HideShowConfirmModal
                visible={hideShowModal}
                onClose={() => setHideShowModal(false)}
                type={ageShowStatus === 1 ? "hide" : "show"}
                onConfirm={handleConfirm}
                loading={hideShowLoading}
            />
            <HideShowMoneyModal
                visible={hideShowMoneyModal}
                onClose={() => setHideShowMoneyModal(false)}
                type={moneyShowStatus === 1 ? "hide" : "show"}
                onConfirm={handleMoneyStatusConfirm}
                loading={hideShowMoneyLoading}
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
    sectionContainer: {
        backgroundColor: "#43A37A",
        borderRadius: 8,
        padding: 14,
        flexDirection: "column",
        alignItems: "center",
        gap: 8
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        flex: 1,
    },
    rightSection: {
        flex: 1,
        width: "100%",
    },
    leftinfo: {
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
