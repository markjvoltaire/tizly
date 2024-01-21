import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { supabase } from "./supabase/supabase";
import { UserProvider } from "./context/UserContext";
import { NavigationContainer } from "@react-navigation/native";

import { StyleSheet, Text, View } from "react-native";
import NoAuth from "./auth/NoAuth";
import Auth from "./auth/Auth";

export default function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthStateChange = (_event, session) => {
      if (_event === "SIGNED_IN") {
        setAuth(session);
      } else if (_event === "SIGNED_OUT") {
        setAuth(null);
      }
    };

    const session = supabase.auth.session();
    console.log("session", session);
    setAuth(session);

    supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      supabase.auth.offAuthStateChange(handleAuthStateChange);
    };
  }, []);

  return (
    <NavigationContainer>
      <UserProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          {auth === null ? <NoAuth /> : <Auth />}
        </View>
      </UserProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
