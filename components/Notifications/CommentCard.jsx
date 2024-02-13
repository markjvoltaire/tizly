import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";

import ProfileInformation from "../ProfileDetails/ProfileInformation";
import { getUser } from "../../services/user";
import ProfileCard from "./ProfileCard";

export default function CommentCard({ item }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const scheme = useColorScheme();

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
          color: scheme === "light" ? "#464646" : "white",
          paddingBottom: screenHeight * 0.02,
          top: screenHeight * 0.01,
          fontWeight: "300",
          fontSize: 13,
        }}
      >
        💬 {userDetails.username} replied
      </Text>
      <ProfileCard userDetails={userDetails} />
      <View
        style={{
          width: screenHeight * 0.34,
          left: screenWidth * 0.02,
        }}
      >
        <Text
          style={{
            fontWeight: "500",
            color: scheme === "light" ? "black" : "white",
          }}
        >
          {item.comment}
        </Text>
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
