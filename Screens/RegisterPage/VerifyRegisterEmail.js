import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    Platform,
    Alert,
    Image,
} from 'react-native';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;
import GradientButton from "../../components/GradientButton";
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../api/ApiUrl";
import { toastError, toastSuccess } from '../../utils/toast';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

export default function VerifyRegisterEmail({ route }) {
    const navigation = useNavigation();
    const email = route?.params?.email || 'example@email.com';

    const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
    const [activeIndex, setActiveIndex] = useState(0);
    const [timer, setTimer] = useState(RESEND_SECONDS);
    const [loading, setLoading] = useState(false);

    const inputs = useRef([]);

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (text, index) => {
        if (text.length > 1) {
            const pastedCode = text.slice(0, CODE_LENGTH).split('');
            setCode(pastedCode);
            Keyboard.dismiss();
            return;
        }
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        if (text && index < CODE_LENGTH - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const finalCode = code.join('');

        if (finalCode.length !== CODE_LENGTH) {
            toastError('Error', 'Please enter the full verification code.');
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_URL}/verify-email`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, email_pin: finalCode }),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            toastSuccess('Success', 'Email verified successfully!');
            const { verification_count, admin } = data.user;

            if (verification_count < 2) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "VerificationPage" }],
                });
                return;
            }

            if (admin == 2) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "EmployerDashboard" }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Dashboard" }],
                });
            }
        } catch (error) {
            toastError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_URL}/resend-email-link`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                }
            );

            setTimer(RESEND_SECONDS);
            toastSuccess('Verification code resent.');
        } catch (error) {
            toastError('Failed to resend code. ' . error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient colors={["#444444", "#222222"]} style={styles.mainContainer}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    enableOnAndroid={true}
                    extraScrollHeight={80}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={styles.container}>
                        {/* APP LOGO */}
                        <Image
                            source={require("../../assets/images/d_logo.png")} // <-- change path if needed
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Text style={styles.title}>Check Your Email</Text>
                        <Text style={styles.subtitle}>
                            We sent a verification code to
                        </Text>
                        <Text style={styles.email}>{email}</Text>

                        <View style={styles.otpContainer}>
                            {code.map((digit, index) => {
                                const isActive = activeIndex === index;
                                const isFilled = digit !== '';
                                return (
                                    <TextInput
                                        key={index}
                                        ref={ref => (inputs.current[index] = ref)}
                                        style={[
                                            styles.input,
                                            isActive && styles.activeInput,
                                            isFilled && !isActive && styles.filledInput,
                                        ]}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        placeholder="-"
                                        placeholderTextColor="#666"
                                        caretHidden={true}
                                        onFocus={() => setActiveIndex(index)}
                                        onChangeText={text => handleChange(text, index)}
                                        onKeyPress={e => handleKeyPress(e, index)}
                                        textContentType="oneTimeCode"
                                        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
                                    />
                                );
                            })}
                        </View>

                        <View style={{ marginTop: 20 }}>
                            {timer > 0 ? (
                                <Text style={styles.timer}>
                                    00:{timer < 10 ? `0${timer}` : timer} left
                                </Text>
                            ) : (
                                <View style={styles.resendRow}>
                                    <Text style={styles.resendGrey}>
                                        Didn’t receive the code?{' '}
                                    </Text>
                                    <TouchableOpacity onPress={handleResend}>
                                        <Text style={styles.resendRed}>Click to resend</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <View style={{ width: "100%" }}>
                            <GradientButton
                                title="Verify"
                                onPress={handleVerify}
                                disabled={loading}
                                loading={loading}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    container: {
        paddingTop: 80,
        alignItems: 'center',
    },
    logo: {
        width: 70,
        height: 70,
        marginBottom: 25,
    },
    title: {
        fontWeight: "Montserrat_600SemiBold",
        fontSize: 36,
        color: "#fff",
    },
    subtitle: {
        fontWeight: "Montserrat_600SemiBold",
        fontSize: 14,
        color: "#fff",
        marginTop: 8,
    },
    email: {
        color: '#cb7767',
        marginTop: 4,
        marginBottom: 20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: "100%"
    },

    input: {
        width: 55,
        height: 60,
        borderWidth: 1.5,
        borderColor: '#444',
        borderRadius: 14,
        textAlign: 'center',
        fontSize: 26,
        color: '#fff',
        marginHorizontal: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },

    activeInput: {
        borderColor: '#ffffff',
        textAlign: 'center',
    },

    filledInput: {
        borderColor: '#777',
        textAlign: 'center',
    },
    timer: {
        color: '#aaa',
    },
    resendRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resendGrey: {
        color: '#888',
    },
    resendRed: {
        color: '#cb7767',
        fontWeight: 'Montserrat_600SemiBold',
    },
});