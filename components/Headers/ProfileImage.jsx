import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { getUser } from "../../services/user";
import { useUser } from "../../context/UserContext";

export default function ProfileImage({ post, style, navigation }) {
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  const { user } = useUser();

  const handlePress = () => {
    if (user.user_id === userDetails.user_id) {
      navigation.navigate("UserProfile");
    }

    if (user.user_id !== userDetails.user_id) {
      navigation.navigate("ProfileDetail", { userDetails });
    }
  };

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const resp = await getUser(post);
        setUserDetails(resp.body);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        // Whether successful or not, loading state should be set to false
        setIsLoading(false);
      }
    };

    getUserDetail();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="grey" />;
  }

  // Default profile image URI
  const defaultProfileImage = require("../../assets/profileNotActive.png");

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={() => handlePress()}>
        <Image
          style={[styles.image, { borderRadius: 100, top: 1 }]}
          source={
            userDetails.profileimage
              ? { uri: userDetails.profileimage }
              : require("../../assets/profileNotActive.png")
          }
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 30,
    width: 30,
    backgroundColor: "grey",
  },
});
