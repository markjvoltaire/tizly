import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StripeProvider } from "@stripe/stripe-react-native";

import { supabase } from "./services/supabase";
import { UserProvider } from "./context/UserContext";
import Auth from "./auth/Auth";
import { LocationProvider } from "./context/LocationContext";

export default function App() {
  const [auth, setAuth] = useState(null);
  const [fontsLoaded] = useFonts({
    alata: require("./assets/fonts/Alata.ttf"),
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
    <StripeProvider publishableKey="pk_test_51PGlQDFJMCoKq8PTWUUhTDRsSTmaos2cTY08TrmhkyGRH77d5EQQ0CaHCPKng4iwFNs1MAvLjYGDkuoHrj1yen1700sDnFHoTZ">
      <UserProvider>
        <NavigationContainer>
          <Auth />
        </NavigationContainer>
      </UserProvider>
    </StripeProvider>
  );
}
