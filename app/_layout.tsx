import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
  useFonts,
} from '@expo-google-fonts/jetbrains-mono';
import { GROUND } from '@/design/tokens';

export default function RootLayout() {
  const [loaded] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  // Mono numerals are load-bearing here — every figure in the app is set in
  // JetBrains Mono — so nothing renders until the face is available.
  if (!loaded) return <View style={{ flex: 1, backgroundColor: GROUND }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: GROUND }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: GROUND },
            animation: 'fade',
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
