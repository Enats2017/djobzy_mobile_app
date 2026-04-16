import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GoogleMap from './GoogleMap';

const Map = ({ latitude, longitude, address, zoom = 0.001, marker = true }) => {
    const [region, setRegion] = useState(null);

    useEffect(() => {
        // set exact location + zoom on load
        setRegion({
            latitude: latitude || -33.8688,
            longitude: longitude || 151.2195,
            latitudeDelta: zoom,
            longitudeDelta: zoom,
        });
    }, []);

    if (!region) return null;
    return (
        <View style={styles.section}>
            <GoogleMap
                latitude={latitude}
                longitude={longitude}
                address={address}
                region={region}
                onRegionChange={(r) => {
                    setRegion(r);
                }}
                marker={marker}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        mariginTop: 0,
    }
});

export default Map;