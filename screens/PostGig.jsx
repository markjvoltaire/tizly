import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { supabase } from "../services/supabase";
import LottieView from "lottie-react-native";
import { useUser } from "../context/UserContext";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function PostGig({ route, navigation }) {
  const [taskDescription, setTaskDescription] = React.useState("");
  const [taskDate, setTaskDate] = React.useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const [date, setDate] = useState(new Date());

  const onChange = (e, selectedDate) => {
    setDate(selectedDate);
  };

  async function uploadGig() {
    setUploading(true);
    const userId = supabase.auth.currentUser.id;
    try {
      const newGig = {
        user_id: userId,
        taskDescription: taskDescription, // Use the current value of the description state
        category: route.params,
        taskDate: taskDate,
      };
      const resp = await supabase.from("gigs").insert([newGig]);

      await new Promise((resolve) =>
        setTimeout(() => {
          setUploadComplete(true);
          resolve();
        }, 2000)
      ); // 4000 milliseconds = 4 seconds

      await new Promise((resolve) =>
        setTimeout(() => {
          setUploading(false);
          setUploadComplete(false);
          navigation.navigate("Gigs");
          resolve();
        }, 2000)
      ); // 2000 milliseconds = 2 seconds

      return resp;
    } catch (error) {
      console.error("Error submitting comment:", error);
      throw error;
    }
  }
  console.log("route", route.params);

  const handleSubmit = () => {
    // Handle submission of the gig post
    console.log("Task Category:", route.params);
    console.log("Task Description:", taskDescription);
    uploadGig();
    // Additional logic for submitting the post
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Post a Gig</Text>
      <TextInput
        style={{
          height: 140,
          width: "100%",
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 12,
          marginBottom: 40,
          paddingHorizontal: 10,
          fontFamily: "alata",
          borderWidth: 1,
          borderColor: "#BBBBBB",
          backgroundColor: "#F3F3F9",
        }}
        multiline={true}
        numberOfLines={4}
        placeholderTextColor="grey"
        placeholder="Describe your task..."
        value={taskDescription}
        onChangeText={(text) => setTaskDescription(text)}
      />
      <TextInput
        style={{
          height: 60,
          width: "100%",
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 12,
          marginBottom: 40,
          paddingHorizontal: 10,
          fontFamily: "alata",
          borderWidth: 1,
          borderColor: "#BBBBBB",
          backgroundColor: "#F3F3F9",
        }}
        placeholder="MM/DD/YYYY"
        placeholderTextColor="grey"
        keyboardType="numeric"
        maxLength={8} // MM/DD/YYYY has 10 characters
        value={taskDate}
        onChangeText={(text) => setTaskDate(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post Gig</Text>
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
  categoryText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
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
