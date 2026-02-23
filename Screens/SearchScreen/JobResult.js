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
    searchTrigger
  } = useGlobalSearch();

  const subcategory = getSubcategoryParam();
  const category = getCategoryParam();

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const hasFetched = useRef(false);

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
    });

    return params.toString();
  }, [keyword, latitude, longitude, subcategory, category, low_price, high_price, radius, isRemoteJob]);

  const fetchJobs = useCallback(
    async (pageNum = 1) => {
      try {
        if (loading || isFetchingMore) return;

        if (pageNum === 1) setLoading(true);
        else setIsFetchingMore(true);

        const url = `${API_URL}/search-result?${queryString}&page=${pageNum}`;
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
        setPage(pageNum);
      } catch (err) {
        console.log("❌ Error fetching jobs:", err);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    [queryString, loading, isFetchingMore],
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      console.log("🔁 Filters changed — resetting pagination 22222");
      fetchJobs(1);
    }
  }, [fetchJobs]);

  useEffect(() => {
    if (searchTrigger === 0) return;
    console.log("🔁 Filters changed — resetting pagination");
    setJobs([]);
    setPage(1);
    fetchJobs(1);
  }, [searchTrigger]);

  if (loading && page === 1) return <Loading />;

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{ paddingBottom: 10 }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  };

  const renderJobCard = ({ item, index }) => {
    const isLastItem = index === jobs.length - 1;
    return <JobCard item={item} lastItem={isLastItem} />;
  };

  return (
    <View style={[styles.findJobContainer, { paddingBottom: insets.bottom }]}>
      {!showData && (
        <FlatList
          data={jobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.gid.toString()}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          onEndReached={() => {
            if (
              !onEndReachedCalledDuringMomentum.current &&
              hasMore &&
              !isFetchingMore &&
              !loading
            ) {
              fetchJobs(page + 1);
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
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
