import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

function MentionRow({ item, onPress }) {
    return (
        <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.7}>
            <Image
                source={{ uri: item.photo }}
                style={styles.avatar}
                contentFit="cover"
                cachePolicy="disk"
            />
            <Text style={styles.rowText} numberOfLines={1}>
                {item.full_name}
            </Text>
        </TouchableOpacity>
    );
}

function HashtagRow({ item, onPress }) {
    return (
        <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.7}>
            <View style={styles.hashIconWrap}>
                {item.icon_url ? (
                    <Image source={{ uri: item.icon_url }} style={styles.hashIcon} contentFit="contain" />
                ) : (
                    <Ionicons
                        name={item.type === "job" ? "briefcase-outline" : "pricetag-outline"}
                        size={20}
                        color="#DD6B55"
                    />
                )}
            </View>
            <View style={styles.hashBody}>
                <Text style={styles.rowText} numberOfLines={1}>#{item.tag}</Text>
                {item.sub && (
                    <Text style={styles.rowSub} numberOfLines={1}>{item.sub}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

export default function FilterSuggestionList({ suggestions, type, loading, onSelect }) {
    if (!loading && suggestions.length === 0) return null;

    return (
        <View style={styles.wrap}>
            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="small" color="#DD6B55" />
                </View>
            ) : (
                <ScrollView
                    style={styles.suggestionScroll}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                >
                    {suggestions.map((item, index) => (
                        <React.Fragment key={index}>
                            {type === "mention" ? (
                                <MentionRow item={item} onPress={onSelect} />
                            ) : (
                                <HashtagRow item={item} onPress={onSelect} />
                            )}

                            {index !== suggestions.length - 1 && (
                                <View style={styles.separator} />
                            )}
                        </React.Fragment>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#fff",
        maxHeight: 200,
        marginBottom: 8,
    },
    loadingWrap: {
        paddingVertical: 16,
        alignItems: "center",
    },
    separator: {
        height: 1,
        backgroundColor: "#c3c3c3",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 7,
        gap: 10,
    },

    avatar: {
        width: 35,
        height: 35,
        borderRadius: 100,
        backgroundColor: "#c3c3c3",
    },
    rowText: {
        color: "#1e1e1e",
        fontSize: 14,
        lineHeight: 19,
        fontFamily: "Montserrat_500Medium",
        flex: 1,
    },

    hashIconWrap: {
        width: 35,
        height: 35,
        borderRadius: 100,
        backgroundColor: "#ecedef",
        alignItems: "center",
        justifyContent: "center",
    },
    hashIcon: {
        width: 18,
        height: 18,
    },
    hashBody: {
        flex: 1,
    },
    rowSub: {
        color: "#1e1e1e",
        fontSize: 11,
        fontFamily: "Montserrat_400Regular",
        marginTop: 1,
    },
});