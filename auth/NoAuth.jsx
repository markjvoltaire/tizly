import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Welcome from "../screens/Welcome";
import { UserProvider, useUser } from "../context/UserContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import ResetPassword from "../screens/ResetPassword";

export default function NoAuthStack({ auth }) {
  const { user, setUser } = useUser();
  const Stack = createNativeStackNavigator();

  return (
    <UserProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </UserProvider>
  );
}

const styles = StyleSheet.create({});
