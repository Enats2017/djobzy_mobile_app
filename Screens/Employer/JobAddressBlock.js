import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Map from '../../components/Map';

const JobAddressBlock = ({ details }) => {

    const location = details?.preferred_location;
    const isRemote = details?.is_remote_job === 1;
    const hasLocation = location && location.trim() !== '';
    const latitude = details?.preferred_location_lat ? parseFloat(details?.preferred_location_lat) : null;
    const longitude = details?.preferred_location_long ? parseFloat(details?.preferred_location_long) : null;

    if (!hasLocation && !isRemote) return null;

    return (
        <View style={styles.cardContainer}>
            <View style={styles.descriptionContainer}>
                <Text style={styles.cardHeading}>Address of the job</Text>
                <View style={styles.addressSection}>
                    {hasLocation ? (
                        <View style={styles.addressRow}>
                            <Ionicons name="location-outline" size={20} color="#fff" />
                            <Text style={styles.addressText}>
                                {location}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.addressText}>
                            The job has no physical address
                        </Text>
                    )}
                    {isRemote && (
                        <View style={styles.remoteBadge}>
                            <Ionicons name="earth-outline" size={14} color="#fff" />
                            <Text style={styles.remoteText}>Remote</Text>
                        </View>
                    )}
                </View>
                {hasLocation && (
                    <View style={styles.mapsection}>
                        <Map
                            latitude={latitude || -33.8688}
                            longitude={longitude || 151.2195}
                            zoom={0.5}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderTopWidth: 1,
        borderTopColor: "#ffffff33",
        paddingTop: 10,
        marginBottom: 8,
    },

    cardHeading: {
        color: "#ffffff",
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 5,
        letterSpacing: 0.1,
    },
    addressSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 7,
        marginBottom: 10,
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    addressText: {
        color: "#ffffff",
        fontSize: 15,
        fontFamily: "Montserrat_400Regular",
        lineHeight: 21,
    },
    remoteBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#374151",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },

    remoteText: {
        fontSize: 13,
        fontWeight: "Montserrat_600SemiBold",
        color: "#fff",
    },
});

export default JobAddressBlock;