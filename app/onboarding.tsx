import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
    Backpack01Icon,
    Calendar02Icon,
    CalendarCheckIn01Icon,
    CalendarCheckOut01Icon,
    HourglassIcon,
    Leaf02Icon,
    MountainIcon,
    Navigation04Icon,
    SnowIcon,
    Sun03Icon,
    UmbrellaIcon,
    UserCircleIcon
} from 'hugeicons-react-native';
import React, { useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const ONBOARDING_KEY = 'onboardingCompleted';
const PREFS_KEY = 'userPreferences';

export default function Onboarding() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [experienceLevel, setExperienceLevel] = useState('');
    const [preferredSeason, setPreferredSeason] = useState('');
    const [trekDuration, setTrekDuration] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            const preferences = {
                experienceLevel,
                preferredSeason,
                trekDuration,
                emergencyContact
            };
            await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Failed to save onboarding preferences:', error);
            alert('Something went wrong saving your preferences.');
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = () => {
        const progress = currentStep * 25;
        return (
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
        );
    };

    const OptionCard = ({ icon: Icon, label, selected, onPress }: any) => (
        <TouchableOpacity
            style={[styles.optionCard, selected && styles.optionCardSelected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Icon size={32} color={selected ? Colors.primary : Colors.textMuted} variant={selected ? "solid" : "stroke"} />
            <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
        </TouchableOpacity>
    );

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.questionText}>Tell us about your trekking experience.</Text>
            <View style={styles.optionsWrap}>
                <OptionCard
                    icon={Backpack01Icon}
                    label="Beginner"
                    selected={experienceLevel === 'Beginner'}
                    onPress={() => setExperienceLevel('Beginner')}
                />
                <OptionCard
                    icon={Navigation04Icon}
                    label="Intermediate"
                    selected={experienceLevel === 'Intermediate'}
                    onPress={() => setExperienceLevel('Intermediate')}
                />
                <OptionCard
                    icon={MountainIcon}
                    label="Experienced"
                    selected={experienceLevel === 'Experienced'}
                    onPress={() => setExperienceLevel('Experienced')}
                />
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.questionText}>What season do you prefer for trekking?</Text>
            <View style={styles.optionsWrap}>
                <OptionCard
                    icon={Sun03Icon}
                    label="Summer"
                    selected={preferredSeason === 'Summer'}
                    onPress={() => setPreferredSeason('Summer')}
                />
                <OptionCard
                    icon={UmbrellaIcon}
                    label="Monsoon"
                    selected={preferredSeason === 'Monsoon'}
                    onPress={() => setPreferredSeason('Monsoon')}
                />
                <OptionCard
                    icon={Leaf02Icon}
                    label="Autumn"
                    selected={preferredSeason === 'Autumn'}
                    onPress={() => setPreferredSeason('Autumn')}
                />
                <OptionCard
                    icon={SnowIcon}
                    label="Winter"
                    selected={preferredSeason === 'Winter'}
                    onPress={() => setPreferredSeason('Winter')}
                />
                <OptionCard
                    icon={Calendar02Icon}
                    label="Any Season"
                    selected={preferredSeason === 'Any Season'}
                    onPress={() => setPreferredSeason('Any Season')}
                />
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.questionText}>What trek duration do you prefer?</Text>
            <View style={styles.optionsWrap}>
                <OptionCard
                    icon={HourglassIcon}
                    label="1–2 days"
                    selected={trekDuration === '1–2 days'}
                    onPress={() => setTrekDuration('1–2 days')}
                />
                <OptionCard
                    icon={CalendarCheckOut01Icon}
                    label="3–4 days"
                    selected={trekDuration === '3–4 days'}
                    onPress={() => setTrekDuration('3–4 days')}
                />
                <OptionCard
                    icon={CalendarCheckIn01Icon}
                    label="5–7 days"
                    selected={trekDuration === '5–7 days'}
                    onPress={() => setTrekDuration('5–7 days')}
                />
                <OptionCard
                    icon={Calendar02Icon}
                    label="More than 7 days"
                    selected={trekDuration === 'More than 7 days'}
                    onPress={() => setTrekDuration('More than 7 days')}
                />
            </View>
        </View>
    );

    const renderStep4 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.questionText}>Add an emergency contact (optional)</Text>
            <View style={styles.inputContainer}>
                <UserCircleIcon size={24} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                    style={styles.textInput}
                    placeholder="Phone Number"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="phone-pad"
                    value={emergencyContact}
                    onChangeText={setEmergencyContact}
                />
            </View>
        </View>
    );

    const canGoNext = () => {
        if (currentStep === 1) return !!experienceLevel;
        if (currentStep === 2) return !!preferredSeason;
        if (currentStep === 3) return !!trekDuration;
        return true;
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.header}>
                {renderProgressBar()}
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                bounces={false}
            >
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerButtons}>
                    {currentStep > 1 && (
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                    )}

                    {currentStep < 4 ? (
                        <TouchableOpacity
                            style={[styles.nextButton, !canGoNext() && styles.nextButtonDisabled]}
                            onPress={handleNext}
                            disabled={!canGoNext()}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.finalButtons}>
                            <TouchableOpacity
                                style={styles.skipButton}
                                onPress={handleComplete}
                                disabled={loading}
                            >
                                <Text style={styles.skipButtonText}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.finishButton, loading && styles.nextButtonDisabled]}
                                onPress={handleComplete}
                                disabled={loading}
                            >
                                <Text style={styles.finishButtonText}>{loading ? 'Saving...' : 'Finish'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    progressContainer: {
        height: 6,
        backgroundColor: Colors.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    stepContainer: {
        flex: 1,
    },
    questionText: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 32,
        lineHeight: 36,
    },
    optionsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    optionCard: {
        width: '48%',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.successBackground,
    },
    optionLabel: {
        marginTop: 12,
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
        textAlign: 'center',
    },
    optionLabelSelected: {
        color: Colors.primary,
        fontWeight: '700',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        padding: 16,
    },
    backButtonText: {
        fontSize: 16,
        color: Colors.textMuted,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 24,
        marginLeft: 'auto',
    },
    nextButtonDisabled: {
        opacity: 0.5,
    },
    nextButtonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
    finalButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    skipButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginRight: 12,
    },
    skipButtonText: {
        color: Colors.textMuted,
        fontSize: 16,
        fontWeight: '600',
    },
    finishButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 24,
    },
    finishButtonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
});
