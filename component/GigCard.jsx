import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";

const GigCard = ({ navigation, item }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const { user } = useUser();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", item.user_id)
          .single();

        if (error) throw error;

        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getUserDetails();
  }, []);

  const renderUserInfo = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" color="#007AFF" />;
    } else {
      return (
        <>
          <Image
            style={styles.userImage}
            source={{ uri: userDetails?.profileimage }}
          />
          <Text style={styles.username}>{userDetails?.username}</Text>
        </>
      );
    }
  };

  const handleOptionPress = () => {
    // Handle option press
  };

  const handleMorePress = () => {
    // Handle more press
  };

  // Add something to the item object
  const newItem = {
    ...item,
    profileimage: userDetails.profileimage,
    username: userDetails.username,
  };

  console.log("userDetails", userDetails);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          item.user_id === user.user_id
            ? navigation.navigate("UserProfile")
            : navigation.navigate("ProfileDetail", { item: newItem })
        }
        style={styles.userContainer}
      >
        {renderUserInfo()}
      </Pressable>

      <TouchableOpacity onPress={handleOptionPress} style={styles.optionButton}>
        <Image style={styles.moreIcon} source={require("../assets/More.png")} />
      </TouchableOpacity>
      <Pressable onPress={() => navigation.navigate("GigDetails", item)}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.category}</Text>
          <Text style={styles.location}>Location: Miami, FL</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>Description:</Text>
          <Text style={styles.description}>{item.taskDescription}</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>Date:</Text>
          <Text style={styles.date}>{item.taskDate}</Text>
        </View>
      </Pressable>
      {/* {!isLoading && (
        <TouchableOpacity style={styles.button} onPress={handleMorePress}>
          <Text style={styles.buttonText}>
            {user.user_id === item.user_id ? " Manage Offer" : "Make Offer"}
          </Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  optionButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  moreIcon: {
    width: 50,
    height: 50,
  },
  infoContainer: {
    padding: 20,
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
    height: 0.5,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default GigCard;
