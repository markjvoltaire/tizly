import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { supabase } from "../services/supabase";
import Home from "../screens/Home";
import Explore from "../screens/Inbox";
import Post from "../screens/Post";
import Alerts from "../screens/Bookings";
import UserProfile from "../screens/UserProfile";
import { useUser } from "../context/UserContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileDetail from "../screens/ProfileDetail";
import Inbox from "../screens/Inbox";
import Bookings from "../screens/Bookings";
import Search from "../screens/Search";

export default function Auth() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();

  const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="HomeScreen"
          component={Home}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Search"
          component={Search}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="ProfileDetail"
          component={ProfileDetail}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />
      </Stack.Navigator>
    );
  };

  const PostStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Post"
          component={Post}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
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
                fontFamily: "alata",
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

      <Tab.Screen
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
        name="Explore"
        component={Explore}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={require("../assets/post.png")}
                style={{ width: size, height: size }}
              />
            ) : (
              <Image
                source={require("../assets/postNotActive.png")}
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
              Post
            </Text>
          ),
        }}
        name="PostStack"
        component={PostStack}
      />

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
                fontFamily: "alata",
                fontSize: 12,
                color: focused ? "black" : "grey",
              }}
            >
              Bookings
            </Text>
          ),
        }}
        name="Bookings"
        component={Bookings}
      />

      <Tab.Screen
        options={{
          headerShown: false,
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
                fontFamily: "alata",
                fontSize: 12,
                color: focused ? "black" : "grey",
              }}
            >
              Profile
            </Text>
          ),
        }}
        name="UserProfile"
        component={UserProfile}
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
