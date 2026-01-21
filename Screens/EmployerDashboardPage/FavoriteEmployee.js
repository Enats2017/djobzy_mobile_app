import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { API_URL } from "../../api/ApiUrl";
import GradientButton from "../../components/GradientButton";
import { useNavigation } from "@react-navigation/native";
import LineDivider from "../../components/LineDivider";
import EmployerFooter from "../../components/EmployerFooter";
import Loading from "../../components/Loading";
import NoJobs from "../EmployeeJobs/NoJobs";

const FavoriteEmployee = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/employer-favourite-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStars = (rating) => {
    if (!rating || rating <= 0) return "⭐";
    return "⭐".repeat(Math.round(rating));
  };

  const handleProfileNavigation = (item) => {
    console.log("Employer name 👉", item?.name);
    if (item?.admin == 2) {
      navigation.navigate("PublicEmployeeProfile", {
        name: item?.name,
      });
    } else {
      navigation.navigate("EmployerProfilePage", {
        name: item?.name || "",
      });
    }
  };

  const renderItem = ({ item, index }) => {
    const isLastItem = index === jobs.length - 1;
    return (
      <>
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
              <View style={{ flexDirection: "row", marginLeft: 6, gap: 3 }}>
                <Text style={styles.rating}>{renderStars(item.rating)}</Text>
              </View>
            </View>
            <View style={styles.paymentRow1}>
              <MaterialIcons name="verified" size={16} color="#40b68e" />
              <Text style={styles.paymentVerified1}>
                {item.verification_count}/7
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setLiked1(!liked1)}
            style={styles.heartTouchable}
          >
            <FontAwesome
              name={item.is_like === 1 ? "heart" : "heart-o"}
              size={20}
              color={item.is_like === 1 ? "#ff4d4d" : "#fff"}
            />
          </TouchableOpacity>
        </View>
        {item.about ? (
          <>
            <Text style={styles.jobTitle1}>About Me</Text>
            <Text style={styles.jobDesc1}>{item.profile_title_employee}</Text>
          </>
        ) : null}
        <View style={styles.locationRow1}>
          <FontAwesome6
            name="location-dot"
            size={14}
            color="#eb8676"
            style={styles.locationIcon1}
          />
          <Text style={styles.locationText1}> {item.address || "NA"} </Text>
        </View>
        <View style={styles.parentContainer1}>
          <Text style={styles.sectionTitle1}>Promoted Services</Text>
          <View style={styles.promotedRow1}>
            <View style={styles.promotedBox1} />
            <View style={styles.promotedBox1} />
          </View>
          <Text style={styles.sectionTitle1}>Categories</Text>
          <View style={styles.skillRow1}>
            {(item.seller_services || []).map((service, i) => (
              <View key={i} style={styles.skillTag1}>
                <Text style={styles.skillText1}>{service.subname}</Text>
              </View>
            ))}
          </View>
        </View>
        <View>
          <GradientButton
            title="View"
            onPress={() => handleProfileNavigation(item)}
          />
        </View>

        {!isLastItem && <LineDivider />}
      </>
    );
  };

  if (loading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar title="Favorite Employees" navigation={navigation} />
        {jobs.length == 0 ? (
          <NoJobs />
        ) : (
          <FlatList
            data={jobs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <EmployerFooter />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },

  userRow1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  nameRow1: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar1: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
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
    padding: 14,
    marginTop: 8,
  },
  sectionTitle1: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    marginBottom: 10,
  },
  promotedRow1: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 22,
  },
  promotedBox1: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#cfcfcf",
  },
  skillRow1: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillTag1: {
    padding: 11,
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
  },
});

export default FavoriteEmployee;
