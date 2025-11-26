import React from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";

const GoogleMap = ({
  region = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 100,
    longitudeDelta: 100,
  },
  containerStyle = {},
  mapStyle = {},
  onPressMap,
  onRegionChange,
}) => {
  return (
    <View style={[styles.mapsection, containerStyle]}>
      <MapView
        style={[styles.map, mapStyle]}
        initialRegion={region}
        onPress={onPressMap}
        onRegionChange={onRegionChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mapsection: {
    height: 300,
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginTop:10
  },
  map: {
    flex: 1,
  },
});

export default GoogleMap;
