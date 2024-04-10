import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useUser } from "../context/UserContext";

export default function GigDetails({ route, navigation }) {
  const { user } = useUser();

  const handleApplyNow = () => {
    route.params.user_id === user.user_id
      ? console.log("MY GIG")
      : navigation.navigate("Offering", { route });
    console.log("Apply button pressed!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{route.params.category}</Text>
        {/* <Text style={styles.location}>Location: Miami, FL</Text> */}
        <View style={styles.separator}></View>
        <Text style={styles.title}>Description:</Text>
        <Text style={styles.detail}>{route.params.taskDescription}</Text>
        <View style={styles.separator}></View>
        <Text style={styles.title}>Date:</Text>
        <Text style={styles.detail}> {route.params.taskDate}</Text>
      </View>
      {route.params.user_id === user.user_id ? null : (
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyNow}>
          <Text style={styles.applyButtonText}>
            {route.params.user_id === user.user_id
              ? "Manage Gig"
              : "Make Offer"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between", // Arrange children vertically with space between
  },

  infoContainer: {
    padding: 20,
    borderRadius: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },

  location: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },

  separator: {
    height: 0.4,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },

  detail: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },

  applyButton: {
    backgroundColor: "#007AFF", // Blue color
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    margin: 20,
  },

  applyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
