import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { supabase } from "../services/supabase";
import LottieView from "lottie-react-native";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native"; // Import useScrollToTop

export default function Offering({ route, navigation }) {
  const [taskDescription, setTaskDescription] = React.useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isThereMessages, setIsThereMessages] = useState(false);
  const [threadId, setThreadId] = useState();

  console.log("route", route.params.route.params.task_id);

  async function getMessages() {
    try {
      const userId = supabase.auth.currentUser.id;
      const resp = await supabase
        .from("messages")
        .select("*")
        .in("sender", [route.params.route.params.user_id, userId]) // Separate strings for each field
        .in("receiver", [route.params.route.params.user_id, userId])
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

  const sendOffer = async () => {
    const userId = supabase.auth.currentUser.id;
    const threadID = `${userId + route.params.route.params.user_id}`;
    console.log("threadID", threadID);

    if (taskDescription.trim() !== "") {
      const res = await supabase.from("messages").insert([
        {
          task_id: route.params.route.params.task_id,
          type: "offering",
          sender: userId,
          receiver: route.params.route.params.user_id,
          message: taskDescription,
          threadID:
            isThereMessages === false
              ? userId + route.params.route.params.user_id
              : threadId,
        },
      ]);
      if (res.error === null) {
        console.log("OFFER SENT");
      } else {
        Alert.alert("An error has occured please try again");
      }
    } else {
      Alert.alert("Please enter a message before sending.");
    }
  };

  const handleSubmit = () => {
    console.log("Task Category:", route.params);
    console.log("Task Description:", taskDescription);
    sendOffer();
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("FOCUSED");
      let isMounted = true;

      const fetchData = async () => {
        try {
          const resp = await getMessages();
          if (isMounted) {
            null;
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

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Offer Details</Text>
      <TextInput
        style={{
          height: 100,
          width: "100%",
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 12,
          marginBottom: 20,
          paddingHorizontal: 10,
          fontFamily: "alata",
          borderWidth: 1,
          borderColor: "#BBBBBB",
          backgroundColor: "#F3F3F9",
        }}
        multiline={true}
        numberOfLines={4}
        placeholderTextColor="grey"
        placeholder="Explain what you are offering"
        value={taskDescription}
        onChangeText={(text) => setTaskDescription(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Offer</Text>
      </TouchableOpacity>
      <Modal animationType="slide" visible={uploading}>
        <Text
          style={{
            color: "black",
            top: uploadComplete === true ? 180 : 290,
            fontSize: 20,
            alignSelf: "center",
            fontWeight: "600",
          }}
        >
          {uploadComplete === true ? "Upload complete." : "Uploading Your Gig"}
        </Text>
        <LottieView
          style={{
            height: uploadComplete === true ? 300 : 530,
            width: 530,
            top: 200,
            alignSelf: "center",
          }}
          source={
            uploadComplete === true
              ? require("../assets/lottie/greenCheck.json")
              : require("../assets/lottie/airplaneLoading.json")
          }
          autoPlay
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
