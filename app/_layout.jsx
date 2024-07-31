import { Slot } from "expo-router";
import Navigation from "../components/Navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native-web";

export default function HomeLayout() {
  return (
    <>
      
      <Slot />
      <Navigation  />
      
    </>
  );
}
