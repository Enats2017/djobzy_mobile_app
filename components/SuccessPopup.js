import React, { useEffect, useRef } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Pressable,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SuccessPopupImage from "../assets/images/success_popup.png";

const { width } = Dimensions.get("window");

const colors = {
    primary: "#2563eb",
    success: "#10b981",
};

const SuccessPopup = ({
    visible,
    title = "Application Submitted",
    message = "Ready for the next step.",
    onClose,
}) => {
    const confettiAnims = useRef(
        Array.from({ length: 20 }, () => ({
            translateY: new Animated.Value(0),
            translateX: new Animated.Value(0),
            opacity: new Animated.Value(1),
        }))
    ).current;

    const confettiPositions = useRef(
    Array.from({ length: 20 }, () => Math.random() * width)
    ).current;

    useEffect(() => {
        if (visible) {
            confettiAnims.forEach((anim, index) => {
                Animated.parallel([
                    Animated.timing(anim.translateY, {
                        toValue: 600,
                        duration: 3000 + index * 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim.translateX, {
                        toValue: (Math.random() - 0.5) * 200,
                        duration: 3000 + index * 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim.opacity, {
                        toValue: 0,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ]).start();
            });
        }
    }, [visible]);

    const resetAnimations = () => {
        confettiAnims.forEach((anim) => {
            anim.translateY.setValue(0);
            anim.translateX.setValue(0);
            anim.opacity.setValue(1);
        });
    };

    const handleClose = () => {
        resetAnimations();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop} />
            {confettiAnims.map((anim, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.confetti,
                        {
                            left: confettiPositions[index],
                            top: -20,
                            backgroundColor: [
                                colors.primary,
                                colors.success,
                                "#FFD700",
                                "#FF69B4",
                                "#00CED1",
                            ][index % 5],
                            transform: [
                                { translateY: anim.translateY },
                                { translateX: anim.translateX },
                            ],
                            opacity: anim.opacity,
                        },
                    ]}
                />
            ))}

            {/* Content */}
            <View style={styles.wrapper}>
                <Pressable style={styles.card} onPress={handleClose}>
                    {/* <TouchableOpacity style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#64748b" />
                    </TouchableOpacity> */}

                    <Image
                        source={SuccessPopupImage}
                        style={{
                            // width: 120,
                            // height: 120,
                            marginBottom: 10,
                            resizeMode: "contain",
                        }}
                    />
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    {/* <TouchableOpacity style={styles.button} onPress={handleClose}>
                        <Text style={styles.buttonText}>Got It!</Text>
                    </TouchableOpacity> */}
                </Pressable>
            </View>
        </Modal>
    );
};

export default SuccessPopup;

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        width: "100%",
        maxWidth: 300,
        alignItems: "center",
        elevation: 10,
    },
    closeButton: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "#f1f5f9",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        color: "#000000",
        marginBottom: 10,
        lineHeight: 16,
        textAlign: "center",
    },
    message: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
        lineHeight: 14,
    },
    button: {
        width: "100%",
        backgroundColor: "#2563eb",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    confetti: {
        position: "absolute",
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});