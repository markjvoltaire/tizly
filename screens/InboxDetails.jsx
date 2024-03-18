import React, { useState } from "react";
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
} from "react-native";
import { useUser } from "../context/UserContext";

export default function InboxDetails() {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "User",
      text: "Hey there! I'm interested in learning more about the services your business offers. Can you provide me with some information?",
    },
    {
      sender: "Business",
      text: "Hello! Thank you for reaching out. We offer a variety of services tailored to meet your needs. Could you please specify which services you are interested in so I can provide you with more detailed information?",
    },
    {
      sender: "User",
      text: "Sure! I'm particularly interested in your graphic design services. Can you tell me more about what you offer in that area?",
    },
    {
      sender: "Business",
      text: "Absolutely! Our graphic design services encompass logo design, branding, digital illustrations, and print media design. We work closely with our clients to ensure that the designs align with their vision and brand identity. Would you like to schedule a consultation to discuss your specific requirements further?",
    },
    {
      sender: "User",
      text: "That sounds great! I'd love to schedule a consultation. Can you provide me with some available dates and times?",
    },
    {
      sender: "Business",
      text: "Of course! We have availability next week on Monday, Wednesday, and Friday between 9 am and 5 pm. Please let me know which day and time works best for you, and we'll get it scheduled.",
    },
    {
      sender: "User",
      text: "Monday at 10 am works for me. Can you confirm that appointment?",
    },
    {
      sender: "Business",
      text: "Absolutely! Your appointment for a consultation on Monday at 10 am is confirmed. We look forward to discussing your graphic design needs further. If you have any other questions in the meantime, feel free to reach out.",
    },
    {
      sender: "User",
      text: "Great, thank you! I'm excited to chat more about how your services can benefit my business.",
    },
    {
      sender: "Business",
      text: "The pleasure is ours! We're here to help in any way we can. See you on Monday at 10 am!",
    },
  ]);

  const sendMessage = () => {
    if (messageText.trim() !== "") {
      setMessages([...messages, { sender: "User", text: messageText.trim() }]);
      setMessageText("");
    }
  };

  const screenHeight = Dimensions.get("window").height;

  const { user, setUser } = useUser(null);

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
              fontFamily: "AirbnbCereal-Bold",
              marginBottom: 20,
            }}
          >
            inbox
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "AirbnbCereal-Medium",
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
                fontFamily: "AirbnbCereal-Bold",
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
    >
      <View style={[styles.container, { height: screenHeight }]}>
        <ScrollView contentContainerStyle={styles.messagesContainer}>
          {messages.map((message, index) => (
            <Message key={index} sender={message.sender}>
              {message.text}
            </Message>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const Message = ({ sender, children }) => {
  const messageStyle =
    sender === "User" ? styles.userMessage : styles.businessMessage;
  return (
    <View style={[styles.messageContainer, messageStyle]}>
      <Text style={styles.sender}>{sender}:</Text>
      <Text>{children}</Text>
    </View>
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
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  businessMessage: {
    backgroundColor: "#c8e6c9",
    alignSelf: "flex-end",
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
