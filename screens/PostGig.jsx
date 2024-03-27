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
import DatePicker from "react-native-modern-datepicker";

export default function PostGig({ route, navigation }) {
  const [taskDescription, setTaskDescription] = React.useState("");
  const [taskDate, setTaskDate] = React.useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");

  const onChange = (e, selectedDate) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const newFormattedDate = selectedDate.toLocaleString(undefined, options);
    setDate(selectedDate);
    setFormattedDate(newFormattedDate); // Store the formatted date in state
    console.log("date", newFormattedDate);
  };

  async function uploadGig() {
    setUploading(true);
    const userId = supabase.auth.currentUser.id;
    try {
      const newGig = {
        user_id: userId,
        taskDescription: taskDescription,
        category: route.params,
        taskDate: formattedDate,
      };
      const resp = await supabase.from("gigs").insert([newGig]);

      await new Promise((resolve) =>
        setTimeout(() => {
          setUploadComplete(true);
          resolve();
        }, 2000)
      );

      await new Promise((resolve) =>
        setTimeout(() => {
          setUploading(false);
          setUploadComplete(false);
          navigation.goBack();
          resolve();
        }, 2000)
      );

      return resp;
    } catch (error) {
      console.error("Error submitting comment:", error);
      throw error;
    }
  }

  const handleSubmit = () => {
    console.log("Task Category:", route.params);
    console.log("Task Description:", taskDescription);
    uploadGig();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Post a Gig</Text>
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
        placeholder="Describe your task..."
        value={taskDescription}
        onChangeText={(text) => setTaskDescription(text)}
      />
      <DateTimePicker
        value={date}
        mode={"datetime"}
        is24Hour={true}
        onChange={onChange}
        style={{ alignSelf: "center", marginBottom: 20 }}
        themeVariant="light"
        positiveButtonLabel="OK!"
      />
      <Text
        style={{
          alignSelf: "center",
          fontWeight: "700",
          fontSize: 15,
          marginBottom: 30,
        }}
      >
        Gig Date: {formattedDate}
      </Text>
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
