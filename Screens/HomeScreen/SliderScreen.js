import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import Screen1 from "./FirstPage";
import Screen2 from "./SecondPage";
import Screen3 from "./ThirdPage";


const SliderScreen = () => {
  const [activePage, setActivePage] = useState(0);

  return (
    
      <>
      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
      >
        <View key="1">
          <Screen1/>
        </View>
        <View key="2">
          <Screen2 />
        </View>
        <View key="3">
          <Screen3 />
        </View>
      </PagerView>

   
      
      </>
      
   
  );
};

const styles = StyleSheet.create({
  

  pager: { flex: 1,},
  
  
  
});

export default SliderScreen;
