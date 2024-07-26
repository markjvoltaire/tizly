import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import ResetPassword from "../screens/ResetPassword";
import ProfileType from "../screens/ProfileType";
import AddLocation from "../screens/AddLocation";
import NoAuthAddLocation from "../screens/NoAuthAddLocation";

export default function NoAuth() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ tabBarVisible: false }} // Hide tab bar for this screen
      />

      <Stack.Screen
        name="ProfileType"
        component={ProfileType}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Account Type",
          headerTintColor: "black",
        }} // Hide tab bar for this screen
      />

      <Stack.Screen
        name="NoAuthAddLocation"
        component={NoAuthAddLocation}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Location",
          headerTintColor: "black",
        }} // Hide tab bar for this screen
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTintColor: "black",
        }} // Hide tab bar for this screen
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: true,
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerShown: true,
          headerTintColor: "black",
          headerBackTitle: "Back",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
