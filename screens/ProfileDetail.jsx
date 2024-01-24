import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Banner from "../components/ProfileDetails/Banner";
import Fader from "../components/ProfileDetails/Fader";
import ProfileInformation from "../components/ProfileDetails/ProfileInformation";
import { getFriendStatus, getFriends } from "../services/user";
import { supabase } from "../services/supabase";

import BannerButtons from "../components/ProfileDetails/BannerButtons";
import UnlockedFeed from "../components/ProfileDetails/UnlockedFeed";
import LockedFeed from "../components/ProfileDetails/LockedFeed";

export default function ProfileDetail({ route, navigation }) {
  const userDetails = route.params.userDetails;
  const [friendStatus, setFriendStatus] = useState("notFriends");
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  async function fetchFriendStatus() {
    try {
      const userId = supabase.auth.currentUser.id;
      const userSentRequest = await supabase
        .from("friendRequests")
        .select("status")
        .eq("senderId", userId)
        .eq("receiverId", userDetails.user_id);

      const userReceivedRequest = await supabase
        .from("friendRequests")
        .select("status")
        .eq("senderId", userDetails.user_id)
        .eq("receiverId", userId);

      if (userSentRequest.body.length === 1) {
        if (userSentRequest.body[0].status === "friends") {
          setFriendStatus("friends");
        } else if (userSentRequest.body[0].status === "pending") {
          setFriendStatus("pending");
        }
      }

      if (userReceivedRequest.body.length === 1) {
        if (userReceivedRequest.body[0].status === "friends") {
          setFriendStatus("friends");
        } else if (userReceivedRequest.body[0].status === "pending") {
          setFriendStatus("awaitingResponse");
        }
      }

      if (
        userReceivedRequest.body.length === 0 &&
        userSentRequest.body.length === 0
      ) {
        setFriendStatus("notFriends");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  }

  useEffect(() => {
    fetchFriendStatus();
  }, [userDetails]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        ListHeaderComponent={
          <>
            <Banner userDetails={userDetails} />
            <Fader />
            <ProfileInformation userDetails={userDetails} />
            <View
              style={{
                position: "absolute",
                top: screenHeight * 0.82,
                left: screenWidth * 0.02,
              }}
            >
              <BannerButtons friendStatus={friendStatus} />
            </View>
          </>
        }
        data={[userDetails]} // Pass an array with one element as the data for the header
        keyExtractor={(item) => item.user_id.toString()} // Adjust with your item ID
        renderItem={() => null} // Render an empty item for the header
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          friendStatus === "friends" ? (
            <View style={{ bottom: screenHeight * 0.05 }}>
              <UnlockedFeed navigation={navigation} userDetails={userDetails} />
            </View>
          ) : (
            <LockedFeed userDetails={userDetails} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
