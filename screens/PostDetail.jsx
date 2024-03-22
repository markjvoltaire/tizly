import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { deletePost } from "../services/user";

export default function PostDetail({ route }) {
  // Extracting image URL from route parameters
  const { item } = route.params;

  // Function to handle deletion
  const handleDelete = async () => {
    // Logic to delete the post
    await deletePost(item);
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: item.media }}
        style={styles.image}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: 400, // Adjust height as needed
  },
  deleteButton: {
    alignSelf: "flex-start",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    margin: 20,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "white",
  },
});
