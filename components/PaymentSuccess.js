import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useNotifications } from "../context/MessageNotificationContext";

export default function PaymentSuccess() {
    const navigation = useNavigation();
    const route = useRoute();
    const { type } = route.params || {};
    const { admin } = useNotifications();
    const circleScale = useRef(new Animated.Value(0)).current;
    const circleOpacity = useRef(new Animated.Value(0)).current;
    const checkOpacity = useRef(new Animated.Value(0)).current;
    const checkScale = useRef(new Animated.Value(0.4)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentSlide = useRef(new Animated.Value(20)).current;
    const btnOpacity = useRef(new Animated.Value(0)).current;
    const btnSlide = useRef(new Animated.Value(16)).current;
    const btnScale = useRef(new Animated.Value(1)).current;

    // Pulsing rings
    const ring1Scale = useRef(new Animated.Value(1)).current;
    const ring1Opacity = useRef(new Animated.Value(0)).current;
    const ring2Scale = useRef(new Animated.Value(1)).current;
    const ring2Opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Step 1 — circle pops in
        Animated.parallel([
            Animated.spring(circleScale, {
                toValue: 1,
                friction: 6,
                tension: 90,
                useNativeDriver: true,
            }),
            Animated.timing(circleOpacity, {
                toValue: 1,
                duration: 280,
                useNativeDriver: true,
            }),
        ]).start();

        // Step 2 — checkmark bounces in
        Animated.sequence([
            Animated.delay(300),
            Animated.parallel([
                Animated.timing(checkOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(checkScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 130,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Step 2b — rings pulse outward, looping
        const pulseRings = () => {
            ring1Scale.setValue(1);
            ring1Opacity.setValue(0.7);
            ring2Scale.setValue(1);
            ring2Opacity.setValue(0.45);

            Animated.parallel([
                Animated.timing(ring1Scale, {
                    toValue: 1.55,
                    duration: 1400,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(ring1Opacity, {
                    toValue: 0,
                    duration: 1400,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(320),
                    Animated.parallel([
                        Animated.timing(ring2Scale, {
                            toValue: 1.55,
                            duration: 1400,
                            easing: Easing.out(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(ring2Opacity, {
                            toValue: 0,
                            duration: 1400,
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
            ]).start(() => pulseRings());
        };
        setTimeout(() => pulseRings(), 500);

        // Step 3 — text slides up
        Animated.sequence([
            Animated.delay(500),
            Animated.parallel([
                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 380,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(contentSlide, {
                    toValue: 0,
                    duration: 380,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Step 4 — button fades in
        Animated.sequence([
            Animated.delay(680),
            Animated.parallel([
                Animated.timing(btnOpacity, {
                    toValue: 1,
                    duration: 320,
                    useNativeDriver: true,
                }),
                Animated.timing(btnSlide, {
                    toValue: 0,
                    duration: 320,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const onPressIn = () =>
        Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start();

    const onPressOut = () =>
        Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

    const redirectMap = {
        "job-payment": "ActiveContract",
        "job-promote": "EmployerJobPost",
        "card-verification": "EmployeeVerification",
        "extra-job-payment": "ActiveContract",
    };

    const navigateAfterPayment = () => {
        let screen = redirectMap[type];
        if (!screen) { screen = admin === 2 ? "EmployerDashboard" : "Dashboard";}
        navigation.replace(screen);
    };

    return (
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            <StatusBar barStyle="light-content" backgroundColor="#10B981" />

            {/* ── Big green section (~62% height) ── */}
            <View style={styles.greenSection}>
                {/* Pulse ring 1 */}
                <Animated.View
                    style={[
                        styles.pulseRing,
                        {
                            opacity: ring1Opacity,
                            transform: [{ scale: ring1Scale }],
                        },
                    ]}
                />
                {/* Pulse ring 2 */}
                <Animated.View
                    style={[
                        styles.pulseRing,
                        {
                            opacity: ring2Opacity,
                            transform: [{ scale: ring2Scale }],
                        },
                    ]}
                />

                <Animated.View
                    style={[
                        styles.circleOuter,
                        {
                            opacity: circleOpacity,
                            transform: [{ scale: circleScale }],
                        },
                    ]}
                >
                    <View style={styles.circleInner}>
                        <Animated.View
                            style={{
                                opacity: checkOpacity,
                                transform: [{ scale: checkScale }],
                            }}
                        >
                            <Icon name="check" size={68} color="#10B981" />
                        </Animated.View>
                    </View>
                </Animated.View>
            </View>

            {/* ── White bottom (~38% height) ── */}
            <View style={styles.bottomSheet}>
                <Animated.View
                    style={{
                        opacity: contentOpacity,
                        transform: [{ translateY: contentSlide }],
                        alignItems: "center",
                    }}
                >
                    <Text style={styles.title}>Payment Successful!</Text>
                    <Text style={styles.subtitle}>
                        Your transaction has been completed{"\n"}and a receipt was sent to your email.
                    </Text>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.btnWrapper,
                        {
                            opacity: btnOpacity,
                            transform: [{ translateY: btnSlide }, { scale: btnScale }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        onPress={navigateAfterPayment}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Back to Home</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const CIRCLE = 148;
const CIRCLE_OUTER = CIRCLE + 30;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },

    greenSection: {
        flex: 0.62,
        backgroundColor: "#10B981",
        alignItems: "center",
        justifyContent: "center",
        borderBottomLeftRadius: 42,
        borderBottomRightRadius: 42,
    },

    circleOuter: {
        width: CIRCLE_OUTER,
        height: CIRCLE_OUTER,
        borderRadius: CIRCLE_OUTER / 2,
        backgroundColor: "rgba(255,255,255,0.22)",
        alignItems: "center",
        justifyContent: "center",
    },

    pulseRing: {
        position: "absolute",
        width: CIRCLE_OUTER,
        height: CIRCLE_OUTER,
        borderRadius: CIRCLE_OUTER / 2,
        borderWidth: 2.5,
        borderColor: "rgba(255,255,255,0.7)",
    },

    circleInner: {
        width: CIRCLE,
        height: CIRCLE,
        borderRadius: CIRCLE / 2,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 8,
    },

    bottomSheet: {
        flex: 0.38,
        backgroundColor: "#fff",
        paddingHorizontal: 28,
        paddingTop: 36,
        paddingBottom: 28,
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#0F172A",
        textAlign: "center",
        letterSpacing: -0.4,
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 14.5,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 22,
    },

    btnWrapper: {
        width: "100%",
    },

    button: {
        backgroundColor: "#10B981",
        borderRadius: 14,
        paddingVertical: 17,
        alignItems: "center",
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.32,
        shadowRadius: 12,
        elevation: 7,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
});