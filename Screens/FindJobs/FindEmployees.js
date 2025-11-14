import React, { useEffect, useState, useRef, useCallback } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LineDivider from "../../components/LineDivider";
import GradientButton from "../../components/GradientButton";

export default function FindEmployees() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const onEndReachedCalledDuringMomentum = useRef(false);
  const hasFetched = useRef(false);
  const insets = useSafeAreaInsets();

  const fetchEmployee = useCallback(
    async (pageNum = 1) => {
      if (loading || isFetchingMore) return;

      // IMPORTANT: prevent double calls
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setIsFetchingMore(true); // lock BEFORE calling API
      }

      try {
        const res = await fetch(`${API_URL}/employee-gigs?page=${pageNum}`, {
          headers: {
            Accept: "application/json",
          },
        });

        const data = await res.json();

        if (!data?.details || data.details.length === 0) {
          setHasMore(false);
          return;
        }

        console.log("Details count:", data.details.length);

        setEmployees((prev) => {
          const newItems = data.details.filter(
            (emp) => !prev.some((j) => j.id === emp.id)
          );
          return [...prev, ...newItems];
        });

        setHasMore(data.details.length === 10);
        setPage(pageNum);

      } catch (err) {
        console.log("Error fetching employees:", err);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    [loading, isFetchingMore]
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchEmployee(1);
    }
  }, [fetchEmployee]);

  // -----------------------------
  // FOOTER
  // -----------------------------
  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{ paddingVertical: 12 }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  };

  if (loading) return <Loading />;

  const renderEmployeeCard = ({ item, index }) => {
    const isLastItem = index === employees.length - 1;
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
          <View>
            <GradientButton title="View" onPress={() => navigation.navigate("JobProfile", { gid: item.request_slug })} />
          </View>
        </View>
        {!isLastItem && <LineDivider />}
      </>
    );
  };

  return (
    <View style={[styles.findEmployeeContainer, { paddingBottom: insets.bottom }]}>
      <FlatList
        data={employees}
        renderItem={renderEmployeeCard}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false; }}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current && hasMore && !isFetchingMore && !loading) {
            // console.log("🚀 Triggering next page:", page + 1);
            fetchEmployee(page + 1);
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  findEmployeeContainer: {
    flex: 1,
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
});
