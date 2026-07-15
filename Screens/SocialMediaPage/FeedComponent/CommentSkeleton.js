import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

function SkeletonRow({ delay = 0 }) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.row, { opacity }]}>
            <View style={styles.avatar} />
            <View style={styles.body}>
                <View style={styles.nameLine} />
                <View style={styles.textFull} />
                <View style={styles.textShort} />
            </View>
        </Animated.View>
    );
}

export default function CommentSkeleton({ count = 4 }) {
    return (
        <View>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonRow key={i} delay={i * 100} />
            ))}
        </View>
    );
}

const GREY = "#ececec";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        gap: 12,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: GREY,
    },
    body: {
        flex: 1,
        gap: 8,
        justifyContent: "center",
    },
    nameLine: {
        width: "38%",
        height: 11,
        borderRadius: 6,
        backgroundColor: GREY,
    },
    textFull: {
        width: "92%",
        height: 10,
        borderRadius: 5,
        backgroundColor: GREY,
    },
    textShort: {
        width: "60%",
        height: 10,
        borderRadius: 5,
        backgroundColor: GREY,
    },
});