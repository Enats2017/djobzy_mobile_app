import { Feather, FontAwesome } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { truncateWords } from "../../api/TruncateWords";
import { useNavigation } from "@react-navigation/native";
import LineDivider from "../../components/LineDivider";
import GradientButton from "../../components/GradientButton";
import AntDesign from "@expo/vector-icons/AntDesign";

const JobCard = ({ item, isLastItem }) => {
    const navigation = useNavigation();
    const servicesCount = item.gigServices ? item.gigServices.length : 0;
    const maxVisibleServices = 2;

    return (
        <>
            <View style={[styles.jobCard]}>
                <Text style={[styles.uploadTextAbove, { marginBottom: 8 }]}>
                    Uploaded at {item.created}
                </Text>
                <View style={styles.userRow}>
                    <Image
                        source={{
                            uri: item.photo,
                        }}
                        style={styles.avatar}
                    />

                    <View style={styles.userInfo}>
                        <View style={styles.nameRow}>
                            <View style={styles.userNameSection}>
                                <Text style={styles.userName}>{item.full_name}</Text>

                                <View style={styles.starRow}>
                                    {[...Array(5)].map((_, i) => (
                                        <FontAwesome
                                            key={i}
                                            name="star"
                                            style={styles.starIcon}
                                        />
                                    ))}
                                </View>
                            </View>
                            <View style={styles.paymentRow}>
                                <MaterialIcons
                                    name="verified"
                                    size={16}
                                    color="#40b68e"
                                />
                                <Text style={styles.paymentVerified}>
                                    Payment verified
                                </Text>
                            </View>
                        </View>

                        <View>
                            <TouchableOpacity style={styles.heartTouchable}>
                                <FontAwesome
                                    name={"heart-o"}
                                    size={20}
                                    color={"#fff"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.jobDesc}>
                    {truncateWords(item.description, 20)}
                </Text>

                <View style={styles.skillRow}>
                    {servicesCount > 0 ? (
                        <>
                            {item.gigServices
                                .slice(0, maxVisibleServices)
                                .map((service, index) => (
                                    <View key={index}>
                                        <View style={styles.skillTag}>
                                            <Text style={styles.skillText}>
                                                {service.sub_services.subname || "No Subcategory"}
                                            </Text>
                                        </View>
                                    </View>
                                ))}

                            {servicesCount > maxVisibleServices && (
                                <View style={styles.skillTag}>
                                    <Text style={styles.skillText}>
                                        +{servicesCount - maxVisibleServices} More
                                    </Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <Text style={styles.noData}>No Data Found</Text>
                    )}
                </View>
                <View style={styles.jobFooter}>
                    <AntDesign
                        name="dollar"
                        size={16}
                        color="#CB7767"
                        style={styles.locationIcon}
                    />
                    <Text style={styles.hourly}>Hourly: </Text>
                    <Text style={styles.hourlyRange}>{item.hour_minimum}</Text>
                    <View style={styles.locationRow}>
                        {item.preferred_location && (
                            <>
                                <Feather
                                    name="map-pin"
                                    size={16}
                                    color="#eb8676"
                                    style={styles.locationIcon}
                                />

                                <Text style={styles.locationText}>
                                    {item.preferred_location}
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                <View>
                    <GradientButton title="View" onPress={() => navigation.navigate("JobProfile", { gid: item.request_slug })} />
                </View>
                {!isLastItem && <LineDivider />}
            </View>
        </>
    );
};

export default JobCard;

const styles = StyleSheet.create({
    uploadTextAbove: {
        left: 0,
        color: "#b3b3b3",
        fontSize: 11,
        fontFamily: "Montserrat_400Regular",
    },

    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        gap: 10,
        width: "100%",
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "#fff",
    },
    userInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10,
        flex: 1,
    },
    nameRow: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
    },
    userNameSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    userName: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
    },
    starRow: {
        flexDirection: "row",
        gap: 3,
    },
    starIcon: {
        fontSize: 13,
        color: "#EBBE56",
    },
    paymentRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    paymentIcon: {
        fontSize: 16,
        color: "#39A881",
    },
    paymentVerified: {
        color: "#ffffff",
        fontSize: 13,
        marginLeft: 4,
        fontFamily: "Montserrat_400Regular",
    },
    jobTitle: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 10,
        fontFamily: "Montserrat_600SemiBold",
    },

    jobDesc: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: "Montserrat_400Regular",
        color: "#ffffff",
        lineHeight: 24,
    },

    readMore: {
        color: "#eb8676",
        fontWeight: "600",
    },

    skillRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6
    },

    skillTag: {
        backgroundColor: "#ffffff1a",
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginVertical: 5,
        alignItems: "center",
    },

    skillText: {
        color: "#e3e3e3",
        fontSize: 10,
        fontWeight: "500",
        fontFamily: "Montserrat_500Medium",
        textAlign: "center",
    },

    jobFooter: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        paddingVertical: 8,
    },

    hourly: {
        fontFamily: "Montserrat_600SemiBold",
        color: "#fff",
        fontSize: 12,
    },

    hourlyRange: {
        color: "#fff",
        fontWeight: "500",
        marginRight: 12,
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
        flex: 1,
    },

    locationIcon: {
        marginRight: 5,
    },

    locationText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 16,
        color: "#fff",
        fontFamily: "Montserrat_400Regular",
    },
    heartTouchable: {
        alignItems: "flex-end",
        width: "100%"
    }
});