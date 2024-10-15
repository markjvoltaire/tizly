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
import BusinessIntro from "../screens/BusinessIntro";
import Dob from "../screens/Dob";
import Name from "../screens/Name";
import PaymentIntro from "../screens/PaymentIntro";
import AddAddress from "../screens/AddAddress";
import AddCity from "../screens/AddCity";
import Ssn from "../screens/Ssn";
import BusinessSignUp from "../screens/BusinessSignUp";

export default function NoAuth() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />

      <Stack.Screen name="ProfileType" component={ProfileType} />

      <Stack.Screen name="NoAuthAddLocation" component={NoAuthAddLocation} />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerBackTitle: "Back",
          headerTitle: "",
          headerShown: true, // Ensures the header is visible
          headerTransparent: true, // Makes the header transparent
          headerTitleStyle: {
            color: "#fff", // Set title color to white
          },
          headerTintColor: "#000", // Set the back button icon color to black
          headerBackTitleStyle: {
            color: "#000", // Set the back button text color to black
          },
        }}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Sign Up",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
      />

      <Stack.Screen
        name="Dob"
        component={Dob}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Sign Up",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
      />

      <Stack.Screen
        name="Name"
        component={Name}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Sign Up",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
      />

      <Stack.Screen
        name="PaymentIntro"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Verification",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
        component={PaymentIntro}
      />
      <Stack.Screen
        name="AddAddress"
        component={AddAddress}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Sign Up",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
      />
      <Stack.Screen
        name="AddCity"
        component={AddCity}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Sign Up",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
      />

      <Stack.Screen
        name="Ssn"
        component={Ssn}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Sign Up",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
      />
      <Stack.Screen
        name="BusinessSignUp"
        component={BusinessSignUp}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Sign Up",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
      />

      <Stack.Screen
        name="BusinessIntro"
        component={BusinessIntro}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Sign Up",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerBackTitle: "Back",
          headerTitle: "",
          headerShown: true, // Ensures the header is visible
          headerTransparent: true, // Makes the header transparent
          headerTitleStyle: {
            color: "#fff", // Set title color to white
          },
          headerTintColor: "#000", // Set the back button icon color to black
          headerBackTitleStyle: {
            color: "#000", // Set the back button text color to black
          },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
