import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  useColorScheme,
} from "react-native";
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
import PostInfo from "../components/Post/PostInfo";
import PostDetail from "../screens/PostDetails";
import Comments from "../screens/Comments";
import EditProfile from "../screens/EditProfile";
import Settings from "../screens/Settings";
import VideoScreen from "../screens/VideoScreen";
import AlertVideo from "../screens/AlertVideo";
import FriendsList from "../screens/FriendsList";
import Reactions from "../screens/Reactions";

export default function Auth() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [loading, setLoading] = useState(true);
  const { setUser } = useUser();
  const scheme = useColorScheme();

  const userId = supabase.auth.currentUser.id;

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
          name="Reactions"
          component={Reactions}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Comments"
          component={Comments}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="ProfileDetail"
          options={{ tabBarVisible: false }}
          component={ProfileDetail}
        />

        <Stack.Screen
          name="Uploading"
          options={{ tabBarVisible: false }}
          component={Uploading}
        />

        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="VideoPost"
          component={VideoScreen}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="FriendsList"
          options={{ tabBarVisible: false }}
          component={FriendsList}
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
          name="UserProfile"
          component={UserProfile}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Reactions"
          component={Reactions}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="ProfileDetail"
          options={{ tabBarVisible: false }}
          component={ProfileDetail}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="VideoPost"
          component={VideoScreen}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Comments"
          component={Comments}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Uploading"
          options={{ tabBarVisible: false }}
          component={Uploading}
        />

        <Stack.Screen
          name="FriendsList"
          options={{ tabBarVisible: false }}
          component={FriendsList}
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
          name="FriendsList"
          options={{ tabBarVisible: false }}
          component={FriendsList}
        />

        <Stack.Screen
          name="Uploading"
          options={{ tabBarVisible: false }}
          component={Uploading}
        />
      </Stack.Navigator>
    );
  };

  const AlertStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Alert"
          component={Alerts}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Reactions"
          component={Reactions}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="AlertVideo"
          component={AlertVideo}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="ProfileDetail"
          options={{ tabBarVisible: false }}
          component={ProfileDetail}
        />

        <Stack.Screen
          name="FriendsList"
          options={{ tabBarVisible: false }}
          component={FriendsList}
        />

        <Stack.Screen
          name="PostDetail"
          options={{ tabBarVisible: false }}
          component={PostDetail}
        />
        <Stack.Screen
          name="VideoPost"
          component={VideoScreen}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Comments"
          component={Comments}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
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
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Comments"
          component={Comments}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="Reactions"
          component={Reactions}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="ProfileDetail"
          options={{ tabBarVisible: false }}
          component={ProfileDetail}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />
        <Stack.Screen
          name="VideoPost"
          component={VideoScreen}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />

        <Stack.Screen
          name="PostDetail"
          options={{ tabBarVisible: false }}
          component={PostDetail}
        />

        <Stack.Screen
          name="Uploading"
          options={{ tabBarVisible: false }}
          component={Uploading}
        />

        <Stack.Screen
          name="FriendsList"
          options={{ tabBarVisible: false }}
          component={FriendsList}
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ tabBarVisible: false }} // Hide tab bar for this screen
        />
      </Stack.Navigator>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: scheme === "dark" ? "#121212" : "#fff",
        }, // Change 'your_desired_color' to the color you want
      }}
    >
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={
                  scheme === "light"
                    ? require("../assets/HomeActive.png")
                    : require("../assets/houseFilled.png")
                }
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
                source={
                  scheme === "light"
                    ? require("../assets/SearchActive.png")
                    : require("../assets/searchFilled.png")
                }
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
                source={
                  scheme === "light"
                    ? require("../assets/PlusActive.png")
                    : require("../assets/PlusLight.png")
                }
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
                source={
                  scheme === "light"
                    ? require("../assets/NotificationActive.png")
                    : require("../assets/bellFilled.png")
                }
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
        component={AlertStack}
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
                source={
                  scheme === "light"
                    ? require("../assets/profileActive.png")
                    : require("../assets/ProfileLight.png")
                }
                style={{ width: size, height: size }}
              />
            ) : (
              <Image
                source={require("../assets/profileNotActive.png")}
                style={{ width: size, height: size }}
              />
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
