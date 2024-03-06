import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "./services/supabase";
import { UserProvider } from "./context/UserContext";
import NoAuth from "./auth/NoAuth";
import Auth from "./auth/Auth";
import NotificationContext from "./context/NotificationContext";

export default function App() {
  const [auth, setAuth] = useState(null);
  const scheme = useColorScheme();

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

  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        {auth === null ? (
          <NoAuth />
        ) : (
          <NotificationContext>
            <Auth auth={auth} />
          </NotificationContext>
        )}
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  // Add any additional styles if needed
});
