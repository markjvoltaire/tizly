import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../services/supabase";

export default function PostGig({ route }) {
  const [taskDescription, setTaskDescription] = React.useState("");

  async function uploadGig() {
    const userId = supabase.auth.currentUser.id;
    try {
      const newGig = {
        user_id: userId,
        taskDescription: taskDescription, // Use the current value of the description state
        category: route.params,
      };
      const resp = await supabase.from("gigs").insert([newGig]);
      console.log("resp", resp);
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post Gig</Text>
      </TouchableOpacity>
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
