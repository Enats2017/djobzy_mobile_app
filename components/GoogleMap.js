import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function GoogleMap({ address, region, marker = true }) {
  return (
    <View style={styles.section}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        // onRegionChangeComplete={(r) => { console.log("Map moved to:", r);}}
      >
        {marker && (
          <Marker
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            title={address || "Location"}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    height: 300,
    borderColor: "#222222",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
  },
  map: { width: '100%', height: 300 },
});