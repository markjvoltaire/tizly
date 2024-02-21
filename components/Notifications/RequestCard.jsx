import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";

import NotificationHeader from "./NotificationHeader";
import ProfileInformation from "../ProfileDetails/ProfileInformation";

import ProfileCard from "./ProfileCard";
import { supabase } from "../../services/supabase";
import { useUser } from "../../context/UserContext";

export default function RequestCard({ item }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const scheme = useColorScheme();
  // Assuming you've initialized Supabase somewhere in your code
  // const supabase = createClient(...);

  async function getUser(item) {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", item.senderId)
      .single();

    return resp;
  }

  const fetchUserDetails = async () => {
    try {
      const resp = await getUser(item);

      setUserDetails(resp.data); // Assuming the user details are in 'data' property
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  // Example usage:
  // const item = { user_id: 'some_user_id' };
  // fetchUserDetails(item);

  async function deleteFriend() {
    await supabase
      .from("friendRequests")
      .delete()
      .eq("receiverId", user.user_id)
      .eq("senderId", userDetails.user_id);

    await supabase
      .from("friendRequests")
      .delete()
      .eq("senderId", user.user_id)
      .eq("receiverId", userDetails.user_id);

    setUserDetails(null);
  }

  async function acceptFriendRequest() {
    const res = await supabase
      .from("friendRequests")
      .update({
        status: "friends",
      })
      .eq("senderId", userDetails.user_id)
      .eq("receiverId", user.user_id);
    setUserDetails(null);

    return res;
  }

  const createThreeButtonAlert = () =>
    Alert.alert("View Request", "How would you like to handle this request", [
      {
        text: "Accept Request",
        onPress: () => acceptFriendRequest(),
      },
      {
        style: "destructive",
        text: "Decline Request",
        onPress: () => deleteFriend(),
      },
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
    ]);

  async function friendButton() {
    createThreeButtonAlert();
  }

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  if (userDetails === null) {
    console.log("item", item);
    console.log("userDetails", userDetails);
    return null;
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: scheme === "light" ? "#464646" : "white",
          fontWeight: "500",
          fontSize: 13,
          paddingBottom: Dimensions.get("window").height * 0.01,
        }}
      >
        {userDetails === null
          ? null
          : `👥 ${userDetails.username} sent a friend request`}
      </Text>
      {userDetails === null ? null : <ProfileCard userDetails={userDetails} />}

      <TouchableOpacity
        onPress={() => friendButton()}
        style={{
          backgroundColor: "#587DFF",
          width: screenWidth * 0.3,
          height: screenHeight * 0.036,
          padding: 1,
          marginRight: 20,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            alignSelf: "center",
            color: "white",
            paddingTop: screenHeight * 0.006,
          }}
        >
          view request
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Dimensions.get("window").width * 0.02,
  },
  text: {
    color: "#464646",
    fontWeight: "300",
    fontSize: 13,
    paddingBottom: Dimensions.get("window").height * 0.01,
  },
  reactionContainer: {
    width: Dimensions.get("window").height * 0.34,
    paddingHorizontal: Dimensions.get("window").width * 0.01,
  },
  reactionText: {
    fontSize: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
});
