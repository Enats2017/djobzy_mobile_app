import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import GradientButton from '../../components/GradientButton';
import { useNavigation } from '@react-navigation/native';

export default function HotelViewAllBooking() {
    const navigation = useNavigation(); 

    return (
        <View style={styles.section}>
            <GradientButton title='Configure rooms' marginTop={0} onPress={() => navigation.navigate('ConfigureRoomsPage')} />
            <GradientButton title='View All Bookings' onPress={() => navigation.navigate('ViewAllBookingPage')} />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginTop: 20,
        padding: 16,
        borderRadius: 10,
    },
});
