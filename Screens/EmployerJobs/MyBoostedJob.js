import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoContract from '../../components/NoContract';
import { useNotifications } from '../../context/MessageNotificationContext';
import { useNavigation } from '@react-navigation/native';
import EmployerFooter from '../../components/EmployerFooter';
import Footer from '../../components/Footer';
import PageNameHeaderBar from '../../components/PageNameHeaderBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components/Loading';
import { ScrollView } from 'react-native-gesture-handler';
import { API_URL } from '../../api/ApiUrl';
import { Ionicons } from '@expo/vector-icons';

const MyBoostedJob = () => {
    const { admin } = useNotifications();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [job, setJob] = useState([]);

    const fetchBoostedJob = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_URL}/my-promoted-jobs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            const data = await response.json();
            setJob(data.boosted_jobs);
        } catch (error) {
            console.log("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoostedJob();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <PageNameHeaderBar title="Boosted Jobs" navigation={navigation} />
                </View>
                {
                    loading ? (
                        <Loading />
                    ) : job.length > 0 ? (
                        <ScrollView
                            style={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        >
                            {job.map((item, index) => {
                                const isActive = item.is_active === 1;
                                return (
                                    <View style={styles.cardSection} key={index}>
                                        <View style={styles.card}>
                                            <View style={styles.cardLeft}>
                                                <Text style={styles.jobTitle}>
                                                    {item.subject}
                                                </Text>
                                                <View style={styles.metaRow}>
                                                    <View
                                                        style={[
                                                            styles.statusBadge,
                                                            isActive ? styles.activeBadge : styles.inactiveBadge
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.statusText,
                                                                isActive ? styles.activeText : styles.inactiveText
                                                            ]}
                                                        >
                                                            {isActive ? 'active' : 'inactive'}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.priceBadge}>
                                                        <Text style={styles.priceText}>
                                                            CAD {item.amount}
                                                        </Text>
                                                    </View>

                                                    <View style={styles.metaItem}>
                                                        <Ionicons name="calendar-outline" size={13} color="#888" />
                                                        <Text style={styles.metaText}>
                                                            {item.payment_date}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={styles.viewBtn} activeOpacity={0.7}
                                                onPress={() =>
                                                    navigation.navigate("PostJobDetails", {
                                                        jobId: item.request_slug,
                                                    })
                                                }
                                            >
                                                <Text style={styles.viewBtnText}>View</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    ) : (
                        <NoContract
                            icon="rocket-outline"
                            title="No boosted jobs"
                            description="You don't have any boosted jobs at the moment"
                        />
                    )
                }
            </View>
            {admin == 2 ? <EmployerFooter /> : <Footer />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: '#222222',
    },
    cardSection: {
        marginBottom: 14,
    },
    card: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff1a',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLeft: {
        flex: 1,
        marginRight: 10,
    },

    jobTitle: {
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        color: '#fff',
        marginBottom: 6,
    },

    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#aaa',
        fontFamily: "Montserrat_400Regular",
        lineHeight: 19,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    activeBadge: {
        backgroundColor: 'rgba(34,197,94,0.15)',
    },

    inactiveBadge: {
        backgroundColor: 'rgba(239,68,68,0.15)',
    },

    statusText: {
        fontSize: 11,
        lineHeight: 16,
        fontFamily: "Montserrat_600SemiBold",
        textTransform: 'capitalize',
    },

    activeText: {
        color: '#46a282',
    },

    inactiveText: {
        color: '#cb4f34',
    },

    priceBadge: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    priceText: {
        color: '#ccc',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: "Montserrat_600SemiBold",
    },
    viewBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 5,
        backgroundColor: "#cb7767"
    },

    viewBtnText: {
        color: '#ffffff',
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        lineHeight: 19,
    },
});

export default MyBoostedJob;