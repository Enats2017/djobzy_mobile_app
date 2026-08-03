import React, { useRef, useEffect } from "react";
import { Animated, TouchableOpacity, View, StyleSheet } from "react-native";

const CustomSwitch = ({ value, onChange, size = 30, disabled = false }) => {
    const trackHeight = size;
    const trackWidth = size * 2;
    const knobSize = size - 6;
    const padding = 3;

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
        outputRange: [padding, trackWidth - knobSize - padding],
    });

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["#c3c3c3", "#D17B68"],
    });

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={() => onChange(!value, true)}
            activeOpacity={0.9}
        >
            <Animated.View
                style={[
                    stylesSwitch.background,
                    {
                        width: trackWidth,
                        height: trackHeight,
                        borderRadius: trackHeight / 2,
                        backgroundColor,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        stylesSwitch.knob,
                        {
                            width: knobSize,
                            height: knobSize,
                            borderRadius: knobSize / 2,
                            transform: [{ translateX }],
                        },
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const stylesSwitch = StyleSheet.create({
    background: {
        justifyContent: "center",
    },
    knob: {
        backgroundColor: "#fff",
        elevation: 2,
    },
});

export default CustomSwitch;