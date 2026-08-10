// components/FeedVideo.js
//
// Reels-style behavior:
// - Muted autoplay when the card is the "active" one in the list (>~60% visible)
// - Pauses immediately when scrolled away or app backgrounds
// - Thumbnail-first: we never even mount the real <VideoView> player until
//   the cell becomes active. On a long feed this matters a LOT — mounting
//   20 video players at once (one per FlashList cell, even off-screen ones
//   FlashList keeps warm) is how RN apps OOM-crash on lower-end Android.
// - Tap toggles play/pause (with an Instagram-style centre icon), the corner
//   button toggles mute, and a hairline progress bar tracks playback.
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
//
// PERF NOTES for the playback controls (see <VideoProgress/>):
// - The progress bar is driven by a Reanimated shared value, so the 4x/sec
//   playback ticks animate on the UI thread and re-render NOTHING in React.
// - The only React state that ticks is the "0:07 / 0:15" label, and it's
//   isolated inside <VideoProgress/> (a leaf) and gated so it only sets state
//   when the rendered string actually changes — i.e. ~1x/sec, never touching
//   FeedVideo, FeedPost or the list.
// - <VideoProgress/> is mounted only on the active cell, and it turns
//   timeUpdate events off on unmount, so off-screen videos emit nothing.

import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    AppState,
    Dimensions,
    Image as RNImage,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    withSpring,
    cancelAnimation,
    Easing,
} from "react-native-reanimated";
import { useActiveMedia } from "../Context/ActiveMediaContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_PADDING = 15;
const CARD_WIDTH = SCREEN_WIDTH - CARD_PADDING * 2;

const MIN_HEIGHT = 250;
const MAX_HEIGHT = 520;
const DEFAULT_RATIO = 9 / 16; // fallback guess before we know real size

// How often expo-video reports playback position. 0.25s is enough to keep the
// bar honest; the gap between ticks is filled by a linear UI-thread animation
// so it still reads as continuous motion.
const TICK = 0.25;

function formatTime(seconds) {
    const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/**
 * Progress bar + "current / total" label for the currently playing video.\
 *
 * Mounted ONLY while the cell is active, so nothing here runs for off-screen
 * videos. The bar itself never re-renders React — position lives in a shared
 * value and is animated on the UI thread.
 */
const VideoProgress = memo(function VideoProgress({ player }) {
    const progress = useSharedValue(0);
    // Seeded with the card width so the fill starts off-screen on the very
    // first frame, before onLayout has given us the real measurement.
    const trackWidth = useSharedValue(CARD_WIDTH);

    const [label, setLabel] = useState("");
    const lastLabel = useRef("");
    const lastTime = useRef(0);
    const durationRef = useRef(0);

    // Turn position reporting on for this player while we're mounted, and off
    // again the moment the cell stops being the active one.
    useEffect(() => {
        if (!player) return;
        try {
            player.timeUpdateEventInterval = TICK;
        } catch (e) { }
        return () => {
            try {
                player.timeUpdateEventInterval = 0;
            } catch (e) { }
        };
    }, [player]);

    const onTimeUpdate = useCallback(
        ({ currentTime }) => {
            // Some platforms keep emitting ticks while paused. Once we're up and
            // running, a repeat of the same position is pure noise — bail before
            // touching the UI thread at all.
            if (lastLabel.current && currentTime === lastTime.current) return;

            let duration = durationRef.current;
            if (!duration) {
                // `duration` is only known once metadata has loaded; read it
                // until we get a real number, then stop touching the native side.
                const d = player?.duration || 0;
                if (d > 0) durationRef.current = duration = d;
            }
            if (!duration) return;

            const pct = Math.min(1, Math.max(0, currentTime / duration));

            if (currentTime + 0.05 < lastTime.current) {
                // Looped back to the start (player.loop = true) — snap, don't
                // animate the bar backwards across the whole card.
                cancelAnimation(progress);
                progress.value = pct;
            } else {
                progress.value = withTiming(pct, {
                    duration: TICK * 1000 + 60,
                    easing: Easing.linear,
                });
            }
            lastTime.current = currentTime;

            const next = `${formatTime(currentTime)} / ${formatTime(duration)}`;
            if (next !== lastLabel.current) {
                lastLabel.current = next;
                setLabel(next); // ~1x/sec, and only this leaf re-renders
            }
        },
        [player, progress]
    );

    useEventListener(player, "timeUpdate", onTimeUpdate);

    const onTrackLayout = useCallback(
        (e) => {
            // Writing to a shared value — deliberately NOT state, so measuring
            // the bar costs zero renders.
            trackWidth.value = e.nativeEvent.layout.width;
        },
        [trackWidth]
    );

    // Clipped track + translated fill instead of scaleX, so the bar is exact
    // at any card width and the whole thing stays a native transform.
    const fillStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: -(1 - progress.value) * trackWidth.value }],
    }));

    return (
        <>
            {!!label && (
                <View style={styles.timePill} pointerEvents="none">
                    <Text style={styles.timeText}>{label}</Text>
                </View>
            )}

            <View style={styles.track} pointerEvents="none" onLayout={onTrackLayout}>
                <Animated.View style={[styles.fill, fillStyle]} />
            </View>
        </>
    );
});

