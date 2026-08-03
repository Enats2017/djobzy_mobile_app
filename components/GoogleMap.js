import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function GoogleMap({ address, region, marker = true }) {
  if (!region || !region.latitude || !region.longitude) {
    return (
      <View style={[styles.section, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666666', fontFamily: "Montserrat_600SemiBold", }}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {marker && region?.latitude && region?.longitude && (
          <Marker
            coordinate={{ 
              latitude: region.latitude, 
              longitude: region.longitude 
            }}
            title={address || "Current Location"}
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
    borderWidth: 0,
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
  },
  map: { width: '100%', height: 300 },
});