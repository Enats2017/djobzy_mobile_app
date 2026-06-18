import React, { useRef } from "react";
import { ActivityIndicator, StyleSheet, View, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import JobCard from "../EmployeeJobs/JobCard";
import { useNavigation } from "@react-navigation/native";
import LineDivider from "../../components/LineDivider";

const JobCategoryResult = ({
  gigs,
  fetchMore,
  isFetchingMore,
  hasMore,
}) => {
  const insets = useSafeAreaInsets();
  const onEndReachedCalledDuringMomentum = useRef(false);
  const navigation = useNavigation();

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{ paddingBottom: 10 }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  };

  const renderJobCard = ({ item, index }) => {
    const isLastItem = index === gigs.length - 1;
    return <JobCard item={item} lastItem={isLastItem} navigation={navigation} />;
  };

  return (
    <View style={[styles.findJobContainer, { paddingBottom: insets.bottom }]}>
      <FlatList
        data={gigs}
        renderItem={renderJobCard}
        keyExtractor={(item, index) =>
          String(item?.gid ?? item?.id ?? index)
        }
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
        contentContainerStyle={{ paddingBottom: 100 }}
        ItemSeparatorComponent={() => <LineDivider />}
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
