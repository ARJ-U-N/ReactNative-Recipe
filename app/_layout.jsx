import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { SafeAreaView } from "react-native-safe-area-context";
import {COLORS} from "../constants/colors";
import SafeScreen from "@/components/SafeScreen"


export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>

       <Slot />
      </SafeScreen>

     
    </ClerkProvider>
  )
}
