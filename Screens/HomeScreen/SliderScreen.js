import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";

import Screen1 from "./FirstPage";
import Screen2 from "./SecondPage";
import Screen3 from "./ThirdPage";

const SliderScreen = () => {
  const pagerRef = useRef(null);
  const [activePage, setActivePage] = useState(0);

  const goNext = () => {
    if (pagerRef.current && activePage < 2) {
      pagerRef.current.setPage(activePage + 1);
    }
  };

  return (
    <PagerView
      ref={pagerRef}
      style={styles.pager}
      initialPage={0}
      onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
    >
      <View key="1">
        <Screen1 onNext={goNext} />
      </View>

      <View key="2">
        <Screen2 onNext={goNext} />
      </View>

      <View key="3">
        <Screen3 />
      </View>
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pager: { flex: 1 },
});

export default SliderScreen;
