import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { ActivityIndicator, StyleSheet, View, FlatList } from "react-native";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGlobalSearch } from "./useGlobalSearch";
import EmployeeCard from "./EmployeeCard";
import { useNavigation } from "@react-navigation/native";
import LineDivider from "../../components/LineDivider";

export default function EmployeeResult({ showData }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    keyword,
    latitude,
    longitude,
    getSubcategoryParam,
    getCategoryParam,
    low_price,
    high_price,
    radius,
    searchTrigger,
    sortBy,
    sortOrder,
  } = useGlobalSearch();

  const subcategory = getSubcategoryParam();
  const category = getCategoryParam();

  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const hasFetched = useRef(false);
  const isFirstLoad = useRef(true);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      search_dropdown: 0,
      latitude: latitude || 0,
      longitude: longitude || 0,
      keyword: keyword || "",
      subcategory: subcategory || "",
      category: category || "",
      low: low_price,
      high: high_price,
      radius: radius || 0,
      sortBy: sortBy || "Distance",
      sortOrder: sortOrder || "ASC",
    });

    return params.toString();
  }, [keyword, latitude, longitude, subcategory, category, low_price, high_price, radius, sortBy, sortOrder]);

  const fetchEmployee = useCallback(async (reset = false) => {
      if (loading || isFetchingMore) return;
      if (reset) {
        setEmployees([]);
        setHasMore(true);
      }
      setIsInitialLoading(true);

      try {
        const url = `${API_URL}/employee-search-result?${queryString}`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });

        const data = await res.json();
        if (!data?.details || data.details.length === 0) {
          setHasMore(false);
          return;
        }

        setEmployees((prev) => {
          const newItems = data.details.filter(
            (emp) => !prev.some((j) => j.id === emp.id),
          );
          return [...prev, ...newItems];
        });
        setHasMore(data.details.length === 10);
      } catch (err) {
        console.log("Error fetching employees:", err);
      } finally {
        setIsInitialLoading(false);
      }
    }, [queryString]);

  useEffect(() => {
      // initial mount
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        fetchEmployee(true);
        return;
      }

      // advanced search triggered
      if (searchTrigger > 0) {
        console.log("🔁 Filters changed — resetting pagination");
        fetchEmployee(true);
      }
    }, [queryString, searchTrigger, fetchEmployee]);

  const advanceSearchFilter = useCallback(async () => {
      try {
        if (loading || isFetchingMore || !hasMore) return;
        setIsFetchingMore(true);

        const payload = {
          skip: employees.length,
          keyword,
          subcat: subcategory || null,
          latitude: latitude || 0,
          longitude: longitude || 0,
          radius: radius,
          low: low_price,
          high: high_price,
          job_type: 2,
        };
        console.log("📡 ADVANCED POST FOR EMPLOYYEEE:", payload);
        const res = await fetch(`${API_URL}/search-advance-result`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!data?.gigs || data.gigs.length === 0) {
          setHasMore(false);
          return;
        }
        setEmployees((prev) => {
          const newItems = data.gigs.filter(
            (emp) => !prev.some((j) => j.id === emp.id),
          );
          return [...prev, ...newItems];
        });
        setHasMore(data.gigs.length === 10);
      } catch (err) {
        console.log("❌ Advanced search error:", err);
      } finally {
        setIsFetchingMore(false);
      }
    },
    [
      employees.length,
      keyword,
      subcategory,
      latitude,
      longitude,
      radius,
      low_price,
      high_price,
    ]
  );

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{ paddingVertical: 12 }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  };

  const renderEmployeeCard = useCallback(({ item }) => {
    return <EmployeeCard item={item} navigation={navigation} />;
  }, [navigation, employees.length]);

  if (isInitialLoading) return <Loading />;

  return (
    <View style={[styles.findEmployeeContainer, { paddingBottom: insets.bottom }]}>
      {!showData && (
        <FlatList
          data={employees}
          renderItem={renderEmployeeCard}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          onEndReached={() => {
            if (employees.length < 10) return;
            if (
              !onEndReachedCalledDuringMomentum.current &&
              hasMore &&
              !isFetchingMore &&
              !loading
            ) {
              advanceSearchFilter();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          contentContainerStyle={{ paddingBottom: 50 }}
          ItemSeparatorComponent={() => <LineDivider />}
        />
      )}
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  findEmployeeContainer: {
    flex: 1,
  },
});
