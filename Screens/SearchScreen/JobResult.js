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
import JobCard from "../EmployeeJobs/JobCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGlobalSearch } from "./useGlobalSearch";
import { useNavigation } from "@react-navigation/native";
import LineDivider from "../../components/LineDivider";

export default function JobResult({ showData }) {
  const insets = useSafeAreaInsets();
  const {
    keyword,
    latitude,
    longitude,
    getSubcategoryParam,
    getCategoryParam,
    low_price,
    high_price,
    radius,
    isRemoteJob,
    searchTrigger,
    sortBy,
    sortOrder,
  } = useGlobalSearch();

  const subcategory = getSubcategoryParam();
  const category = getCategoryParam();
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
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
      isRemoteJob: isRemoteJob || 0,
      sortBy: sortBy || "Distance",
      sortOrder: sortOrder || "ASC",
    });

    return params.toString();
  }, [keyword, latitude, longitude, subcategory, category, low_price, high_price, radius, isRemoteJob, sortBy, sortOrder]);

  const fetchJobs = useCallback(async (reset = false) => {
      if (loading || isFetchingMore) return;
      if (reset) {
        setJobs([]);
        setHasMore(true);
      }
      setIsInitialLoading(true);
      try {
        const url = `${API_URL}/search-result?${queryString}`;
        console.log("📡 Fetching Jobs URL:", url);
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });

        const data = await res.json();
        if (!data?.gigs || data.gigs.length === 0) {
          setHasMore(false);
          return;
        }

        setJobs((prev) => {
          const newGigs = data.gigs.filter(
            (gig) => !prev.some((j) => j.gid === gig.gid),
          );
          return [...prev, ...newGigs];
        });
        setHasMore(data.gigs.length === 10);
      } catch (err) {
        console.log("❌ Error fetching jobs:", err);
      } finally {
        setIsInitialLoading(false);
      }
    }, [queryString]);

  useEffect(() => {
    // initial mount
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      fetchJobs(true);
      return;
    }

    // advanced search triggered
    if (searchTrigger > 0) {
      console.log("🔁 Filters changed — resetting pagination");
      fetchJobs(true);
    }
  }, [queryString, searchTrigger, fetchJobs]);

  const advanceSearchFilter = useCallback(async () => {
      try {
        if (loading || isFetchingMore) return;
        setIsFetchingMore(true);

        const payload = {
          skip: jobs.length,
          keyword,
          subcat: subcategory || null,
          latitude: latitude || 0,
          longitude: longitude || 0,
          radius: radius,
          low: low_price,
          high: high_price,
          isRemoteJob: isRemoteJob ? 1 : 0,
          gigId: jobs.map((j) => j.gid),
          job_type: 1,
        };
        console.log("📡 ADVANCED POST:", payload);
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
        setJobs((prev) => {
          const newGigs = data.gigs.filter(
            (gig) => !prev.some((j) => j.gid === gig.gid),
          );
          return [...prev, ...newGigs];
        });
        setHasMore(data.gigs.length === 10);
      } catch (err) {
        console.log("❌ Advanced search error:", err);
      } finally {
        setIsFetchingMore(false);
      }
    },
    [
      jobs.length,
      keyword,
      subcategory,
      latitude,
      longitude,
      radius,
      low_price,
      high_price,
      isRemoteJob,
    ]
  );

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{ paddingVertical: 12 }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  };

  const renderJobCard = useCallback(({ item }) => {
    return <JobCard item={item} navigation={navigation} />;
  }, [navigation, jobs.length]);

  if (isInitialLoading) return <Loading />;

  return (
    <View style={[styles.findJobContainer, { paddingBottom: insets.bottom }]}>
      {!showData && (
        <FlatList
          data={jobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.gid.toString()}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          onEndReached={() => {
            if (jobs.length < 10) return;
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          ItemSeparatorComponent={() => <LineDivider />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  findJobContainer: {
    flex: 1,
  },
});
