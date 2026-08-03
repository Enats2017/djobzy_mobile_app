import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator
} from "react-native";
import { Feather, MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import QuestionMark from "../../components/QuestionMark";
import { tooltipMessage } from "../../components/TooltipMessage";
import GradientButton from "../../components/GradientButton";
import { API_ICON, API_URL } from "../../api/ApiUrl";
import AddEditPromoteSerivceModal from "./modals/AddEditPromoteSerivceModal";
import { useEditProfileStore } from "./useEditProfileStore";
import DeletePromoteServiceModal from "./modals/DeletePromoteServiceModal";
import { useServiceGlobalStore } from "../PromoteServicesPage/ServiceGlobalStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastError } from "../../utils/toast";

const EditProfilePromotedServices = ({ navigation, isEdit = true }) => {
    const promote = useEditProfileStore((state) => state.form.promote);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletePromoteService, setDeletePromoteService] = useState(null);
    const [loadingId, setLoadingId] = useState(null);

    const handleSave = (data) => {
        setModalVisible(false);
    };
    const handleOpenDelete = (item) => {
        setDeletePromoteService(item);
        setDeleteModalVisible(true);
    };

    const onClose = () => {
        setDeletePromoteService(null);
        setDeleteModalVisible(false);
    };

    const handleEdit = async (id, type) => {
        try {
            setLoadingId(id);
            const token = await AsyncStorage.getItem("token");
            const formData = new FormData();
            formData.append("id", id);
            formData.append("type", type);
            const response = await fetch(`${API_URL}/fetchDetails`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: formData,
            });
            const data = await response.json();
            if (data.status === 200) {
                const serviceData = data.result;
                const store = useServiceGlobalStore.getState();
                store.reset();
                store.setUniqueId(serviceData?.unique_id);
                store.setField("title", serviceData.title || "");
                store.setField("description", serviceData.description || "");
                store.setField("hourlyRate", String(serviceData.hour_minimum || ""));
                store.setField("totalPrice", String(serviceData.price || ""));
                store.setExpectedTime(
                    (serviceData.selected_time === "no-calendar"
                        ? 1
                        : serviceData.selected_time) || 0
                );
                store.clearCategories();
                serviceData.subservice_id?.forEach((id, index) => {
                    store.addCategory({
                        subId: Number(id),
                        name: serviceData.subcategories?.[index],
                    });
                });
                navigation.navigate("PromoteService");
            } else {
                toastError(result.message || "Unable to fetch details");
            }
        } catch (err) {
            console.log("fetchDetails error: ", err);
            toastError("Network error while fetching details");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <View style={styles.section}>
            <View style={styles.label}>
                <QuestionMark title="My Promote services" iconColor="#fff" tooltipMessage={tooltipMessage.tooltip_provided_services} />
            </View>

            <TouchableOpacity
                style={styles.plusbtn}
                onPress={() => navigation.navigate("PromoteService")}
            >
                <AntDesign name="plus" size={16} color="#030303" />
                <Text style={styles.plustext}>
                    Promote Services
                </Text>
            </TouchableOpacity>
            <ScrollView
                horizontal={true}
                contentContainerStyle={styles.promotewrapper}
                showsHorizontalScrollIndicator={false}
            >
                {promote?.map((item, index) => {
                    const icon = item?.seeking_services?.[0]?.get_seek_services_api?.icon;

                    return (
                        <View key={index} style={styles.wrapper}>
                            {/* ICON */}
                            <View style={styles.iconContainer}>
                                {icon ? (
                                    <Image
                                        source={{
                                            uri: `${API_ICON}/images/servicephoto/png-image/${icon}`,
                                        }}
                                        style={styles.image}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Ionicons name="image-outline" size={28} color="#999" />
                                )}
                            </View>

                            {/* CARD */}
                            <View style={[styles.card, { height: isEdit ? 225 : 185 }]}>
                                {/* TOP CONTENT */}
                                <View style={styles.cardContent}>
                                    <Text style={styles.title} numberOfLines={2}>
                                        {item.subject}
                                    </Text>

                                    <View style={styles.priceRow}>
                                        <Text style={styles.price}>
                                            {item.hour_minimum} CAD
                                        </Text>
                                        <Text style={styles.perHour}>/hour</Text>
                                    </View>
                                </View>

                                {/* BUTTON (ALWAYS BOTTOM) */}
                                <GradientButton
                                    title="View"
                                    fontSize={15}
                                    paddingVertical={0}
                                    paddingHorizontal={35}
                                    onPress={() =>
                                        navigation.navigate("EditPromoteSevices", {
                                            id: item.sid,
                                            type: 2,
                                        })
                                    }
                                />
                                {isEdit && (
                                    <View style={styles.bottomBtns}>
                                        {/* Edit Button */}
                                        <TouchableOpacity
                                            style={styles.circleButton}
                                            onPress={() => handleEdit(item.sid, 2)}
                                            disabled={loadingId === item.sid}
                                        >
                                            {loadingId === item.sid ? (
                                                <ActivityIndicator size="small" color="#000" />
                                            ) : (
                                                <Feather name="edit-3" size={22} color="#000" />
                                            )}
                                        </TouchableOpacity>

                                        {/* Delete Button */}
                                        <TouchableOpacity style={styles.circleButton} onPress={() => handleOpenDelete(item)}>
                                            <MaterialIcons name="delete" size={27} color="#d91212" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <AddEditPromoteSerivceModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSave}
            />
            <DeletePromoteServiceModal
                visible={deleteModalVisible}
                deletePromoteService={deletePromoteService}
                onClose={onClose}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 6,
        fontFamily: "Montserrat_700Bold",
    },
    plusbtn: {
        // marginTop: 10,
        alignSelf: "flex-start",
        flexDirection: "row",
        gap: 5,
        backgroundColor: "#fff",
        borderRadius: 100,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    plustext: {
        color: "#030303",
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,
        lineHeight: 19
    },
    promotewrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 8,
        gap: 10,
    },

    wrapper: {
        position: "relative",
        marginTop: 30,
    },

    iconContainer: {
        position: "absolute",
        top: -22,
        left: "50%",
        transform: [{ translateX: -22.5 }],
        zIndex: 10,
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        width: 25,
        height: 25,
    },

    card: {
        width: 160,
        height: 225,
        paddingTop: 27,
        paddingBottom: 18,
        paddingHorizontal: 10,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1.5,
        borderColor: "#ffffff1a",
    },
    cardContent: {
        alignItems: "center",
    },

    title: {
        color: "#ffffff",
        fontSize: 13,
        textAlign: "center",
        marginTop: 10,
        lineHeight: 17,
    },

    priceRow: {
        alignItems: "center",
        gap: 4,
    },

    price: {
        color: "#34A853",
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        marginTop: 6,
    },

    perHour: {
        color: "#34A853",
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
    },

    btn: {
        backgroundColor: "#d17b68",
        marginTop: 15,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 12,
    },

    btnText: {
        color: "#fff",
        fontSize: 204,
        fontWeight: "600",
    },
    bottomBtns: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        paddingVertical: 10,
    },
    circleButton: {
        width: 35,
        height: 35,
        borderRadius: 100,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
});

export default EditProfilePromotedServices;
