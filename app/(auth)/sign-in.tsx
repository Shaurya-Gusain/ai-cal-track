import { useSSO, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const { startSSOFlow } = useSSO();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSignInPress = async () => {
        if (!isLoaded) return;
        if (!emailAddress || !password) {
            alert('Please enter your email address and password.');
            return;
        }
        setLoading(true);
        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (completeSignIn.status === 'complete' && completeSignIn.createdSessionId) {
                // This indicates the user is signed in
                await setActive({ session: completeSignIn.createdSessionId });
                router.replace('/');
            } else {
                console.log('SignIn status not complete:', completeSignIn.status);
                // Handle other statuses like needs_second_factor
                alert('Additional steps required to sign in.');
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            const errorMessage = err?.errors?.[0]?.message || err?.message || JSON.stringify(err);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onGoogleSignInPress = async () => {
        try {
            const { createdSessionId, setActive: setActiveSSO, signIn: signInSSO } = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl: 'aicaltrack://oauth-callback',
            });
            if (signInSSO?.status === 'complete' && createdSessionId) {
                await setActiveSSO!({ session: createdSessionId });
                router.replace('/');
            } else if (createdSessionId) {
                console.log('OAuth SignIn status not complete:', signInSSO?.status);
                alert('Additional steps required to complete sign in.');
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            alert(err?.errors?.[0]?.message ?? 'Google sign-in failed');
        }
    };

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
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue tracking calories</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#7C7C7C" style={styles.icon} />
                        <TextInput
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Email address"
                            placeholderTextColor="#7C7C7C"
                            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
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
                        onPress={onSignInPress}
                        disabled={loading}
                    >
                        <Text style={styles.signInButtonText}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignInPress}>
                        <Ionicons name="logo-google" size={20} color="#000" />
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Link href="/sign-up" asChild>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>Sign Up</Text>
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
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
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
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#7C7C7C',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
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
        color: '#1A1A1A',
    },
    signInButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 16,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    signInButtonText: {
        color: '#FFFFFF',
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
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        color: '#7C7C7C',
        paddingHorizontal: 16,
        fontSize: 14,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        height: 56,
    },
    googleButtonText: {
        color: '#1A1A1A',
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
        color: '#7C7C7C',
        fontSize: 14,
    },
    footerLink: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '600',
    },
});
