import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    TextInput,
    Image,
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSocialEvents from "../FeedEvent/useSocialEvents";
import GradientButton from "../../../components/GradientButton";
import { toastSuccess } from "../../../utils/toast";
import BottomSheetIndicator from "../../../components/BottomSheetIndicator";

const NUM_COLUMNS = 2;
const SEARCH_DEBOUNCE = 350;

export default function FeedInternalSharingModal({ visible, onClose, feedId }) {
    const insets = useSafeAreaInsets();
    const { shareInternalList, addInternalPostSharing, filterUsersByKeyword } = useSocialEvents();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchDebounce = useRef(null);

    const [selectedMap, setSelectedMap] = useState({});
    const selectedIds = useMemo(() => new Set(Object.keys(selectedMap).map(Number)), [selectedMap]);

    const [message, setMessage] = useState("");
    const [sharing, setSharing] = useState(false);
    const isSearchMode = search.trim().length > 0;

    useEffect(() => {
        if (visible) {
            fetchUsers();
        } else {
            setSearch("");
            setMessage("");
            setSelectedMap({});
            setSearchResults([]);
        }
    }, [visible]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await shareInternalList();
            setUsers(res?.status === 200 ? (res.users || []) : []);
        } catch (err) {
            console.warn("Failed to load share list:", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [shareInternalList]);

    const handleSearchChange = useCallback((text) => {
        setSearch(text);
        if (searchDebounce.current) clearTimeout(searchDebounce.current);
        if (!text.trim()) {
            setSearchResults([]);
            return;
        }

        searchDebounce.current = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const res = await filterUsersByKeyword(text.trim());
                setSearchResults(res?.status === 200 ? (res.data || []) : []);
            } catch (err) {
                console.warn("Search error:", err);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, SEARCH_DEBOUNCE);
    }, [filterUsersByKeyword]);

    const toggleSelect = useCallback((user) => {
        const id = Number(user.user_id ?? user.id);
        setSelectedMap((prev) => {
            const next = { ...prev };
            if (next[id]) {
                delete next[id];
            } else {
                next[id] = user;
            }
            return next;
        });
    }, []);

    // Select all visible (works in both modes)
    const toggleSelectAll = useCallback(() => {
        const source = isSearchMode ? searchResults : users;
        const allSelected = source.every((u) => {
            const id = Number(u.user_id ?? u.id);
            return selectedIds.has(id);
        });

        setSelectedMap((prev) => {
            const next = { ...prev };
            if (allSelected) {
                source.forEach((u) => {
                    const id = Number(u.user_id ?? u.id);
                    delete next[id];
                });
            } else {
                source.forEach((u) => {
                    const id = Number(u.user_id ?? u.id);
                    next[id] = u;
                });
            }
            return next;
        });
    }, [isSearchMode, searchResults, users, selectedIds]);

    const handleShare = useCallback(async () => {
        if (selectedIds.size === 0 || sharing) return;
        setSharing(true);
        try {
            const res = await addInternalPostSharing(feedId, {
                user_ids: Array.from(selectedIds),
                message,
            });
            if (res?.status === 200) {
                onClose?.();
                toastSuccess("Sent Successfully");
            } else {
                console.warn("Share failed:", res?.message);
            }
        } catch (err) {
            console.warn("Share error:", err);
        } finally {
            setSharing(false);
        }
    }, [selectedIds, message, feedId, sharing, onClose]);

    const UserCard = useCallback(({ item: user }) => {
        const id = Number(user.user_id ?? user.id);
        const isSelected = selectedIds.has(id);
        const displayName = user.full_name || user.name || "?";
        const photo = user.photo;

        return (
            <TouchableOpacity
                style={[styles.userCard, isSelected && styles.userCardSelected]}
                activeOpacity={0.7}
                onPress={() => toggleSelect(user)}
            >
                <View style={styles.avatarWrap}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarFallback]}>
                            <Text style={styles.avatarFallbackText}>
                                {displayName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    {isSelected && (
                        <View style={styles.avatarCheckBadge}>
                            <Ionicons name="checkmark" size={11} color="#fff" />
                        </View>
                    )}
                </View>

                <Text style={styles.userName} numberOfLines={2}>
                    {displayName}
                </Text>

                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                </View>
            </TouchableOpacity>
        );
    }, [selectedIds, toggleSelect]);

    const renderChattedItem = useCallback(({ item }) => (
        <UserCard item={item} />
    ), [UserCard]);

    const renderSearchItem = useCallback(({ item }) => (
        <UserCard item={item} />
    ), [UserCard]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
                    <BottomSheetIndicator />
                    <View style={styles.searchHeader}>
                        <View style={styles.searchBox}>
                            <Ionicons name="search" size={18} color="#8A8A8A" />
                            <TextInput
                                value={search}
                                onChangeText={handleSearchChange}
                                placeholder="Search all users..."
                                placeholderTextColor="#8A8A8A"
                                style={styles.searchInput}
                            />
                            {!!search && (
                                <TouchableOpacity onPress={() => handleSearchChange("")}>
                                    <Ionicons name="close-circle" size={16} color="#aaa" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity style={styles.groupBtn} onPress={toggleSelectAll} activeOpacity={0.7}>
                            <MaterialCommunityIcons name="account-group" size={18} color="#303030" />
                        </TouchableOpacity>
                    </View>

                    {/* Mode label */}
                    <Text style={styles.modeLabel}>
                        {isSearchMode
                            ? `Search results${searchResults.length > 0 ? ` (${searchResults.length})` : ""}`
                            : "Recent contacts"}
                    </Text>

                    <View style={styles.listWrap}>
                        {isSearchMode ? (
                            searchLoading ? (
                                <View style={styles.centerState}>
                                    <ActivityIndicator size="small" color="#C96B59" />
                                </View>
                            ) : searchResults.length === 0 ? (
                                <View style={styles.centerState}>
                                    <Text style={styles.emptyText}>No users found</Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={searchResults}
                                    renderItem={renderSearchItem}
                                    keyExtractor={(item) => String(item.user_id ?? item.id)}
                                    keyboardShouldPersistTaps="handled"
                                />
                            )
                        ) : (
                            loading ? (
                                <View style={styles.centerState}>
                                    <ActivityIndicator size="small" color="#C96B59" />
                                </View>
                            ) : users.length === 0 ? (
                                <View style={styles.centerState}>
                                    <Text style={styles.emptyText}>No contacts found</Text>
                                </View>
                            ) : (
                                <FlashList
                                    data={users}
                                    renderItem={renderChattedItem}
                                    keyExtractor={(item) => String(item.id)}
                                    numColumns={NUM_COLUMNS}
                                    estimatedItemSize={72}
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    columnWrapperStyle={styles.columnWrapper}
                                />
                            )
                        )}
                    </View>

                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} >
                        <View style={styles.inputRow}>
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Type something"
                                placeholderTextColor="#8A8A8A"
                                style={styles.messageInput}
                            />
                        </View>
                        <GradientButton
                            title={`Share${selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}`}
                            onPress={handleShare}
                            disabled={selectedIds.size === 0 || sharing}
                            activeOpacity={0.8}
                            loading={sharing}
                        />
                    </KeyboardAvoidingView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.50)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
        maxHeight: "70%",
        paddingHorizontal: 18,
        paddingTop: 14,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    grabberWrap: {
        alignItems: "center",
        marginBottom: 8,
    },
    grabber: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#e2e2e2",
    },
    searchHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 6,
    },
    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#EAEAEA",
        borderRadius: 10,
        paddingHorizontal: 14,
        height: 42,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
        color: "#303030",
        padding: 0,
    },
    groupBtn: {
        width: 42,
        height: 42,
        borderRadius: 100,
        backgroundColor: "#EAEAEA",
        alignItems: "center",
        justifyContent: "center",
    },
    modeLabel: {
        fontSize: 11,
        fontFamily: "Montserrat_500Medium",
        color: "#9a9a9a",
        marginBottom: 10,
        letterSpacing: 0.3,
    },
    listWrap: {
        flex: 1,
        // minHeight: 260,
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    centerState: {
        paddingVertical: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        fontFamily: "Montserrat_400Regular",
        color: "#8A8A8A",
        fontSize: 16,
    },
    userCard: {
        width: "95%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#30303033",
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 12,
    },
    userCardSelected: {
        borderColor: "#C96B59",
        backgroundColor: "#FFF6F4",
    },
    avatarWrap: {
        position: "relative",
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#ececec",
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    avatarFallback: {
        alignItems: "center",
        justifyContent: "center",
    },
    avatarFallbackText: {
        fontFamily: "Montserrat_600SemiBold",
        color: "#303030",
        fontSize: 14,
    },
    avatarCheckBadge: {
        position: "absolute",
        bottom: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#303030",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#fff",
    },
    userName: {
        flex: 1,
        fontFamily: "Montserrat_500Medium",
        fontSize: 13,
        color: "#303030",
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: "#c9c9c9",
        alignItems: "center",
        justifyContent: "center",
    },
    radioSelected: {
        borderColor: "#C96B59",
    },
    radioDot: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: "#C96B59",
    },
    inputRow: {
        paddingTop: 12,
        gap: 10,
    },
    messageInput: {
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        fontStyle: "italic",
        color: "#303030",
        paddingTop: 8,
    },
});