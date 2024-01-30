import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Banner from "../components/ProfileDetails/Banner";
import Fader from "../components/ProfileDetails/Fader";
import ProfileInformation from "../components/ProfileDetails/ProfileInformation";
import { supabase } from "../services/supabase";
import UnlockedFeed from "../components/ProfileDetails/UnlockedFeed";
import LockedFeed from "../components/ProfileDetails/LockedFeed";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileDetail({ route, navigation }) {
  const userDetails = route.params.userDetails;
  const [friendStatus, setFriendStatus] = useState("notFriends");
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState(false);

  const flatListRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Create animated opacity values for the buttons
  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation for the first button
    Animated.timing(opacity1, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();

    // Fade in animation for the second button with a delay
    Animated.timing(opacity2, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, []);

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

      const userInformation = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userDetails.user_id);

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

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollPosition(offsetY);
  };

  useFocusEffect(
    React.useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <FlatList
          ref={flatListRef}
          onScroll={handleScroll}
          ListHeaderComponent={
            <>
              <Banner
                scrollPosition={scrollPosition}
                userDetails={userDetails}
                focused={focused}
              />
              <Fader />
              <ProfileInformation userDetails={userDetails} />
              <View
                style={{
                  position: "absolute",
                  top: screenHeight * 0.82,
                  left: screenWidth * 0.02,
                }}
              >
                {/* Banner Buttons */}
                <View style={{ flexDirection: "row" }}>
                  <Animated.View
                    style={{
                      opacity: opacity1,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor:
                          friendStatus === "friends" ? "white" : null,
                        backgroundColor:
                          friendStatus === "friends" ? null : "white",
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
                          color: friendStatus === "friends" ? "white" : null,
                          paddingTop: screenHeight * 0.005,
                        }}
                      >
                        {friendStatus === "friends"
                          ? "following"
                          : friendStatus === "notFriends"
                          ? "Follow"
                          : "pending"}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                  <Animated.View
                    style={{
                      opacity: opacity2,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: "white",
                        width: screenWidth * 0.09,
                        height: screenHeight * 0.036,
                        padding: 1,
                        aspectRatio: 1,
                        borderRadius: 100,
                        backgroundColor: "white",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        style={{ height: 30, width: 30, alignSelf: "center" }}
                        source={require("../assets/More.png")}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </View>
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
                <UnlockedFeed
                  navigation={navigation}
                  userDetails={userDetails}
                />
              </View>
            ) : (
              <LockedFeed userDetails={userDetails} />
            )
          }
        />
      </View>
    </>
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
