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
  Alert,
  Modal,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Banner from "../components/ProfileDetails/Banner";
import Fader from "../components/ProfileDetails/Fader";
import ProfileInformation from "../components/ProfileDetails/ProfileInformation";
import { supabase } from "../services/supabase";
import UnlockedFeed from "../components/ProfileDetails/UnlockedFeed";
import LockedFeed from "../components/ProfileDetails/LockedFeed";
import { useFocusEffect } from "@react-navigation/native";
import { getPosts } from "../services/user";
import { useUser } from "../context/UserContext";
import Purchases from "react-native-purchases";
import LottieView from "lottie-react-native";

export default function ProfileDetail({ route, navigation }) {
  const userDetails = route.params.userDetails;
  const [refreshing, setRefreshing] = useState(false);
  const [friendStatus, setFriendStatus] = useState(null);
  const [subscriptions, setSubscriptions] = useState();
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState(false);
  const [posts, setPosts] = useState([]);
  const scheme = useColorScheme();
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { user } = useUser();

  const listOfProducts = [
    "Tizly001",
    "Tizly002",
    "Tizly003",
    "Tizly004",
    "Tizly005",
    "Tizly006",
    "Tizly007",
    "Tizly008",
    "Tizly009",
    "Tizly010",
  ];

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

  async function unFriendUser() {
    Alert.alert(`Do You Want To Unfriend @${userDetails.username}`, " ", [
      {
        text: "Remove",
        onPress: () => deleteFriend(),
        style: "destructive",
      },
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
    ]);
  }

  async function cancelPendingRequest() {
    Alert.alert(`Do You Want To Unsend Your Friend Request`, " ", [
      {
        text: "Unsend",
        onPress: () => unSendRequest(),
        style: "destructive",
      },
      {
        text: "Not Yet",
        onPress: () => null,
        style: "cancel",
      },
    ]);
  }

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

    setFriendStatus("notFriends");
  }

  async function sendFriendRequest() {
    const resp = await supabase.from("friendRequests").insert([
      {
        senderId: user.user_id,
        senderUsername: user.username,
        senderDisplayName: user.displayName,
        receiverDisplayName: userDetails.displayName,
        receiverUsername: userDetails.username,
        receiverId: userDetails.user_id,
        status: "pending",
      },
    ]);

    const newReaction = {
      comment: null,
      creatorId: userDetails.user_id,
      userId: user.user_id,
      userProfileImage: user.profileimage,
      postId: null,
      userUsername: user.username,
      creatorUsername: userDetails.username,
      creatorDisplayname: userDetails.displayName,
      userDisplayname: user.displayName,
      creatorProfileImage: userDetails.profileimage,
      media: null,
      mediaType: null,
      eventType: "friendRequest",
      description: null,
      liked: false,
      reactionType: null,
    };
    const res = await supabase.from("notifications").insert([newReaction]);
    setFriendStatus("pending");

    return resp && res;
  }

  async function unSendRequest() {
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

    const deleteNoti = await supabase
      .from("notifications")
      .delete()
      .eq("creatorId", userDetails.user_id)
      .eq("userId", user.user_id)
      .eq("eventType", "friendRequest");

    setFriendStatus("notFriends");

    return deleteNoti;
  }

  async function acceptFriendRequest() {
    const res = await supabase
      .from("friendRequests")
      .update({
        status: "friends",
      })
      .eq("senderId", userDetails.user_id)
      .eq("receiverId", user.user_id);
    setFriendStatus("friends");

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
    if (userDetails.type === "business") {
      subscribeToUser();
      return;
    }

    if (friendStatus === "notFriends") {
      sendFriendRequest();
    }

    if (friendStatus === "friends") {
      unFriendUser();
    }

    if (friendStatus === "pending") {
      cancelPendingRequest();
    }

    if (friendStatus === "awaitingResponse") {
      createThreeButtonAlert();
    }
  }

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

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const resp = await getPosts(userDetails.user_id);
      setPosts(resp);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const getAllPost = async () => {
      try {
        const resp = await getPosts(userDetails.user_id);
        setPosts(resp);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriendStatus();
    getAllPost();
  }, [userDetails]);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollPosition(offsetY);
  };

  const checkChanges = async () => {
    const resp = await getPosts(userDetails.user_id);
    setPosts(resp);
  };

  async function subscribeToUser() {
    setPurchaseLoading(true);
    const customerInfo = await Purchases.getCustomerInfo();

    try {
      const resp = await Purchases.getProducts(
        customerInfo,
        subscriptions,
        null
      );

      console.log("resp", resp);
      setPurchaseLoading(false);
      // return res && resp;
    } catch (error) {
      if (error.userCancelled) {
        setPurchaseLoading(false);
        return null;
      } else {
        // setSubLoading("idle");
        // setModalVisible(false);
        setPurchaseLoading(false);
        Alert.alert("Something Went Wrong, Try Again");
        console.log("error", error);
      }
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      setFocused(true);
      checkChanges();
      return () => {
        setFocused(false);
      };
    }, [])
  );

  // useEffect(() => {
  //   const main = async () => {
  //     const userId = supabase.auth.currentUser.id;
  //     Purchases.setDebugLogsEnabled(true);

  //     await Purchases.configure({
  //       apiKey: "appl_YzNJKcRtIKShkjSciXgXIqfSDqc",
  //       appUserID: userId,
  //     });

  //     const prods = await Purchases.getProducts(listOfProducts);

  //     const customerInfo = await Purchases.getCustomerInfo();

  //     const currentSubscription = customerInfo.activeSubscriptions;

  //     async function findProduct() {
  //       const box = {
  //         allProducts: prods.map((i) => i.identifier),
  //         userSubs: currentSubscription,
  //       };

  //       const intersection = box.allProducts.filter(
  //         (element) => !box.userSubs.includes(element)
  //       );

  //       let availableSubscription =
  //         intersection[Math.floor(Math.random() * intersection.length)];

  //       console.log("availableSubscription", availableSubscription);

  //       setSubscriptions(availableSubscription);
  //       console.log("availableSubscription", availableSubscription);
  //     }

  //     findProduct();
  //   };
  //   main();
  // }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: scheme === "light" ? "white" : "#080A0B",
        }}
      >
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
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
                {/* If friendStatus is null show nothing */}

                <View style={{ flexDirection: "row" }}>
                  <Animated.View
                    style={{
                      opacity: opacity1,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => friendButton()}
                      style={{
                        backgroundColor:
                          friendStatus === "friends" ? null : "white",
                        width: screenWidth * 0.3,
                        height: screenHeight * 0.036,
                        padding: 1,
                        marginRight: 20,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor:
                          friendStatus === "friends" ? "white" : null,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          alignSelf: "center",
                          color: friendStatus === "friends" ? "white" : null,
                          paddingTop: screenHeight * 0.006,
                        }}
                      >
                        {userDetails.type === "business"
                          ? "Subscribe"
                          : friendStatus === "friends"
                          ? "Friends"
                          : friendStatus === "notFriends"
                          ? "Add Friend"
                          : friendStatus === "awaitingResponse"
                          ? "view request"
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
              <View style={{ bottom: screenHeight * 0.04 }}>
                <UnlockedFeed
                  posts={posts}
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
      <Modal animationType="slide" visible={purchaseLoading}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#45A6FF",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              color: "white",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            Loading Your Subscription
          </Text>

          <LottieView
            style={{
              height: 50,
              width: 50,
            }}
            source={require("../assets/lottie/whiteLoader.json")}
            autoPlay
          />
        </View>
      </Modal>
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
