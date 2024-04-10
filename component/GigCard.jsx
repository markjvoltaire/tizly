import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
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
  }, [item.user_id]); // Added dependency to avoid unnecessary re-renders

  const renderUserInfo = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" color="grey" />;
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

  const newItem = {
    ...item,
    profileimage: userDetails?.profileimage,
    username: userDetails?.username,
    profession: userDetails?.profession,
  }; // Fixed potential null error

  return (
    <View style={{}}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
