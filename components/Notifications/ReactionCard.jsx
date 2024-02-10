import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";

import NotificationHeader from "./NotificationHeader";
import ProfileInformation from "../ProfileDetails/ProfileInformation";
import { getUser } from "../../services/user";
import ProfileCard from "./ProfileCard";

export default function ReactionCard({ item }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const prop = {
    user_id: item.userId,
  };

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const resp = await getUser(prop);

        setUserDetails(resp.body);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    getUserDetail();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  return (
    <View>
      <Text
        style={{
          left: screenWidth * 0.02,
          color: "#464646",
          fontWeight: "500",
          paddingBottom: screenHeight * 0.02,
          top: screenHeight * 0.01,
        }}
      >
        🎉 {userDetails.username} reacted
      </Text>
      <ProfileCard userDetails={userDetails} />
      <View
        style={{
          width: screenHeight * 0.34,
          left: screenWidth * 0.02,
        }}
      >
        <Text style={{ fontSize: 80 }}>{item.reactionType}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: 15,
  },
});
