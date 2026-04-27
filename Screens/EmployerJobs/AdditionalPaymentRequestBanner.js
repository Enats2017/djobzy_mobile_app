import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdditionalPaymentRequestBanner = ({ onView }) => {
    return (
        <View style={styles.banner}>
            <View style={styles.left}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="alert" size={14} color="#D6B98C" />
                </View>
                <Text style={styles.message}>
                    Employee requested additional payment for the job
                </Text>
            </View>

            <TouchableOpacity onPress={onView} activeOpacity={0.7}>
                <Text style={styles.viewBtn}>View</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2C2C2C',
        borderWidth: 1,
        borderColor: '#FFFFFF14',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 16,
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        marginRight: 10,
    },

    iconWrapper: {
        backgroundColor: '#FFFFFF10',
        borderRadius: 20,
        padding: 5,
        flexShrink: 0,
    },

    message: {
        fontSize: 13,
        fontFamily: 'Montserrat_500Medium',
        color: '#E6E6E6',
        lineHeight: 19,
        flex: 1,
    },

    viewBtn: {
        fontSize: 13,
        fontFamily: 'Montserrat_700Bold',
        color: '#D6B98C',
        flexShrink: 0,
    },
});

export default AdditionalPaymentRequestBanner;