import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Animated
} from 'react-native';

const { width } = Dimensions.get('window');

const SwitchOverlayAnimation = ({ accountType, footerHeight = 0 }) => {
    const textOpacity = useRef(new Animated.Value(0)).current;
    const yellowOpacity = useRef(new Animated.Value(0)).current;
    const pinkOpacity = useRef(new Animated.Value(0)).current;
    const greenOpacity = useRef(new Animated.Value(0)).current;
    const personOpacity = useRef(new Animated.Value(0)).current;
    const personScale = useRef(new Animated.Value(0.85)).current;
    const profileImage = accountType === 0 ? require("../assets/images/employeeProfile.png") : require("../assets/images/employerProfile.png");

    useEffect(() => {
        Animated.sequence([
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),

            Animated.parallel([
                Animated.timing(yellowOpacity, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }),

                Animated.timing(pinkOpacity, {
                    toValue: 1,
                    duration: 220,
                    useNativeDriver: true,
                }),

                Animated.timing(greenOpacity, {
                    toValue: 1,
                    duration: 260,
                    useNativeDriver: true,
                }),
            ]),

            Animated.parallel([
                Animated.timing(personOpacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),

                Animated.spring(personScale, {
                    toValue: 1,
                    friction: 7,
                    tension: 70,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <View
            style={[
                styles.overlay,
                {
                    bottom: footerHeight,
                },
            ]}
        >

            {/* Green Arc */}
            <Animated.Image
                source={require("../assets/images/greenArc.png")}
                style={[
                    styles.greenArc,
                    { opacity: greenOpacity, },
                ]}
                resizeMode="contain"
            />

            {/* Pink Arc */}
            <Animated.Image
                source={require("../assets/images/pinkArc.png")}
                style={[
                    styles.pinkArc,
                    {
                        opacity: pinkOpacity,
                    },
                ]}
                resizeMode="contain"
            />

            {/* Yellow Arc */}
            <Animated.Image
                source={require("../assets/images/yellowArc.png")}
                style={[
                    styles.yellowArc,
                    {
                        opacity: yellowOpacity,
                    },
                ]}
                resizeMode="contain"
            />

            {/* Main Profile */}
            <Animated.Image
                source={profileImage}
                resizeMode="contain"
                style={[
                    styles.profileImage,
                    {
                        opacity: personOpacity,
                        transform: [
                            {
                                scale: personScale,
                            },
                        ],
                    },
                ]}
            />

            {/* Text */}
            <Animated.View
                style={[
                    styles.textContainer,
                    {
                        opacity: textOpacity,
                    },
                ]}
            >
                <Text style={styles.smallText}>
                    Switching to
                </Text>

                <Text style={styles.bigText}>
                    {accountType === 0
                        ? "Employer..."
                        : "Employee..."}
                </Text>
            </Animated.View>
        </View >
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: -Dimensions.get("window").height,
        height: Dimensions.get("window").height,
        backgroundColor: "#000",
        zIndex: 99999,
        overflow: "hidden",
    },

    greenArc: {
        position: 'absolute',
        width: "100%",
        height: 200,
        bottom: 350,
        alignSelf: 'center',
    },

    pinkArc: {
        position: 'absolute',
        width: "100%",
        height: 200,
        bottom: 210,
        alignSelf: 'center',
    },

    yellowArc: {
        position: 'absolute',
        width: width * 1.9,
        height: 200,
        bottom: 70,
        alignSelf: 'center',
        zIndex: 20,
    },

    profileImage: {
        position: 'absolute',
        width: width * 0.75,
        height: width * 1.1,
        bottom: 250,
        alignSelf: 'center',
        zIndex: 10,
    },

    textContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
    },

    smallText: {
        color: "#fff",
        fontSize: 18,
        lineHeight: 30,
        fontFamily: "Montserrat_500Medium",
    },

    bigText: {
        color: "#fff",
        fontSize: 28,
        lineHeight: 30,
        fontFamily: "Montserrat_500Medium",
    },
});

export default SwitchOverlayAnimation;