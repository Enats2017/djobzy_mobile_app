import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Image as RNImage } from "react-native";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_PADDING = 15;
const CARD_WIDTH = SCREEN_WIDTH - CARD_PADDING * 2;

const MIN_HEIGHT = 220;
const MAX_HEIGHT = 520;
const DEFAULT_RATIO = 1.25;

export default function FeedImage({ uri, width: knownWidth, height: knownHeight }) {
    const [ratio, setRatio] = useState(
        knownWidth && knownHeight ? knownHeight / knownWidth : null
    );

    useEffect(() => {
        if (ratio || !uri) return;
        let cancelled = false;
        RNImage.getSize(
            uri,
            (w, h) => {
                if (!cancelled && w && h) setRatio(h / w);
            },
            () => {
                if (!cancelled) setRatio(DEFAULT_RATIO);
            }
        );

        return () => {
            cancelled = true;
        };
    }, [uri, ratio]);

    const computedHeight = ratio
        ? Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, CARD_WIDTH * ratio))
        : MIN_HEIGHT;

    return (
        <View style={[styles.wrap, { height: computedHeight }]}>
            <Image
                source={{ uri }}
                style={styles.image}
                contentFit="cover"
                cachePolicy="disk"
                transition={150}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        width: "100%",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 12,
        backgroundColor: "#111",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});