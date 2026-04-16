import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../../api/ApiUrl";
import { toastError, toastSuccess } from "../../utils/toast";
import { useNavigation, useRoute } from "@react-navigation/native";
import GradientButton from "../../components/GradientButton";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";

const BRAND = "#CB7767";
const BG = "#222222";
const CARD_BG = "#2C2C2C";
const TEXT_PRIMARY = "#ffffff";
const TEXT_SECONDARY = "#a0a0a0";
const BORDER = "#333333";

const BulletItem = ({ text }) => (
    <View style={styles.bulletRow}>
        <View style={styles.bulletDot} />
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

const WarningSection = ({ title, children }) => (
    <View style={styles.warnSection}>
        <Text style={styles.warnTitle}>{title}</Text>
        {children}
    </View>
);

const Field = ({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = "default", editable = true }) => (
    <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#555"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize="none"
            editable={editable}
        />
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════
const DeleteAccountScreen = () => {
    const route = useRoute();
    const { email } = route.params || {};
    // console.log('adfdfadf  adf adfa dsf ',email);
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(1);
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const StepIndicator = () => (
        <View style={styles.stepRow}>
            {[1, 2, 3].map((s) => (
                <View key={s} style={styles.stepItemRow}>
                    <View style={[
                        styles.stepDot,
                        s === currentStep && styles.stepDotActive,
                        s < currentStep && styles.stepDotDone,
                    ]}>
                        <Text style={[
                            styles.stepDotLabel,
                            (s === currentStep || s < currentStep) && styles.stepDotLabelActive,
                        ]}>{s}</Text>
                    </View>
                    {s < 3 && (
                        <View style={[styles.stepLine, s < currentStep && styles.stepLineDone]} />
                    )}
                </View>
            ))}
        </View>
    );

    // STEP 1
    const renderStep1 = () => (
        <View>
            <WarningSection title="Delete your account means">
                <BulletItem text="You will lose all the data and content in your account, like your competencies, descriptions, service packs, messages and all files uploaded to your account pages." />
                <BulletItem text="You won't be able to apply for a job or to post a job without an account." />
            </WarningSection>

            <WarningSection title="If your account has been hacked">
                <BulletItem text="If that is the reason why you are willing to delete, please contact us and we'll help you to get your unique access back." />
            </WarningSection>

            <WarningSection title="Will it be possible to recover your account in future?">
                <BulletItem text="No, deleting your account means that you won't be able to access it in future. Also your username will become available again." />
            </WarningSection>

            <WarningSection title="Have you withdrawn your funds yet?">
                <BulletItem text="Before you have your account deleted, please make sure you have withdrawn your money from your account. Retrieving funds from a deleted account will not be possible." />
            </WarningSection>

            <GradientButton
                title="I understand, continue"
                marginTop={28}
                onPress={() => setCurrentStep(2)}
            />

            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    // STEP 2
    const handleCodeSent = async () => {
        if (!password) {
            toastError("Please enter your password");
            return;
        }
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/close-account-post`,
                {
                    delete_email: email,
                    delete_password: password
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                },
            );
            if (response.data.status === 200) {
                toastSuccess("A verification code has been sent to your email");
                setCurrentStep(3);
            } else {
                toastError(response.data.message || "Invalid credentials");
            }
        } catch (error) {
            toastError(error.response?.data?.message || "Something went wrong. Please try again.");
            console.error("Step 2 error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStep2 = () => (
        <View>
            <Field
                label="Email"
                value={email}
                editable={false}
                placeholder="Your email"
                keyboardType="email-address"
            />
            <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
            />

            <GradientButton
                title="Get a Code"
                marginTop={28}
                disabled={loading}
                loading={loading}
                onPress={handleCodeSent}
            />

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setCurrentStep(1)}>
                <Text style={styles.cancelText}>Back</Text>
            </TouchableOpacity>
        </View>
    );

    // STEP 3
    const handleVerifyAndDelete = async () => {
        if (!otp || otp.length < 4) {
            toastError("Please enter the verification code");
            return;
        }
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/delete-account-confirm`,
                { delete_code: otp },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                },
            );
            if (response.data.status === 200) {
                toastSuccess("Your account has been deleted");
                await AsyncStorage.clear();
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                });
            } else {
                toastError(response.data.message || "Invalid code. Please try again.");
            }
        } catch (error) {
            toastError(error.response?.data?.message || "Confirmation failed. Please try again.");
            console.error("Step 3 error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStep3 = () => (
        <View>
            <Field
                label="Put code"
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter the code sent to your email"
                keyboardType="number-pad"
            />

            <GradientButton
                title="Confirm"
                marginTop={28}
                disabled={loading}
                loading={loading}
                onPress={handleVerifyAndDelete}
            />

            <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setCurrentStep(2)}
            >
                <Text style={styles.cancelText}>Back</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <PageNameHeaderBar
                    title="Delete your Djobzy account"
                    navigation={navigation}
                />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.scroll}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* ── Step indicator ─────────────────────────────── */}
                        <StepIndicator />

                        {/* ── Active section ─────────────────────────────── */}
                        <View style={styles.card}>
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: BG,
    },
    scroll: {
        paddingBottom: 50,
        paddingTop: 12,
    },

    // Heading
    heading: {
        color: TEXT_PRIMARY,
        fontSize: 22,
        fontFamily: "Montserrat_700Bold",
        textAlign: "center",
        marginBottom: 24,
    },

    // Step indicator
    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
    },
    stepItemRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    stepDot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: BORDER,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#444",
    },
    stepDotActive: {
        backgroundColor: BRAND,
        borderColor: BRAND,
    },
    stepDotDone: {
        backgroundColor: "#5a3a34",
        borderColor: BRAND,
    },
    stepDotLabel: {
        color: TEXT_SECONDARY,
        fontSize: 13,
        fontFamily: "Montserrat_600SemiBold",
    },
    stepDotLabelActive: {
        color: "#fff",
    },
    stepLine: {
        width: 44,
        height: 2,
        backgroundColor: BORDER,
        marginHorizontal: 4,
    },
    stepLineDone: {
        backgroundColor: BRAND,
    },

    card: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: BORDER,
    },

    warnSection: {
        marginBottom: 20,
    },
    warnTitle: {
        color: TEXT_PRIMARY,
        fontSize: 15,
        fontFamily: "Montserrat_700Bold",
        marginBottom: 8,
    },
    bulletRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 6,
        paddingLeft: 4,
    },
    bulletDot: {
        width: 15,
        height: 5,
        borderRadius: 50,
        backgroundColor: BRAND,
        marginTop: 5,
        marginRight: 10,
        flexShrink: 0,
    },
    bulletText: {
        color: TEXT_SECONDARY,
        fontSize: 13,
        fontFamily: "Montserrat_400Regular",
        lineHeight: 19,
        flex: 1,
    },
    fieldWrap: {
        marginBottom: 16,
    },
    fieldLabel: {
        color: TEXT_PRIMARY,
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: BORDER,
        color: TEXT_PRIMARY,
        fontSize: 15,
        fontFamily: "Montserrat_400Regular",
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "ios" ? 14 : 11,
    },
    cancelBtn: {
        alignItems: "center",
        marginTop: 16,
        paddingVertical: 8,
    },
    cancelText: {
        color: TEXT_SECONDARY,
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        textDecorationLine: "underline",
    },
});

export default DeleteAccountScreen;