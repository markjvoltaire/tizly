import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "./services/supabase";
import { UserProvider } from "./context/UserContext";
import NoAuth from "./auth/NoAuth";
import Auth from "./auth/Auth";
import { useFonts } from "expo-font";

export default function App() {
  const [auth, setAuth] = useState(null);
  const [fontsLoaded] = useFonts({
    alata: require("./assets/fonts/Alata.ttf"),

    // Add more fonts if needed
  });

  useEffect(() => {
    const handleAuthStateChange = (_event, session) => {
      if (_event === "SIGNED_IN") {
        setAuth(session);
      } else if (_event === "SIGNED_OUT") {
        setAuth(null);
      }
    };

    const session = supabase.auth.session();
    setAuth(session);

    // Subscribe to authentication state changes
    const unsubscribe = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  if (!fontsLoaded) {
    // You can return a loading indicator or placeholder until fonts are loaded
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  // Add any additional styles if needed
});
