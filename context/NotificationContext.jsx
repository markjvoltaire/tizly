import { useEffect, useRef, useState } from "react";
import { ExpoPushToken } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { supabase } from "../services/supabase";
import { useUser } from "./UserContext";
import { registerForPushNotificationsAsync } from "../services/notification";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);

  const { user } = useUser();

  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  const savePushToken = async (newToken) => {
    setExpoPushToken(newToken);
    if (!newToken || !user?.user_id) {
      console.log("FALSE");
      return;
    }
    // update the token in the database
    const resp = await supabase
      .from("profiles")
      .update({ expo_push_token: newToken })
      .eq("user_id", user.user_id);

    return resp;
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => savePushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return <>{children}</>;
};

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
export async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export default NotificationProvider;
