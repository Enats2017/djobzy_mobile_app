import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NoContract = () => {
    return (
        <View style={styles.container}>
            <Ionicons name="document-text-outline" size={64} color="#C8C8D0" />
            <Text style={styles.title}>No active contracts</Text>
            <Text style={styles.subtitle}>You don't have any active contract at the moment</Text>
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