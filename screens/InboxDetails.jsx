import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView,
  Dimensions,
  Pressable,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native"; // Import useScrollToTop
import { sendPushNotification } from "../services/notification";

export default function InboxDetails({ route, navigation }) {
  const profileDetails = route.params.profileDetails;
  const [refreshing, setRefreshing] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const [loading, setLoading] = useState(true);
  const [isThereMessages, setIsThereMessages] = useState(false);
  const [threadId, setThreadId] = useState();
  const { user } = useUser();

  console.log("profileDetails", profileDetails);

  async function getMessages() {
    try {
      const userId = supabase.auth.currentUser.id;
      const resp = await supabase
        .from("messages")
        .select("*")
        .in("sender", [profileDetails.user_id, userId]) // Separate strings for each field
        .in("receiver", [profileDetails.user_id, userId])
        .order("created_at", { ascending: true });

      // Assuming your response structure is like { data: [], error: null }
      if (resp.error) {
        throw new Error(resp.error.message);
      }

      if (resp.body.length === 0) {
        setIsThereMessages(false);
      } else {
        setThreadId(resp.body[0].threadID);
        setIsThereMessages(true);
      }

      return resp.data; // Assuming data is where the actual message data is stored
    } catch (error) {
      console.error("Error fetching messages:", error);
      return []; // or handle error as per your application's requirement
    }
  }
  const sendMessage = async () => {
    const userId = supabase.auth.currentUser.id;

    const body = `New message from ${user.username}`;
    console.log("body line 68", body);
    const title = "New Message";
    const tokenCode = profileDetails.expo_push_token;

    if (messageText.trim() !== "") {
      const res = await supabase.from("messages").insert([
        {
          type: "message",
          sender: userId,
          receiver: profileDetails.user_id,
          message: messageText,

          threadID:
            isThereMessages === false
              ? userId + profileDetails.user_id
              : threadId,
        },
      ]);
      if (res.error === null) {
        setMessages([
          ...messages,
          { sender: userId, message: messageText.trim() },
        ]);

        setMessageText("");
        await sendPushNotification(body, title, tokenCode);
      } else {
        Alert.alert("An error has occured please try again");
      }
    } else {
      Alert.alert("Please enter a message before sending.");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true); // Set refreshing to true when refreshing starts
    const retrieveMessages = async () => {
      const resp = await getMessages();
      setMessages(resp);
      setLoading(false);
    };
    retrieveMessages();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      const fetchData = async () => {
        try {
          const resp = await getMessages();
          if (isMounted) {
            setMessages(resp);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchData();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  useEffect(() => {
    const retrieveMessages = async () => {
      const resp = await getMessages();
      setMessages(resp);
      setLoading(false);
    };
    retrieveMessages();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : -200}
    >
      <View style={[styles.container, { height: screenHeight }]}>
        {messages.length === 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            contentContainerStyle={styles.messagesContainer}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "alata", fontSize: 16 }}>
                Be the first to start the conversation
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            contentContainerStyle={styles.messagesContainer}
          >
            {messages.map((message, index) => (
              <Message
                message={message}
                user={user}
                profileDetails={profileDetails}
                key={index}
                sender={message.sender}
                navigation={navigation}
              >
                {message.message}
              </Message>
            ))}
            <View style={{ height: 100 }} />
          </ScrollView>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: "white",
          }}
        >
          <TextInput
            placeholderTextColor="#080A0B"
            style={styles.commentInput}
            placeholder="Add a message "
            multiline
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
          />

          <Pressable
            onPress={() => sendMessage()}
            style={{
              backgroundColor: "green",
              width: screenWidth * 0.25,
              height: screenHeight * 0.04,
              justifyContent: "center",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "800",
                alignSelf: "center",
              }}
            >
              Send
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const Message = ({ sender, children, message, user, navigation }) => {
  const date = new Date(message.created_at);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  let formattedDate;

  if (daysDifference > 7) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = date.getMonth();
    const monthName = monthNames[month];
    formattedDate = `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
  } else if (daysDifference > 0) {
    formattedDate =
      daysDifference === 1 ? "1 day ago" : `${daysDifference} days ago`;
  } else if (hoursDifference > 0) {
    formattedDate =
      hoursDifference === 1 ? "1 hour ago" : `${hoursDifference} hours ago`;
  } else if (minutesDifference > 0) {
    formattedDate =
      minutesDifference === 1
        ? "1 minute ago"
        : `${minutesDifference} minutes ago`;
  } else {
    formattedDate = "Just now";
  }

  const messageStyle =
    sender === user.user_id ? styles.userMessage : styles.businessMessage;

  return (
    <>
      <>
        <Pressable onLongPress={() => console.log("Hello")}>
          <View style={[styles.messageContainer, messageStyle]}>
            <Text
              style={{
                color: sender === user.user_id ? null : "white",
                fontWeight: "600",
                marginBottom: 5,
              }}
            >
              {children}
            </Text>
            {/* Move time rendering here */}
            <Text
              style={{
                color: sender === user.user_id ? null : "white",
                fontSize: 11,
                fontWeight: "400",
              }}
            >
              {formattedDate}
            </Text>
          </View>
        </Pressable>
      </>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 20,
  },
  commentInput: {
    alignSelf: "center",
    paddingLeft: 8,
    borderColor: "black",
    borderWidth: 0.3,
    borderRadius: 12,
    backgroundColor: "#F3F3F9",
    width: 250,
    height: 40,

    fontSize: 13,
    paddingTop: 12,
    justifyContent: "center",
  },
  messageContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    width: 300,
  },
  userMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-end",
  },
  businessMessage: {
    backgroundColor: "green",
    alignSelf: "flex-start",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
