import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import JobCard from "../EmployeeJobs/JobCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGlobalSearch } from "../SearchScreen/useGlobalSearch";

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const hasFetched = useRef(false);
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
    orderBy: orderBy,
    sortOrder: sortOrder,
  } = useGlobalSearch();

  const subcategory = getSubcategoryParam();
  const category = getCategoryParam();

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
      sortBy: orderBy,
      sortOrder: sortOrder
    });

    console.log("🔍 Constructed query string:", params.toString());

    return params.toString();
  }, [keyword, latitude, longitude, subcategory, category, low_price, high_price, radius, isRemoteJob, orderBy,
    sortOrder]);

  const fetchJobs = useCallback(async (pageNum = 1) => {
    try {
      if (loading || isFetchingMore) return;
      if (pageNum === 1) setLoading(true);
      else setIsFetchingMore(true);
      // console.log("📡 Fetching jobs for page:", pageNum);
      const res = await fetch(`${API_URL}/best-matches?${queryString}&page=${pageNum}`, {
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
          (gig) => !prev.some((j) => j.gid === gig.gid)
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
  }, [loading, isFetchingMore, queryString]);

  useEffect(() => {
    hasFetched.current = true;
    setJobs([]);
    setPage(1);
    setHasMore(true);
    fetchJobs(1);
  }, [queryString]);

  if (loading) return <Loading />;
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
    return <JobCard item={item} lastItem={isLastItem} />
  };

  return (
    <View style={[styles.findJobContainer, { paddingBottom: insets.bottom }]}>
      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.gid.toString()}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false; }}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current && hasMore && !isFetchingMore && !loading) {
            // console.log("🚀 Triggering next page:", page + 1);
            fetchJobs(page + 1);
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  findJobContainer: {
    flex: 1,
  },
});
