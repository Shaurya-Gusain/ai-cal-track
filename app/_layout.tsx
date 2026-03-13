import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { tokenCache } from '../utils/tokenCache';
import AsyncStorage from '@react-native-async-storage/async-storage';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  );
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('onboardingCompleted');
        setIsCheckingOnboarding(false);
        
        if (!isLoaded) return;
        
        const onboardingCompleted = value === 'true';
        const inAuth = segments[0] === '(auth)';
        const inOnboarding = segments[0] === 'onboarding';
        const inTabs = segments[0] === '(tabs)';
        const inTrek = segments[0] === 'trek';

        if (!isSignedIn) {
          if (!inAuth) {
            router.replace('/(auth)/sign-in');
          }
        } else {
          if (!onboardingCompleted && !inOnboarding) {
            router.replace('/onboarding');
          } else if (onboardingCompleted && !inTabs && !inTrek) {
            router.replace('/(tabs)');
          }
        }
      } catch (e) {
        console.error('Error:', e);
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [isSignedIn, isLoaded, segments]);

  if (!isLoaded || isCheckingOnboarding) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="trek/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <InitialLayout />
    </ClerkProvider>
  );
}
