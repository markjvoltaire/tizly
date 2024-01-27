import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { supabase } from "../services/supabase";
import Home from "../screens/Home";
import Explore from "../screens/Explore";
import Post from "../screens/Post";
import Alerts from "../screens/Alerts";
import UserProfile from "../screens/UserProfile";
import { useUser } from "../context/UserContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileDetail from "../screens/ProfileDetail";
import Uploading from "../screens/Uploading";

export default function Auth() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();

  const userId = supabase.auth.currentUser.id;

  async function getUserById() {
    const { body: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    return user;
  }

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const { body: userData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", supabase.auth.currentUser.id)
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
          name="ProfileDetail"
          options={{ tabBarVisible: false }}
          component={ProfileDetail}
        />
      </Stack.Navigator>
    );
  };

  const ExploreStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Explore"
          component={Explore}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="ProfileDetail"
          options={{ tabBarVisible: false }}
          component={ProfileDetail}
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

        <Stack.Screen
          name="Uploading"
          options={{ tabBarVisible: false }}
          component={Uploading}
        />
      </Stack.Navigator>
    );
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={require("../assets/HomeActive.png")}
                style={{ width: size, height: size }}
              />
            ) : (
              <Image
                source={require("../assets/HomeNotActive.png")}
                style={{ width: size, height: size }}
              />
            ),
        }}
        name="Home"
        component={HomeStack}
      />

      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={require("../assets/SearchActive.png")}
                style={{ width: size, height: size }}
              />
            ) : (
              <Image
                source={require("../assets/SearchNotActive.png")}
                style={{ width: size, height: size }}
              />
            ),
        }}
        name="ExploreStack"
        component={ExploreStack}
      />

      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={require("../assets/PlusActive.png")}
                style={{ width: size, height: size }}
              />
            ) : (
              <Image
                source={require("../assets/PlusNotActive.png")}
                style={{ width: size, height: size }}
              />
            ),
        }}
        name="PostStack"
        component={PostStack}
      />

      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={require("../assets/NotificationActive.png")}
                style={{ width: size, height: size }}
              />
            ) : (
              <Image
                source={require("../assets/NotificationNotActive.png")}
                style={{ width: size, height: size }}
              />
            ),
        }}
        name="Alerts"
        component={Alerts}
      />

      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            loading ? (
              <ActivityIndicator color={color} size="small" />
            ) : focused ? (
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
