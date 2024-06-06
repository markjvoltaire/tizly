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
import { useUser } from "../context/UserContext";
import Login from "../component/Login";

export default function Post({ route, navigation }) {
  const [taskDescription, setTaskDescription] = useState("");
  const { user, setUser } = useUser();
  const maxCharacters = 60;

  console.log("user", user);

  const handleNext = () => {
    if (taskDescription.length < 3) {
      Alert.alert("Task description must be at least 3 characters long.");
      return;
    }
    navigation.navigate("AddLocation", { taskDescription });
    setTaskDescription("");
  };

  if (!user) {
    return <Login />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Describe what task you need done</Text>
      <TextInput
        style={styles.textInput}
        multiline={true}
        numberOfLines={4}
        placeholder="What do you need done for you?"
        placeholderTextColor="grey"
        value={taskDescription}
        onChangeText={(text) => {
          if (text.length <= maxCharacters) {
            setTaskDescription(text);
          }
        }}
      />
      <Text style={styles.characterCount}>
        {taskDescription.length}/{maxCharacters}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
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
  header: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "300",
    paddingHorizontal: 10,
  },
  textInput: {
    height: 100,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: "gilroy",
    borderWidth: 1,
    borderColor: "#BBBBBB",
    backgroundColor: "#F3F3F9",
  },
  characterCount: {
    alignSelf: "flex-end",
    marginBottom: 10,
    color: "grey",
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
