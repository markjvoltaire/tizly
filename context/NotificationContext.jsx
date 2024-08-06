import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExpoPushToken } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { supabase } from "../services/supabase";
import { useUser } from "./UserContext";
import { registerForPushNotificationsAsync } from "../services/notification";

// Set notification handler to define how notifications should be handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Show alert for the notification
    shouldPlaySound: false, // Do not play sound for the notification
    shouldSetBadge: false, // Do not set badge for the notification
  }),
});

const NotificationProvider = ({ children }) => {
  // State to hold the Expo push token
  const [expoPushToken, setExpoPushToken] = useState(null);

  // Get the current user from UserContext
  const { user } = useUser();

  // State to hold the incoming notification
  const [notification, setNotification] = useState();
  // Refs to store notification listeners
  const notificationListener = useRef();
  const responseListener = useRef();

  // Function to save the push token to state and update it in the Supabase database
  const savePushToken = async (newToken) => {
    // If there is no new token or user ID, return early
    if (!newToken || !user?.user_id) {
      return;
    }

    // Set the new token in state
    setExpoPushToken(newToken);

    // Update the token in the database
    const resp = await supabase
      .from("profiles")
      .update({ expo_push_token: newToken })
      .eq("user_id", user.user_id);

    // Log the new token
    console.log("expoPushToken", expoPushToken);

    // Return the response from Supabase
    return resp;
  };

  // Function to handle user's decision on allowing notifications
  const handleNotificationPermission = async (decision) => {
    if (decision === "allow") {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          console.log("User opted in for notifications");
          savePushToken(token);
          AsyncStorage.setItem("notificationPermission", "allow");
        } else {
          console.log("User opted out of notifications");
          AsyncStorage.setItem("notificationPermission", "deny");
        }
      });
    } else {
      console.log("User opted out of notifications");
      AsyncStorage.setItem("notificationPermission", "deny");
    }
  };

  // useEffect hook to run code when the component mounts and unmounts

  // Render children components
  return <>{children}</>;
};

// Function to send a push notification using Expo's push notification service
export async function sendPushNotification(expoPushToken) {
  // Construct the message object
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  // Send the push notification
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message), // Convert message object to JSON
  });
}

export default NotificationProvider;
