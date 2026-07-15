// components/FeedVideo.js
//
// Reels-style behavior:
// - Muted autoplay when the card is the "active" one in the list (>~60% visible)
// - Pauses immediately when scrolled away or app backgrounds
// - Thumbnail-first: we never even mount the real <VideoView> player until
//   the cell becomes active. On a long feed this matters a LOT — mounting
//   20 video players at once (one per FlashList cell, even off-screen ones
//   FlashList keeps warm) is how RN apps OOM-crash on lower-end Android.
// - Tap toggles mute, tap-and-hold-free since reels apps default this way.
//
// This component is "dumb" about *whether* it's active — that's owned by
// ActiveMediaContext, set by the FlashList's onViewableItemsChanged in
// FeedScreen.js. This is the key architectural piece: visibility is a
// list-level concern, not a per-cell concern.
//
// THUMBNAILS: now backend-provided (item.thumbnail_url) instead of generated
// on-device. No more per-card decode work — until that column exists for
// older rows, we fall back to a static placeholder icon, never to
// client-side generation.
//
// SIZING — same approach as FeedImage:
// dynamic aspect ratio, clamped between MIN/MAX, instead of a fixed height.
// BEST CASE: backend stores video_width/video_height at upload — pass them
// in as `width`/`height` props and we skip extra work entirely.
// FALLBACK: once thumbnail_url is available, we read ITS dimensions with
// Image.getSize() (thumbnail inherits the video's native ratio).

import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, AppState, Dimensions, Image as RNImage } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useActiveMedia } from "../Context/ActiveMediaContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_PADDING = 15;
const CARD_WIDTH = SCREEN_WIDTH - CARD_PADDING * 2;

const MIN_HEIGHT = 250;
const MAX_HEIGHT = 520;
const DEFAULT_RATIO = 9 / 16; // fallback guess before we know real size

export default function FeedVideo({
    id,
    uri,
    thumbnailUrl,
    width: knownWidth,
    height: knownHeight,
}) {
    const { activeId } = useActiveMedia();
    const isActive = activeId === id;

    const [muted, setMuted] = useState(true);
    const [ratio, setRatio] = useState(
        knownWidth && knownHeight ? knownHeight / knownWidth : null
    );
    const appState = useRef(AppState.currentState);

    // If we don't already know the ratio from props, read it off the
    // backend-provided thumbnail once it's available.
    useEffect(() => {
        if (ratio || !thumbnailUrl) return;

        let cancelled = false;

        RNImage.getSize(
            thumbnailUrl,
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
    }, [thumbnailUrl, ratio]);

    const computedHeight = ratio
        ? Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, CARD_WIDTH * ratio))
        : MIN_HEIGHT;

    // Only construct the player when this cell is active — avoids holding
    // N decoders in memory for a list of N videos.
    const player = useVideoPlayer(isActive ? uri : null, (p) => {
        p.loop = true;
        p.muted = muted;
    });

    useEffect(() => {
        if (!player) return;
        player.muted = muted;
    }, [muted, player]);

    useEffect(() => {
        if (!player) return;
        if (isActive) {
            player.play();
        } else {
            player.pause();
        }
    }, [isActive, player]);

    // Pause on app background/inactive, resume only if still the active cell.
    useEffect(() => {
        const sub = AppState.addEventListener("change", (next) => {
            if (!player) return;
            if (next === "background" || next === "inactive") {
                player.pause();
            } else if (next === "active" && isActive) {
                player.play();
            }
            appState.current = next;
        });
        return () => sub.remove();
    }, [player, isActive]);

    const toggleMute = useCallback(() => setMuted((m) => !m), []);

    return (
        <View style={[styles.wrap, { height: computedHeight }]}>
            {isActive ? (
                <>
                    <VideoView
                        player={player}
                        style={styles.media}
                        contentFit="contain"
                        nativeControls={false}
                    />
                    <TouchableOpacity style={styles.muteBtn} onPress={toggleMute}>
                        <MaterialIcons
                            name={muted ? "volume-off" : "volume-up"}
                            size={18}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </>
            ) : thumbnailUrl ? (
                <Image
                    source={{ uri: thumbnailUrl }}
                    style={styles.media}
                    contentFit="contain"
                    transition={150}
                />
            ) : (
                <View style={[styles.media, styles.fallback]}>
                    <MaterialIcons name="videocam" size={42} color="#fff" />
                </View>
            )}
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
    media: {
        width: "100%",
        height: "100%",
    },
    fallback: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1f1f24",
    },
    muteBtn: {
        position: "absolute",
        bottom: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
});