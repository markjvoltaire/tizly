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
import Bookings from "../screens/Bookings";
import Search from "../screens/Search";
import InboxDetails from "../screens/InboxDetails";
import Category from "../screens/Category";
import Offering from "../screens/Offering";
import Gigs from "../screens/Gigs";
import Settings from "../screens/Settings";

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
          name="Category"
          component={Category}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Search"
          component={Search}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Offering"
          component={Offering}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Gig Information", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
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
          name="ProfileDetail"
          component={ProfileDetail}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Profile Details", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
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
      </Stack.Navigator>
    );
  };
  const InboxStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Inbox"
          component={Inbox}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Message Thread", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
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
      </Stack.Navigator>
    );
  };

  const GigsStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Post"
          component={Gigs}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Gigs Near You", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="Offering"
          component={Offering}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Gig", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />
      </Stack.Navigator>
    );
  };

  const BookingsStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Bookings"
          component={Bookings}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Your Bookings", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />
      </Stack.Navigator>
    );
  };

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
        name="InboxStack"
        component={InboxStack}
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
              Gigs
            </Text>
          ),
        }}
        name="GigsStack"
        component={GigsStack}
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
        name="BookingsStack"
        component={BookingsStack}
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
        name="UserProfileStack"
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
