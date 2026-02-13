import React, { useRef } from "react";
import { ActivityIndicator, StyleSheet, View, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import JobCard from "../EmployeeJobs/JobCard";

const JobCategoryResult = ({
  gigs,
  fetchMore,
  isFetchingMore,
  hasMore,
}) => {
  const insets = useSafeAreaInsets();
  const onEndReachedCalledDuringMomentum = useRef(false);

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{ paddingBottom: 10 }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  };

  console.log("JOBS STATE:", gigs.length);
  const renderJobCard = ({ item, index }) => {

    const isLastItem = index === gigs.length - 1;
    return <JobCard item={item} lastItem={isLastItem} />;
  };

  return (
    <View style={[styles.findJobContainer, { paddingBottom: insets.bottom }]}>
      <FlatList
        data={gigs}
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
            !isFetchingMore
          ) {
            fetchMore();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  findJobContainer: {
    flex: 1,
  },
});

export default JobCategoryResult;
