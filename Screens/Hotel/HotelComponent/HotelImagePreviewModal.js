import React, { useRef, useState, useCallback } from "react";
import {
    Modal,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Above this many photos, dots get too cramped — switch to a "4 / 10" counter instead.
const DOTS_MAX_COUNT = 8;

const HotelImagePreviewModal = ({ visible, images = [], initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex ?? 0);
    const [loadingMap, setLoadingMap] = useState({});
    const flatListRef = useRef(null);

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }, []);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    });

    const handleLoadStart = (index) => {
        setLoadingMap((prev) => ({ ...prev, [index]: true }));
    };

    const handleLoadEnd = (index) => {
        setLoadingMap((prev) => ({ ...prev, [index]: false }));
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: item }}
                style={styles.fullImage}
                resizeMode="contain"
                onLoadStart={() => handleLoadStart(index)}
                onLoadEnd={() => handleLoadEnd(index)}
            />
            {loadingMap[index] && (
                <View style={styles.loaderOverlay}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )}
        </View>
    );

    const getItemLayout = (_, index) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index,
    });

    const showDots = images.length > 1 && images.length <= DOTS_MAX_COUNT;
    const showCounter = images.length > DOTS_MAX_COUNT;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <StatusBar hidden />
            <View style={styles.backdrop}>

                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <MaterialIcons name="close" size={24} color="#fff" />
                </TouchableOpacity>

                {showCounter && (
                    <View style={styles.counterPill}>
                        <Text style={styles.counterText}>
                            {currentIndex + 1} / {images.length}
                        </Text>
                    </View>
                )}

                <FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${index}-${item}`}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={initialIndex ?? 0}
                    getItemLayout={getItemLayout}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig.current}
                />

                {showDots && (
                    <View style={styles.dotsContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentIndex ? styles.dotActive : styles.dotInactive,
                                ]}
                            />
                        ))}
                    </View>
                )}

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "center",
    },
    closeBtn: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 10,
        padding: 6,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 20,
    },
    counterPill: {
        position: "absolute",
        top: 44,
        left: 20,
        zIndex: 10,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    counterText: {
        color: "#FFFFFF",
        fontSize: 12.5,
        fontFamily: "Montserrat_600SemiBold",
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
    },
    fullImage: {
        width: SCREEN_WIDTH - 30,
        height: SCREEN_HEIGHT * 0.75,
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    dotsContainer: {
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        borderRadius: 100,
    },
    dotActive: {
        width: 24,
        height: 8,
        backgroundColor: "#fff",
    },
    dotInactive: {
        width: 8,
        height: 8,
        backgroundColor: "rgba(255,255,255,0.35)",
    },
});

export default HotelImagePreviewModal;
