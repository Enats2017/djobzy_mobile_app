import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleMap from './GoogleMap';

const FALLBACK = { latitude: -33.8688, longitude: 151.2195 };

const Map = ({ latitude, longitude, address, zoom = 0.05, marker = true }) => {
    const [region, setRegion] = useState(null);

    useEffect(() => {
        initLocation();
    }, []);

    const initLocation = async () => {
        // If parent already passed valid lat/long, use it directly
        if (latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude) && !(latitude === 0 && longitude === 0) ) {
            setRegion({
                latitude,
                longitude,
                latitudeDelta: zoom,
                longitudeDelta: zoom,
            });
            return;
        }

        // Check if we already saved location in local storage
        try {
            const saved = await AsyncStorage.getItem('userCurrentLocation');
            console.log(saved);
            if (saved) {
                const { lat, lng } = JSON.parse(saved);
                setRegion({ latitude: lat, longitude: lng, latitudeDelta: zoom, longitudeDelta: zoom });
                return;
            }
        } catch (_) { }

        // Request permission and fetch current location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            try {
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                const lat = loc.coords.latitude;
                const lng = loc.coords.longitude;

                // Save to local storage for future use
                await AsyncStorage.setItem('userCurrentLocation', JSON.stringify({ lat, lng }));
                setRegion({ latitude: lat, longitude: lng, latitudeDelta: zoom, longitudeDelta: zoom });
            } catch (_) {
                setRegion({ ...FALLBACK, latitudeDelta: zoom, longitudeDelta: zoom });
            }
        } else {
            // Permission denied — fall back to default
            setRegion({ ...FALLBACK, latitudeDelta: zoom, longitudeDelta: zoom });
        }
    };

    if (!region) return null;
    return (
        <View style={styles.section}>
            <GoogleMap
                latitude={region.latitude}
                longitude={region.longitude}
                address={address}
                region={region}
                onRegionChange={(r) => setRegion(r)}
                marker={marker}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section: { marginTop: 0 }
});

export default Map;