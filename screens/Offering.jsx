import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useUser } from "../context/UserContext";

export default function Offering() {
  const { user, setUser } = useUser(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../assets/photo.jpg")} // Add path to your profile image
          style={styles.profileImage}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Gig Title</Text>
          <Text style={styles.location}>Location: Los Angeles, California</Text>
          <View style={styles.separator}></View>
          <Text style={styles.description}>
            Looking for a passionate individual who loves outdoor activities and
            can capture stunning moments.
          </Text>
          <View style={styles.separator}></View>
          <Text style={styles.requirement}>
            Requirements: DSLR camera, Experience in outdoor photography
          </Text>
          <View style={styles.separator}></View>
          <Text style={styles.date}>Date: April 5, 2024</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // Instagram typically uses a white background
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60, // Added padding to accommodate button
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginBottom: 20,
    backgroundColor: "grey",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333", // Instagram typically uses a dark gray for text color
  },
  location: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  requirement: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  date: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF", // Instagram typically uses blue for buttons
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
