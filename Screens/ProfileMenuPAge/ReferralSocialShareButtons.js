import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ReferralSocialShareButtons = ({ shareLinks = {} }) => {

    const handlePress = async (url) => {
        if (!url) return;
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.log("Unable to open:", error);
        }
    };

    return (
        <View style={styles.grid}>
            <TouchableOpacity
                style={[styles.btn, styles.facebookBtn]}
                onPress={() => handlePress(shareLinks.facebook)}
                activeOpacity={0.85}
            >
                <View style={styles.iconCircle}>
                    <Image
                        source={require("../../assets/images/fb-icon.png")}
                        style={styles.fbLogo}
                    />
                </View>
                <Text style={styles.btnText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.btn, styles.linkedinBtn]}
                onPress={() => handlePress(shareLinks.linkedin)}
                activeOpacity={0.85}
            >
                <View style={styles.iconCircle}>
                    <Image
                        source={require("../../assets/images/linkedin-icon.png")}
                        style={styles.inLogo}
                    />
                </View>
                <Text style={styles.btnText}>LinkedIn</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.btn, styles.twitterBtn]}
                onPress={() => handlePress(shareLinks.twitter)}
                activeOpacity={0.85}
            >
                <View style={styles.iconCircle}>
                    <Image
                        source={require("../../assets/images/x-icon.png")}
                        style={styles.xLogo}
                    />
                </View>
                <Text style={styles.btnText}>X Twitter</Text>
            </TouchableOpacity>

            <LinearGradient
                colors={['#7B2FF7', '#E94040']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.btn, styles.gmailBtn]}
            >
                <TouchableOpacity
                    style={styles.gmailInner}
                    onPress={() => handlePress(shareLinks.gmail)}
                    activeOpacity={0.85}
                >
                    <View style={styles.iconCircle}>
                        <Image
                            source={require("../../assets/images/gmail-icon.png")}
                            style={styles.gmailLogo}
                        />
                    </View>
                    <Text style={styles.btnText}>Gmail</Text>
                </TouchableOpacity>
            </LinearGradient>

        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 10,
    },
    iconCircle: {
        width: 30,
        height: 30,
        borderRadius: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
    },

    // Facebook
    facebookBtn: {
        backgroundColor: '#1877F2',
    },

    // LinkedIn
    linkedinBtn: {
        backgroundColor: '#0A66C2',
    },
    inLogo: {
        width: 15,
        height: 15,
    },

    // X Twitter
    twitterBtn: {
        backgroundColor: '#000000',
    },
    xLogo: {
        width: 15,
        height: 15,
    },

    // Gmail
    gmailBtn: {
        borderRadius: 8,
        padding: 0,
    },
    gmailInner: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 10,
    },
});

export default ReferralSocialShareButtons;