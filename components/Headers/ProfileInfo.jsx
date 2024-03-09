import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getUser } from "../../services/user";
import { useUser } from "../../context/UserContext";

export default function ProfileInfo({ post, navigation }) {
  const scheme = useColorScheme();

  const [userDetails, setUserDetails] = useState(null);
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
    return (
      <View style={{ bottom: 10 }}>
        <ActivityIndicator size="small" color="grey" />
      </View>
    );
  }
  return (
    <Pressable onPress={() => handlePress()}>
      <View>
        <Text
          style={{
            color: scheme === "dark" ? "white" : "black",
            fontFamily: "Poppins-Bold",
            fontSize: 13,
            paddingRight: 10,
            bottom: 10,
            right: 2,
          }}
        >
          {userDetails.displayName}
        </Text>
        <Text
          style={{
            color: "#9F9F9F",
            fontWeight: "500",
            fontSize: 12,
            bottom: 10,
            right: 2,
          }}
        >
          @{userDetails.username}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
