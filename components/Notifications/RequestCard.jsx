import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";

import NotificationHeader from "./NotificationHeader";
import ProfileInformation from "../ProfileDetails/ProfileInformation";
import { getUser } from "../../services/user";
import ProfileCard from "./ProfileCard";
import { supabase } from "../../services/supabase";
import { useUser } from "../../context/UserContext";

export default function RequestCard({ item }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchUserDetails = async () => {
    try {
      const resp = await getUser({ user_id: item.userId });

      setUserDetails(resp.body);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

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
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {userDetails === null
          ? null
          : `👥 ${userDetails.username} sent a friend request`}
      </Text>
      {userDetails === null ? null : <ProfileCard userDetails={userDetails} />}
      <View style={styles.reactionContainer}></View>
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
