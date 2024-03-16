import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";

// Sample data for gigs
const gigsData = [
  {
    id: "1",
    profilePicture: require("../assets/photo.jpg"),
    username: "user1",
    description: "I need a personal trainer to help me with my fitness goals.",
    date: "2024-03-14",
    taskDescription:
      "I'm looking for someone to create a personalized workout plan and provide guidance on nutrition.",
    category: "Fitness",
  },
  {
    id: "2",
    profilePicture: require("../assets/photo6.jpg"),
    username: "user2",
    description: "I need a photographer for my upcoming event.",
    date: "2024-03-15",
    taskDescription:
      "I need someone to capture photos and videos of the event, including candid shots and group photos.",
    category: "Photography",
  },
  // Add more gigs as needed
];

// Component for rendering each gig card

const GigCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={item.profilePicture} style={styles.profilePicture} />
      <View style={styles.cardContent}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.taskDescription}>{item.taskDescription}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );
};
export default function Bookings({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={gigsData}
        renderItem={({ item }) => <GigCard item={item} />}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardContent: {
    padding: 15,
  },
  profilePicture: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
    backgroundColor: "grey",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
});
