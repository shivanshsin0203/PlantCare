import { Slot } from "expo-router";
import Navigation from "../components/Navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native-web";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeLayout() {
  return (
    <>
      <GestureHandlerRootView >
      <Slot />
      </GestureHandlerRootView>
      <Navigation  />
      
    </>
  );
}
