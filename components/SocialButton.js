import React, { useRef } from "react";
import { TouchableWithoutFeedback, Animated, Linking, Alert } from "react-native";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

const SocialButton = ({ icon, type, color, url }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const openSocialLink = async (url) => {
        try {
            // console.log("Opening URL:", url);
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.log("Cannot open URL:", url);
            }
        } catch (error) {
            console.log("Error opening URL:", error);
        }
    };

    const pressIn = () => {
        Animated.spring(scale, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const pressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => openSocialLink(url)}
            onPressIn={pressIn}
            onPressOut={pressOut}
        >
            <Animated.View
                style={{
                    transform: [{ scale }],
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    // color: color,
                    backgroundColor: "#ecedef",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {type === "fa" ? (
                    <FontAwesome name={icon} size={22} color={color} />
                ) : (
                    <FontAwesome6 name={icon} size={22} color={color} />
                )}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

export default SocialButton;