import React, { memo, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome6, Ionicons } from 'react-native-vector-icons';
import { getFacilityIcon, getFacilityInitials } from '../HotelUtils/HotelConstants';

function HotelFacilitiesAndServiceSection({ facilities }) {
    return (
        <>
            {facilities.length > 0 ? (
                <View style={styles.chipGrid}>
                    {facilities.map((facility, index) => {
                        const iconName = getFacilityIcon(facility);
                        return (
                            <View key={index} style={styles.chip}>
                                {iconName ? (
                                    <Ionicons
                                        name={iconName}
                                        size={26}
                                        color="#C97863"
                                        style={{ marginRight: 8 }}
                                    />
                                ) : (
                                    <View style={styles.initialsBadge}>
                                        <Text style={styles.initialsText}>
                                            {getFacilityInitials(facility)}
                                        </Text>
                                    </View>
                                )}
                                <Text style={styles.chipText} numberOfLines={1}>
                                    {facility}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            ) : (
                <Text style={styles.emptyText}>No facilities added.</Text>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBEBEB',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginRight: 10,
        marginBottom: 10,
    },
    chipText: {
        color: '#333333',
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
    },
    initialsBadge: {
        width: 30,
        height: 30,
        borderRadius: 6,
        backgroundColor: 'rgba(201,120,99,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    initialsText: {
        color: '#C97863',
        fontSize: 13,
        lineHeight: 19,
        fontFamily: 'Montserrat_700Bold',
    },
});

export default HotelFacilitiesAndServiceSection;