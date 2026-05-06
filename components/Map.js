import React, { useEffect, useState, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleMap from './GoogleMap';

const FALLBACK = { latitude: -33.8688, longitude: 151.2195 };

const Map = ({ latitude, longitude, address, zoom = 0.05, marker = true }) => {
    const [region, setRegion] = useState(null);

    useEffect(() => {
        initLocation();
    }, [latitude, longitude]);

    const initLocation = async () => {
        if (latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude) && !(latitude === 0 && longitude === 0)) {
            setRegion({
                latitude,
                longitude,
                latitudeDelta: zoom,
                longitudeDelta: zoom,
            });
            return;
        }

        try {
            const saved = await AsyncStorage.getItem('userCurrentLocation');
            if (saved) {
                const { lat, lng } = JSON.parse(saved);
                setRegion({ latitude: lat, longitude: lng, latitudeDelta: zoom, longitudeDelta: zoom });
                return;
            }
        } catch (e) {
            console.log('AsyncStorage error:', e);
        }
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                const lat = loc.coords.latitude;
                const lng = loc.coords.longitude;
                await AsyncStorage.setItem('userCurrentLocation', JSON.stringify({ lat, lng }));
                setRegion({ latitude: lat, longitude: lng, latitudeDelta: zoom, longitudeDelta: zoom });
            } else {
                setRegion({ ...FALLBACK, latitudeDelta: zoom, longitudeDelta: zoom });
            }
        } catch (e) {
            console.log('Location error:', e);
            setRegion({ ...FALLBACK, latitudeDelta: zoom, longitudeDelta: zoom });
        }
    };

    if (!region) {
        return (
            <View style={[styles.section, { height: 300, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#666666', fontFamily: "Montserrat_600SemiBold", }}>Loading map...</Text>
            </View>
        );
    }
    return (
        <View style={styles.section}>
            <GoogleMap
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

export default memo(Map);