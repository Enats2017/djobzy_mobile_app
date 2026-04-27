// SkeletonBox.jsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function SkeletonBox({ width, height, style }) {
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmer, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <View style={[{ width, height, borderRadius: 5, overflow: 'hidden', backgroundColor: '#E0E0E0' }, style]}>
            <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.55)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </View>
    );
}