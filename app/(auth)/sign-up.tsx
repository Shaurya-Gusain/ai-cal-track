import { useSSO, useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const { startSSOFlow } = useSSO();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    // start the sign up process
    const onSignUpPress = async () => {
        if (!isLoaded) return;
        if (!emailAddress || !password) {
            alert('Please enter your email address and password.');
            return;
        }
        if (password.length < 8) {
            alert('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);

        try {
            await signUp.create({
                emailAddress,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            const errorMessage = err?.errors?.[0]?.message ?? err?.message ?? String(err);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // verify the email code
    const onPressVerify = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            const errorMessage = err?.errors?.[0]?.message ?? err?.message ?? String(err);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onGoogleSignUpPress = async () => {
        try {
            const { createdSessionId, setActive: setActiveSSO } = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl: 'aicaltrack://oauth-callback',
            });
            if (createdSessionId) {
                await setActiveSSO!({ session: createdSessionId });
                router.replace('/');
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            const errorMessage = err?.errors?.[0]?.message ?? err?.message ?? String(err);
            alert(errorMessage || 'Google sign-up failed');
        }
    };

    if (pendingVerification) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Verify Email</Text>
                    <Text style={styles.subtitle}>Enter the code sent to your email</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="key-outline" size={20} color="#7C7C7C" style={styles.icon} />
                        <TextInput
                            value={code}
                            placeholder="Verification Code"
                            placeholderTextColor="#7C7C7C"
                            onChangeText={(code) => setCode(code)}
                            style={styles.input}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={onPressVerify}
                        disabled={loading}
                    >
                        <Text style={styles.signInButtonText}>
                            {loading ? 'Verifying...' : 'Verify'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/images/icon.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Start tracking your calories today</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#7C7C7C" style={styles.icon} />
                        <TextInput
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Email address"
                            placeholderTextColor="#7C7C7C"
                            onChangeText={(email) => setEmailAddress(email)}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#7C7C7C" style={styles.icon} />
                        <TextInput
                            value={password}
                            placeholder="Password"
                            placeholderTextColor="#7C7C7C"
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                            style={styles.input}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={onSignUpPress}
                        disabled={loading}
                    >
                        <Text style={styles.signInButtonText}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignUpPress}>
                        <Ionicons name="logo-google" size={20} color="#000" />
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/sign-in" asChild>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 24,
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 24,
        borderRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textMuted,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
    },
    signInButton: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    signInButtonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dividerText: {
        color: Colors.textMuted,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 16,
        height: 56,
    },
    googleButtonText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        color: Colors.textMuted,
        fontSize: 14,
    },
    footerLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});
