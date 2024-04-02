import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
} from "react-native";

export default function Category({ route }) {
  // Sample data for profile cards
  const profileData = [
    {
      id: 1,
      name: "John Doe",
      image: require("../assets/chef.jpg"),
      description: "Experienced plumber",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Jane Smith",
      image: require("../assets/makeUp.jpg"),
      description: "Skilled electrician",
      rating: 5,
    },
    // Add more profile data as needed
  ];

  // Profile card component
  const ProfileCard = ({ item }) => (
    <Pressable onPress={() => console.log("hello")}>
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.rating}>Average Rating: {item.rating}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginLeft: 10 }}>
        {route.params.item.profession}
      </Text>
      <FlatList
        style={{ top: 10 }}
        data={profileData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProfileCard item={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "grey",
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  rating: {
    fontSize: 14,
    color: "#888",
  },
});
