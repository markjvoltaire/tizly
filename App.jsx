import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StripeProvider } from "@stripe/stripe-react-native";

import { supabase } from "./services/supabase";
import { UserProvider } from "./context/UserContext";
import Auth from "./auth/Auth";
import NotificationProvider from "./context/NotificationContext";
import NoAuth from "./auth/NoAuth";

export default function App() {
  const [auth, setAuth] = useState(null);
  const [fontsLoaded] = useFonts({
    gilroy: require("./assets/fonts/gilroy.ttf"),
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StripeProvider publishableKey="pk_live_51PVMhrJ0o91xj4miX08JQC1jkXFJUbIZLYai2U2YMvz4LgQjuwOZeuPWypfjun5oHy3FEnJuSgWcplAzauSGzwmy00EiRpqFYE">
      <UserProvider>
        <NavigationContainer>
          {auth === null ? (
            <NoAuth />
          ) : (
            <NotificationProvider>
              <Auth auth={auth} />
            </NotificationProvider>
          )}
        </NavigationContainer>
      </UserProvider>
    </StripeProvider>
  );
}
