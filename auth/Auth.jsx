import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { supabase } from "../services/supabase";
import Home from "../screens/Home";

import UserProfile from "../screens/UserProfile";
import { useUser } from "../context/UserContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileDetail from "../screens/ProfileDetail";
import Inbox from "../screens/Inbox";

import InboxDetails from "../screens/InboxDetails";

import Settings from "../screens/Settings";

import SignUp from "../screens/SignUp";

import ResetPassword from "../screens/ResetPassword";
import TaskSearch from "../screens/TaskSearch";
import Orders from "../screens/Orders";

export default function Auth() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const userId = supabase.auth.currentUser?.id;
        if (!userId) return; // Handle the case where userId is null

        const { data: userData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, []);

  const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="HomeScreen"
          component={Home}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Settings", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="TaskSearch"
          component={TaskSearch}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Services", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="ProfileDetail"
          component={ProfileDetail}
          options={{
            tabBarVisible: false,
            headerTitle: "Profile Details", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="InboxDetails"
          component={InboxDetails}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Message Thread", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Sign Up", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Password Reset", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />
      </Stack.Navigator>
    );
  };
  // const InboxStack = () => {
  //   return (
  //     <Stack.Navigator screenOptions={{ headerShown: false }}>
  //       <Stack.Screen
  //         name="Inbox"
  //         component={Inbox}
  //         options={{
  //           tabBarVisible: false,
  //           headerShown: true,
  //           headerTitle: "Inbox", // Customizing the header title
  //           headerBackTitle: "Back", // Customizing the back button text
  //           headerTintColor: "black", // Changing the color of the back button text
  //         }}
  //       />

  //       <Stack.Screen
  //         name="InboxDetails"
  //         component={InboxDetails}
  //         options={{
  //           tabBarVisible: false,
  //           headerShown: true,
  //           headerTitle: "Message Thread", // Customizing the header title
  //           headerBackTitle: "Back", // Customizing the back button text
  //           headerTintColor: "black", // Changing the color of the back button text
  //         }}
  //       />

  //       <Stack.Screen
  //         name="SignUp"
  //         component={SignUp}
  //         options={{
  //           tabBarVisible: false,
  //           headerShown: true,
  //           headerTitle: "Sign Up", // Customizing the header title
  //           headerBackTitle: "Back", // Customizing the back button text
  //           headerTintColor: "black", // Changing the color of the back button text
  //         }}
  //       />

  //       <Stack.Screen
  //         name="ResetPassword"
  //         component={ResetPassword}
  //         options={{
  //           tabBarVisible: false,
  //           headerShown: true,
  //           headerTitle: "Password Reset", // Customizing the header title
  //           headerBackTitle: "Back", // Customizing the back button text
  //           headerTintColor: "black", // Changing the color of the back button text
  //         }}
  //       />
  //     </Stack.Navigator>
  //   );
  // };

  const UserProfileStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            tabBarVisible: false,
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Sign Up", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Password Reset", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={require("../assets/HomeActive.png")}
                style={{ width: size, height: size }}
              />
            ) : (
              <Image
                source={require("../assets/homeInactiveLightMode.png")}
                style={{ width: size, height: size }}
              />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                color: focused ? "black" : "grey",
              }}
            >
              Home
            </Text>
          ),
        }}
        name="Home"
        component={HomeStack}
      />

      {/* INBOX SCREEN */}
      {/* <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={require("../assets/MessageActive.png")}
                style={{ width: size, height: size }}
              />
            ) : (
              <Image
                source={require("../assets/Message.png")}
                style={{ width: size, height: size }}
              />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontFamily: "alata",
                fontSize: 12,
                color: focused ? "black" : "grey",
              }}
            >
              Inbox
            </Text>
          ),
        }}
        name="InboxStack"
        component={InboxStack}
      /> */}

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={require("../assets/Calendar.png")}
                style={{ width: size, height: size }}
              />
            ) : (
              <Image
                source={require("../assets/CalendarNotActive.png")}
                style={{ width: size, height: size }}
              />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                color: focused ? "black" : "grey",
              }}
            >
              Orders
            </Text>
          ),
        }}
        name="Orders"
        component={Orders}
      />

      <Tab.Screen
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={require("../assets/profileActive.png")}
                style={{ width: size, height: size }}
              />
            ) : (
              <Image
                source={require("../assets/profileNotActive.png")}
                style={{ width: size, height: size }}
              />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                color: focused ? "black" : "grey",
              }}
            >
              Profile
            </Text>
          ),
        }}
        name="Profile"
        component={UserProfileStack}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
