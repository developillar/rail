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
import { NavRail } from '@/components/AppShell';
import { GROUND } from '@/design/tokens';

export default function RootLayout() {
  const [loaded] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  // Mono numerals are load-bearing here — every figure in the app is set in
  // JetBrains Mono — so nothing renders until the face is available. The rail is
  // held back with it: its labels are mono too, and there is no frame in which a
  // half-drawn bar is better than the ground it sits on.
  if (!loaded) return <View style={{ flex: 1, backgroundColor: GROUND }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: GROUND }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {/*
          The router shape is the existing flat root Stack, unchanged and
          headerless: no Tabs navigator, no route groups. Every screen draws its
          own masthead on its own canvas, and the rail is a sibling of the whole
          document rather than a navigator's chrome.
        */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: GROUND },
            animation: 'fade',
          }}
        />
        {/*
          The rail, after the Stack so it paints over scrolling content. It takes
          no props: it reads the pathname itself, notches the cell you are
          standing in, continues GROUND and Grain through the bottom safe area,
          and returns null on every screen you were pushed into — including the
          table, whose bottom 190 units are the instrument.
        */}
        <NavRail />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
