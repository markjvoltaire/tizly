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
import Orders from "../screens/Offers";
import OrderConfirmation from "../screens/OrderConfirmation";
import OrderDetails from "../screens/OrderDetails";
import MyServices from "../screens/MyServices";
import Post from "../screens/Post";

import AddTime from "../screens/AddDate";
import AddPrice from "../screens/AddDate";
import TaskDetails from "../screens/TaskDetails";
import AddLocation from "../screens/AddLocation";
import ReviewTask from "../screens/ReviewTask";
import Offers from "../screens/Offers";
import EditLocation from "../screens/EditLocation";
import EditProfile from "../screens/EditProfile";
import Login from "../screens/Login";
import Welcome from "../screens/Welcome";
import PersonalHome from "../screens/PersonalHome";
import PostService from "../screens/PostService";
import AddDate from "../screens/AddDate";
import SelectTime from "../screens/SelectTime";
import ServiceDetails from "../screens/ServiceDetails";
import ConfirmBooking from "../screens/ConfirmBooking";

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

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTintColor: "black",
            headerBackTitle: "Back",
          }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: true,
            headerTintColor: "black",
            headerBackTitle: "Back",
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

  const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="HomeScreen"
          component={user.type === "business" ? Home : PersonalHome}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Messages"
          component={Inbox}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Messages", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />
        <Stack.Screen
          name="EditLocation"
          component={EditLocation}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Edit Location", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="AddDate"
          component={AddDate}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Select Date", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="ConfirmBooking"
          component={ConfirmBooking}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Confirm Booking", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="SelectTime"
          component={SelectTime}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Select Time", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="TaskDetails"
          component={TaskDetails}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Task Details", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }} // Hide tab bar for this screen
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
          name="Orders"
          component={Orders}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Orders", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmation}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Order Confirmation", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="ServiceDetails"
          component={ServiceDetails}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "white", // Changing the color of the back button text
            headerTransparent: true,
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
            headerShown: true,
            headerTitle: "Profile Details", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            tabBarVisible: false,

            headerTitle: "", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
            headerTransparent: true,
          }} // Hide tab bar for this screen
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

  const PostStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Post"
          component={user.type === "business" ? PostService : Post}
          options={{
            headerTitle: "Post",
            tabBarVisible: false,
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="AddTime"
          component={AddTime}
          options={{
            headerTitle: "Select Task Date",
            tabBarVisible: false,
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="AddLocation"
          component={AddLocation}
          options={{
            headerTitle: "Select Task Location",
            tabBarVisible: false,
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="ReviewTask"
          component={ReviewTask}
          options={{
            headerTitle: "Review Task",
            tabBarVisible: false,
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
          name="Messages"
          component={Inbox}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Messages", // Customizing the header title
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

  const OfferStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="OffersScreen"
          component={Offers}
          options={{
            tabBarVisible: false,
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />

        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          options={{
            tabBarVisible: false,
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

        <Stack.Screen
          name="MyServices"
          component={MyServices}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
            headerTitle: "My Tasks", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetails}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Task Details", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="EditLocation"
          component={EditLocation}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Edit Location", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            tabBarVisible: false,
            headerShown: true,
            headerTitle: "Edit Profile", // Customizing the header title
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }} // Hide tab bar for this screen
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
          tabBarShowLabel: false,
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
        }}
        name="Home"
        component={HomeStack}
      />

      {/* INBOX SCREEN */}
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
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
        }}
        name="InboxStack"
        component={InboxStack}
      />

      <Tab.Screen
        options={{
          tabBarShowLabel: false,
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
        }}
        name="PostStack"
        component={PostStack}
      />

      {/* <Tab.Screen
        options={{
          tabBarShowLabel: false,
          headerShown: true,
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
        }}
        name="Offers"
        component={OfferStack}
      /> */}

      <Tab.Screen
        options={{
          tabBarShowLabel: false,
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
        }}
        name="Account"
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
