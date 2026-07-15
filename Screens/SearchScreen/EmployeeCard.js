import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GradientButton from "../../components/GradientButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { API_URL } from "../../api/ApiUrl";
import { toastError, toastSuccess } from "../../utils/toast";
import StarRating from "../../components/StarRating";


const EmployeeCard = React.memo(({ item, navigation }) => {
    const servicesCount = item.seller_services_for_search ? item.seller_services_for_search.length : 0;
    const maxVisibleServices = 2;
    const [isLiked, setIsLiked] = useState(item?.is_like == 1);
    const [loading, setLoading] = useState(false);

    return (
        <>
            <View style={styles.jobCard1}>
                <View style={styles.userRow1}>
                    <Image
                        source={{
                            uri: item.photo,
                        }}
                        style={styles.avatar1}
                    />
                    <View style={{ flex: 1 }}>
                        <View style={styles.nameRow1}>
                            <Text style={styles.userName1}> {item.full_name} </Text>
                            <View>
                                <StarRating rating={item.rating} starSize={15} />
                            </View>
                        </View>
                        <View style={styles.paymentRow1}>
                            <MaterialIcons name="verified" size={16} color="#40b68e" />
                            <Text style={styles.paymentVerified1}>
                                {item.verification_count}/7
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.heartTouchable}>
                        <FontAwesome name={"heart-o"} size={20} color={"#fff"} />
                    </TouchableOpacity>
                </View>
                {item.about ? (
                    <>
                        <Text style={styles.jobTitle1}>About Me</Text>
                        <Text style={styles.jobDesc1}>{item.about}</Text>
                    </>
                ) : null}
                {
                    item.address && (
                        <View style={styles.locationRow1}>
                            <FontAwesome6
                                name="location-dot"
                                size={14}
                                color="#eb8676"
                                style={styles.locationIcon1}
                            />
                            <Text style={styles.locationText1}> {item.address} </Text>
                        </View>
                    )
                }
                <View style={styles.parentContainer1}>
                    {item?.seeking_jobs?.length > 0 && (
                        <View style={styles.serviceRow}>
                            <Text style={styles.sectionTitle1}>Promoted Services</Text>
                            <View style={styles.promotedRow}>
                                {item.seeking_jobs.slice(0, 2).map((service, index) => (
                                    <TouchableOpacity
                                        key={`${service.id}-${index}`}
                                        style={styles.serviceCard}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.servicePrice}>
                                            CAD {Number(service.hour_minimum).toFixed(2)}
                                        </Text>
                                        <Text style={styles.serviceHour}>/hour</Text>
                                        <Text style={styles.serviceTitle} numberOfLines={2}>{service.subject}</Text>
                                    </TouchableOpacity>
                                ))}

                                {item.seeking_jobs.length > 2 && (
                                    <TouchableOpacity
                                        style={styles.moreCard}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.moreCount}>
                                            +{item.seeking_jobs.length - 2}
                                        </Text>

                                        <Text style={styles.moreText}>
                                            Services
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                    {item?.seller_services_for_search?.length > 0 && (
                        <View style={styles.categoryRow}>
                            <Text style={styles.sectionTitle1}>Categories</Text>
                            <View style={styles.skillRow1}>
                                {item?.seller_services_for_search
                                    ?.slice(0, maxVisibleServices)
                                    ?.map((service, index) => {
                                        const subName = service?.sub_services?.subname;

                                        if (!subName) return null;

                                        return (
                                            <View
                                                key={`${service.id}-${index}`}
                                                style={styles.skillTag1}
                                            >
                                                <Text style={styles.skillText1}>
                                                    {subName}
                                                </Text>
                                            </View>
                                        );
                                    })}

                                {servicesCount > maxVisibleServices && (
                                    <View style={styles.skillTag1}>
                                        <Text style={styles.skillText1}>
                                            +{servicesCount - maxVisibleServices} more
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </View>
                <View>
                    <GradientButton
                        title="View"
                        onPress={() =>
                            navigation.navigate("PublicEmployeeProfilePage", {
                                name: item?.name || "",
                            })
                        }
                    />
                </View>
            </View>

        </>
    );
});

export default EmployeeCard;

const styles = StyleSheet.create({
    userRow1: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    nameRow1: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar1: {
        width: 55,
        height: 55,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "#fff",
        marginRight: 12,
    },
    userName1: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
    },
    paymentRow1: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3,
    },
    paymentVerified1: {
        color: "#fff",
        fontSize: 14,
        marginLeft: 7,
        fontFamily: "Montserrat_400Regular",
    },
    jobTitle1: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
    },
    jobDesc1: {
        fontSize: 16,
        marginTop: 5,
        marginBottom: 14,
        fontFamily: "Montserrat_400Regular",
        color: "#fff",
    },
    parentContainer1: {
        backgroundColor: "#EDC8B81A",
        borderRadius: 18,
        marginTop: 8,
    },
    serviceRow: {
        padding: 14,
        paddingBottom: 7,
    },
    categoryRow: {
        padding: 14,
        paddingTop: 7,
    },
    sectionTitle1: {
        color: "#fff",
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 16,
        marginBottom: 5,
    },
    promotedRow: {
        flexDirection: "row",
        gap: 10,
    },
    serviceCard: {
        width: 120,
        backgroundColor: "#2D2D2D",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#474747",
        padding: 10,
        minHeight: 110,
        justifyContent: "space-between",
    },
    servicePrice: {
        color: "#89e442",
        fontSize: 16,
        lineHeight: 22,
        fontFamily: "Montserrat_700Bold",
    },
    serviceHour: {
        color: "#fff",
        fontSize: 13,
        fontFamily: "Montserrat_400Regular",
    },
    serviceTitle: {
        color: "#FFF",
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
        marginTop: 10,
    },
    moreCard: {
        width: 88,
        backgroundColor: "#2D2D2D",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#474747",
    },
    moreCount: {
        fontSize: 28,
        color: "#FFF",
        fontFamily: "Montserrat_700Bold",
    },
    moreText: {
        color: "#FFF",
        textAlign: "center",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        marginTop: 4,
    },
    skillRow1: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 4,
    },
    skillTag1: {
        paddingHorizontal: 11,
        paddingVertical: 11,
        borderRadius: 30,
        backgroundColor: "#575454",
    },
    skillText1: {
        color: "#fff",
        fontFamily: "Montserrat_500Medium",
        fontSize: 10,
    },
    jobFooter1: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    locationRow1: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    locationIcon1: {},
    locationText1: {
        flex: 1,
        fontSize: 12,
        lineHeight: 16,
        color: "#fff",
        marginLeft: 5,
        fontFamily: "Montserrat_400Regular",
    },
    viewBtn1: {
        backgroundColor: "#eb8676",
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 18,
    },
    viewBtnText1: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Montserrat_700Bold",
    }
})