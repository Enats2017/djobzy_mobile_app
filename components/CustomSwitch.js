import React, { useRef, useEffect } from "react";
import { Animated, TouchableOpacity, View, StyleSheet } from "react-native";

const CustomSwitch = ({ value, onChange }) => {
    const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: value ? 1 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 28],
    });

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["#c3c3c3", "#D17B68"],
    });

    return (
        <TouchableOpacity onPress={() => { onChange(!value, true); }} activeOpacity={0.9}>
            <Animated.View style={[stylesSwitch.background, { backgroundColor }]}>
                <Animated.View style={[stylesSwitch.knob, { transform: [{ translateX }] }]} />
            </Animated.View>
        </TouchableOpacity>
    );
};

const stylesSwitch = StyleSheet.create({
    background: {
        width: 60,
        height: 30,
        borderRadius: 20,
        paddingHorizontal: 3,
        justifyContent: "center",
    },
    knob: {
        width: 24,
        height: 24,
        backgroundColor: "#fff",
        borderRadius: 13,
        elevation: 2,
    },
});



export default CustomSwitch;
