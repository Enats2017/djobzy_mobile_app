import { useEffect, useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";


export default function FindEmployees() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchEmployee = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setIsFetchingMore(true);
      const res = await fetch(`${API_URL}/employee-gigs?page=${pageNum}`);
      const data = await res.json();
      setEmployees(data.details);
      console.log('adfad ', employees);

      if (!data?.details) {
        setHasMore(false);
        return;
      }
      setPage(pageNum);
      // const newEmployees = data.details.filter(
      //   (employee) => !employees.some((j) => j.id === employee.id)
      // );

      // // if (newEmployees.length > 0) {

      // //   console.log('11111111111', employees);
      // // } else {
      // //   setHasMore(false);
      // // }
    } catch (err) {
      console.log("Error fetching jobs:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };
  useEffect(() => {
    if (employees.length === 0) {
      fetchEmployee();
    }
  }, []);

  if (loading) return <Loading />;

  const renderEmployeeCard = ({ item }) => {
    return (
      <>
        <View style={styles.jobCard1}>
          <View style={styles.userRow1}>
            <Image
              source={{
                uri: item.photo || "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              style={styles.avatar1}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow1}>
                <Text style={styles.userName1}> {item.full_name} </Text>
                <View style={{ flexDirection: "row", marginLeft: 6, gap: 3 }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={15}
                      color="#EBBE56"
                    />
                  ))}
                </View>
              </View>
              <View style={styles.paymentRow1}>
                <MaterialIcons name="verified" size={16} color="#40b68e" />
                <Text style={styles.paymentVerified1}>{item.verification_count}/7</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setLiked1(!liked1)}
              style={styles.heartTouchable}
            >
              <FontAwesome
                name={"heart-o"}
                size={20}
                color={"#fff"}
              />
            </TouchableOpacity>
          </View>
          {item.about ? (
            <>
              <Text style={styles.jobTitle1}>About Me</Text>
              <Text style={styles.jobDesc1}>{item.about}</Text>
            </>
          ) : null}
          <View style={styles.locationRow1}>
            <FontAwesome6
              name="location-dot"
              size={14}
              color="#eb8676"
              style={styles.locationIcon1}
            />
            <Text style={styles.locationText1}> {item.address} </Text>
          </View>
          <View style={styles.parentContainer1}>
            <Text style={styles.sectionTitle1}>Promoted Services</Text>
            <View style={styles.promotedRow1}>
              <View style={styles.promotedBox1} />
              <View style={styles.promotedBox1} />
            </View>
            <Text style={styles.sectionTitle1}>Categories</Text>
            <View style={styles.skillRow1}>
              {["Website design", "Website design", "Website design"].map(
                (skill, i) => (
                  <View key={i} style={styles.skillTag1}>
                    <Text style={styles.skillText1}>{skill}</Text>
                  </View>
                )
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.viewBtn1}>
            <Text style={styles.viewBtnText1}>View Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider1} />
      </>
    );
  };

  return (
    <View style={styles.findEmployeeContainer}>
      <FlatList
        data={employees}
        renderItem={renderEmployeeCard}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => {
          if (!isFetchingMore && hasMore) fetchEmployee(page + 1);
        }}
        onEndReachedThreshold={0.5}
        style={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>

  );
}

// STYLES
const styles = StyleSheet.create({
  findEmployeeContainer: {
    flex: 1,
  },
  jobCard1: {
    marginBottom: 18,
  },
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
  locationIcon1: {
    
  },
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
  divider1: {
    borderBottomColor: "#8e8e8e",
    borderBottomWidth: 1,
    marginVertical: 12,
    opacity: 0.5,
    marginTop: 5,
  },
});
