import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NoContract = ({ icon, title, description }) => {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={64} color="#C8C8D0" />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'Montserrat_600SemiBold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default NoContract;