function FeedVideo({
    id,
    uri,
    thumbnailUrl,
    width: knownWidth,
    height: knownHeight,
}) {
    const { activeId } = useActiveMedia();
    const isActive = activeId === id;

    const [muted, setMuted] = useState(true);
    const [paused, setPaused] = useState(false);
    const [ratio, setRatio] = useState(
        knownWidth && knownHeight ? knownHeight / knownWidth : null
    );
    const appState = useRef(AppState.currentState);
    // Mirror of `paused` so the AppState listener can read it without having
    // to re-subscribe every time the user taps.
    const pausedRef = useRef(false);

    const iconOpacity = useSharedValue(0);
    const iconScale = useSharedValue(0.7);

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
            // Scrolling away clears a manual pause, so coming back autoplays
            // like every other card. Guarded so the common case (scrolling past
            // a video nobody touched) costs zero renders.
            if (pausedRef.current) {
                pausedRef.current = false;
                setPaused(false);
            }
            cancelAnimation(iconOpacity);
            iconOpacity.value = 0;
        }
    }, [isActive, player, iconOpacity]);

    // Pause on app background/inactive, resume only if still the active cell
    // AND the user hasn't deliberately paused it.
    useEffect(() => {
        const sub = AppState.addEventListener("change", (next) => {
            if (!player) return;
            if (next === "background" || next === "inactive") {
                player.pause();
            } else if (next === "active" && isActive && !pausedRef.current) {
                player.play();
            }
            appState.current = next;
        });
        return () => sub.remove();
    }, [player, isActive]);

    const toggleMute = useCallback(() => setMuted((m) => !m), []);

    const togglePlay = useCallback(() => {
        if (!player) return;

        // Drive the native player straight from the tap — no state round-trip
        // in front of it, so play/pause lands on the same frame as the touch.
        const wasPlaying = player.playing;
        if (wasPlaying) {
            player.pause();
        } else {
            player.play();
        }

        const nowPaused = wasPlaying;
        pausedRef.current = nowPaused;
        setPaused(nowPaused);

        // Pop the centre icon. Paused keeps the ▶ on screen as the "tap to
        // resume" affordance (Instagram does the same); resuming flashes ⏸
        // and fades it straight back out.
        cancelAnimation(iconScale);
        cancelAnimation(iconOpacity);
        iconScale.value = withSequence(
            withTiming(0.65, { duration: 1 }),
            withSpring(1, { damping: 13, stiffness: 260, mass: 0.6 })
        );
        iconOpacity.value = nowPaused
            ? withTiming(1, { duration: 110 })
            : withSequence(
                withTiming(1, { duration: 90 }),
                withDelay(180, withTiming(0, { duration: 200 }))
            );
    }, [player, iconOpacity, iconScale]);

    const iconStyle = useAnimatedStyle(() => ({
        opacity: iconOpacity.value,
        transform: [{ scale: iconScale.value }],
    }));

    return (
        <View style={[styles.wrap, { height: computedHeight }]}>
            {isActive ? (
                <>
                    <VideoView player={player} style={styles.media} contentFit="contain" nativeControls={false} />
                    <Pressable style={StyleSheet.absoluteFill} onPress={togglePlay} android_disableSound />
                    <View style={[StyleSheet.absoluteFill, styles.centerWrap]} pointerEvents="none" >
                        <Animated.View style={[styles.iconBubble, iconStyle]}>
                            <MaterialIcons
                                name={paused ? "play-arrow" : "pause"}
                                size={38}
                                color="#fff"
                            />
                        </Animated.View>
                    </View>
                    <VideoProgress player={player} />
                    <TouchableOpacity style={styles.muteBtn} onPress={toggleMute} hitSlop={8} >
                        <MaterialIcons name={muted ? "volume-off" : "volume-up"} size={18} color="#fff" />
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

// Props are primitives straight off the feed row, so a parent re-render
// (a like, a comment count bump) can't force the player to re-render.
// activeId still arrives via context, which memo intentionally doesn't block.
export default memo(FeedVideo);

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
    centerWrap: {
        justifyContent: "center",
        alignItems: "center",
    },
    iconBubble: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },
    muteBtn: {
        position: "absolute",
        bottom: 12,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    timePill: {
        position: "absolute",
        bottom: 14,
        left: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    timeText: {
        color: "#fff",
        fontSize: 11,
        fontFamily: "Montserrat_400Regular",
    },
    track: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        backgroundColor: "rgba(255,255,255,0.22)",
        overflow: "hidden",
    },
    fill: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
    },
});
