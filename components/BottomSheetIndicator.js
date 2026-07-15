import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BottomSheetIndicator = () => {
    return (
        <View style={styles.grabberWrap}>
            <View style={styles.grabber} />
        </View>
    );
};

const styles = StyleSheet.create({
    grabberWrap: {
        alignItems: "center",
        marginBottom: 20,
    },
    grabber: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#e2e2e2",
    },
});

export default BottomSheetIndicator;