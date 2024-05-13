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
  console.log("route", route);

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
        console.log("NO MESSAGES");
        setIsThereMessages(false);
      } else {
        console.log("resp", resp.body[0].threadID);
        console.log("THERE IS MESSAGES");
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
    const threadID = `${userId + profileDetails.user_id}`;
    console.log("threadID", threadID);

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
        console.log("messages", messages);
        setMessageText("");
      } else {
        Alert.alert("An error has occured please try again");
      }
    } else {
      Alert.alert("Please enter a message before sending.");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true); // Set refreshing to true when refreshing starts
    setRefreshing(false);
  };

  if (user === undefined) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{}}>
          <Text
            style={{
              fontSize: 30,
              marginBottom: 20,
            }}
          >
            inbox
          </Text>
          <Text
            style={{
              fontSize: 15,
              marginBottom: 10,

              color: "#717171",
            }}
          >
            Log in to see your send messages
          </Text>
          <Text
            style={{
              fontSize: 20,

              marginBottom: 20,
              color: "#717171",
            }}
          >
            Once you login, you'll be able to send messages
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 5,
              alignSelf: "stretch",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log("FOCUSED");
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
        console.log("NOT FOCUSED");
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
            showsVerticalScrollIndicator={false}
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
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            contentContainerStyle={styles.messagesContainer}
          >
            {messages.map((message, index) => (
              <>
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
              </>
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
              backgroundColor: "#007AFF",
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
  return message.type === "offering" ? (
    <View style={[styles.messageContainer, messageStyle]}>
      <Text
        style={{
          marginBottom: 10,
          color: sender === user.user_id ? null : "white",
          fontWeight: "600",
        }}
      >
        New Offering
      </Text>
      <Text style={{ color: sender === user.user_id ? null : "white" }}>
        {children}
      </Text>
      <Text
        style={{
          color: sender === user.user_id ? null : "white",
          fontSize: 10,
          fontFamily: "alata",
          marginBottom: 30,
        }}
      >
        {formattedDate}
      </Text>
      {/* Move time rendering here */}

      <Pressable
        onPress={() => navigation.navigate("OfferDetails")}
        style={{
          alignSelf: "center",
          backgroundColor: "#007AFF",
          width: 200,
          height: 40,
          justifyContent: "center",
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            color: sender === user.user_id ? "white" : null,
            fontWeight: "700",
          }}
        >
          {sender === user.user_id ? "Manage Offer" : "View Offer"}
        </Text>
      </Pressable>
    </View>
  ) : (
    <>
      <Pressable onLongPress={() => console.log("Hello")}>
        <View style={[styles.messageContainer, messageStyle]}>
          <Text style={{ color: sender === user.user_id ? null : "white" }}>
            {children}
          </Text>
          <Text
            style={{
              color: sender === user.user_id ? null : "white",
              fontSize: 10,
              fontFamily: "alata",
            }}
          >
            {formattedDate}
          </Text>
          {/* Move time rendering here */}
        </View>
      </Pressable>
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
    fontFamily: "Poppins-SemiBold",
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
    backgroundColor: "#029EF6",
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
