import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
      <Toast />
    </ThemeProvider>
  );
}
