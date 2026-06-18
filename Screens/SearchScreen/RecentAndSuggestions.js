import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { API_ICON, API_URL } from "../../api/ApiUrl";
import { useNavigation } from "@react-navigation/native";

const RECENT_KEY = "djobzy_recent_searches";
const MAX_RECENT = 6;

export const saveRecentSearch = async (term) => {
    if (!term?.trim()) return;
    try {
        const raw = await AsyncStorage.getItem(RECENT_KEY);
        let list = raw ? JSON.parse(raw) : [];
        list = [term.trim(), ...list.filter((t) => t !== term.trim())].slice(0, MAX_RECENT);
        await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch (_) { }
};

const RecentAndSuggestions = ({ admin, onSelectTerm }) => {
    const navigation = useNavigation();
    const isEmployer = admin == 2;
    const [recents, setRecents] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadRecents = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem(RECENT_KEY);
            if (raw) setRecents(JSON.parse(raw));
        } catch (_) { }
    }, []);

    const fetchSuggestions = useCallback(async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/search-suggestions`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            setSuggestions(data?.results || []);
        } catch (_) {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, [isEmployer]);

    useEffect(() => {
        loadRecents();
        fetchSuggestions();
    }, [fetchSuggestions]);

    const handleRecentTap = async (term) => {
        await saveRecentSearch(term);
        setRecents((prev) => [term, ...prev.filter((t) => t !== term)].slice(0, MAX_RECENT));
        onSelectTerm(term);
    };

    const removeRecent = async (term) => {
        try {
            const updated = recents.filter((t) => t !== term);
            await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
            setRecents(updated);
        } catch (_) { }
    };

    const clearRecents = async () => {
        await AsyncStorage.removeItem(RECENT_KEY);
        setRecents([]);
    };

    const handleSuggestionTap = async (item) => {
        if (item.type === "service") {
            await saveRecentSearch(item.search_keyword);
            onSelectTerm(item.search_keyword);
        } else if (item.type === "job") {
            await saveRecentSearch(item.subject);
            onSelectTerm(item.subject);
        } else if (item.type === "employee") {
            await saveRecentSearch(item.name);
            onSelectTerm(item.name);
        }
    };

    const hasRecents = recents.length > 0;
    const hasSuggestions = suggestions.length > 0;

    return (
        <View style={styles.container}>
            {hasRecents && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent</Text>
                        <TouchableOpacity onPress={clearRecents} hitSlop={8}>
                            <Text style={styles.clearAll}>Clear all</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pillRow}>
                        {recents.map((term) => (
                            <View key={term} style={styles.recentPill}>
                                <TouchableOpacity
                                    onPress={() => handleRecentTap(term)}
                                    style={styles.recentPillInner}
                                >
                                    <Ionicons name="time-outline" size={13} color="#aaa" style={{ marginRight: 5 }} />
                                    <Text style={styles.recentPillText} numberOfLines={1}>
                                        {term}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => removeRecent(term)}
                                    hitSlop={6}
                                    style={styles.removeBtn}
                                >
                                    <Ionicons name="close" size={12} color="#666" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {hasRecents && <View style={styles.divider} />}

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {isEmployer ? "People & Categories" : "Jobs & Categories"}
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color="#fff" style={{ marginTop: 16 }} />
                ) : hasSuggestions ? (
                    suggestions.map((item, idx) => (
                        <SuggestionRow
                            key={idx}
                            item={item}
                            onPress={() => handleSuggestionTap(item)}
                        />
                    ))
                ) : (
                    <Text style={styles.emptyText}>Nothing to show yet</Text>
                )}
            </View>

        </View>
    );
};

const SuggestionRow = ({ item, onPress }) => {
    if (item.type === "service") {
        return (
            <>
                <TouchableOpacity style={styles.row} onPress={onPress}>
                    <View style={styles.iconWrapper}>
                        {
                            item.icon ? (
                                <Image
                                    source={{
                                        uri: `${API_ICON}/images/servicephoto/png-image/${item.icon}`,
                                    }}
                                    style={styles.image}
                                />
                            ) : (
                                <MaterialIcons name="category" size={20} color="#000" />
                            )
                        }
                    </View>

                    <View>
                        <Text style={styles.name}>{item.text}</Text>
                        <Text style={styles.sub}>{item.sub_service ?? 'category'}</Text>
                    </View>
                </TouchableOpacity>
            </>
        );
    }

    if (item.type === "job") {
        return (
            <TouchableOpacity
                style={styles.row}
                onPress={onPress}
            >
                <View style={styles.iconWrapper}>
                    <Ionicons name="briefcase-outline" size={20} color="#000" />
                </View>

                <View>
                    <Text style={styles.title}>{item.subject}</Text>
                    <Text style={styles.sub}>Job</Text>
                </View>
            </TouchableOpacity>
        );
    }

    if (item.type === "employee") {
        return (
            <TouchableOpacity style={styles.row} onPress={onPress}>
                <Image source={{ uri: item.photo }} style={styles.avatar} />

                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    {item.address && (
                        <Text style={styles.sub}>
                            {item.address}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    }

    return null;
};

export default RecentAndSuggestions;

const styles = StyleSheet.create({
    container: {
        paddingTop: 4,
    },
    section: {
        paddingVertical: 12,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: "Montserrat_600SemiBold",
        color: "#fff",
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    clearAll: {
        fontSize: 12,
        fontFamily: "Montserrat_500Medium",
        color: "#6c7fff",
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.06)",
    },

    pillRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    recentPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.07)",
        borderRadius: 20,
        paddingVertical: 6,
        paddingLeft: 10,
        paddingRight: 8,
        maxWidth: 160,
    },
    recentPillInner: {
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1,
    },
    recentPillText: {
        fontSize: 13,
        fontFamily: "Montserrat_500Medium",
        color: "#ccc",
        flexShrink: 1,
    },
    removeBtn: {
        marginLeft: 6,
        padding: 2,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderColor: "#ffffff1a",
    },
    title: {
        fontSize: 14,
        color: "#fff",
        fontFamily: "Montserrat_400Regular",
    },
    iconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 100,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    image: {
        width: 22,
        height: 22,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        borderColor: "#fff",
        borderWidth: 1,
    },

    name: {
        fontSize: 14,
        color: "#fff",
        fontFamily: "Montserrat_400Regular",
    },

    sub: {
        fontSize: 12,
        color: "#777",
        marginTop: 2,
    },
});