import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PhotoPan from "./PhotoPan";

export default function UserCard({ item, navigation }) {
  // Hard-coded data
  const user = {
    name: "John Doe",
    location: "Miami, FL",
    profession: "Visual Media",
    price: "$120",
    image: require("../assets/photo1.jpg"), // Path to your image asset
  };

  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setLoading(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust duration as needed
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={[styles.container, styles.cardOutline]}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Pressable
          onPress={() => navigation.navigate("ProfileDetail", { item: item })}
        >
          <View style={styles.infoContainer}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: item.profileimage }}
                style={styles.profileImage}
              />
              <Text style={styles.name}>{item.displayName}</Text>
            </View>
            <Text style={styles.location}>{user.location}</Text>
            <View style={styles.professionContainer}>
              <Text style={styles.profession}>{item.profession}</Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: "hidden", // Ensure content is clipped within borderRadius
  },
  cardOutline: {
    borderColor: "#ccc", // Border color
    borderWidth: 1, // Border width
  },
  imageContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200, // Adjust the height as needed
    backgroundColor: "grey",
  },
  infoContainer: {
    padding: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "grey",
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  location: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  professionContainer: {
    marginBottom: 5,
  },
  profession: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00a699",
  },
});
