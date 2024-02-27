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
  Pressable,
  SafeAreaView,
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
import {
  notifyUserAboutNewFriend,
  notifyUserAboutNewRequest,
} from "../services/notification";

export default function ProfileDetail({ route, navigation }) {
  const { user } = useUser();
  const userDetails = route.params.userDetails;
  const tokenCode = userDetails.expo_push_token;
  const userToken = user.expo_push_token;
  const [refreshing, setRefreshing] = useState(false);
  const [friendStatus, setFriendStatus] = useState(null);
  const [subscriptions, setSubscriptions] = useState();
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState(false);
  const [posts, setPosts] = useState([]);
  const scheme = useColorScheme();
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [hasUserBlockProfile, setHasUserBlockProfile] = useState(false);

  async function blockUserCheck() {
    const userId = supabase.auth.currentUser.id;

    const resp = await supabase
      .from("blocks")
      .select("*")
      .eq("creatorId", userId)
      .eq("userId", userDetails.user_id);

    return resp;
  }

  async function didUserBlockProfile() {
    const userId = supabase.auth.currentUser.id;

    const resp = await supabase
      .from("blocks")
      .select("*")
      .eq("creatorId", userDetails.user_id)
      .eq("userId", userId);

    return resp;
  }

  async function blockUser() {
    const resp = await supabase.from("blocks").insert([
      {
        // UserID Blocks CreatorId //
        creatorId: userDetails.user_id,
        userId: user.user_id,
      },
    ]);

    navigation.goBack();
    Alert.alert(`${userDetails.username} Has Been Blocked`, " ", [
      { text: "OK", onPress: () => null },
    ]);

    return resp;
  }

  async function unblockUser() {
    const { data, error } = await supabase
      .from("blocks")
      .delete()
      .eq("userId", user.user_id)
      .eq("creatorId", userDetails.user_id);

    if (!error) {
      setHasUserBlockProfile(false);
    }

    console.log("data", data);
    console.log("error", error);

    return data;
  }

  const handleUnblock = () =>
    Alert.alert(`do you want to unblock ${userDetails.username} ?`, " ", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "yes", onPress: () => unblockUser() },
    ]);

  const createTwoButtonAlert = () =>
    Alert.alert(`Do You Want To Block ${userDetails.username} ?`, " ", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "OK", onPress: () => blockUser() },
    ]);

  async function handleBlock() {
    createTwoButtonAlert();
  }

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
    await notifyUserAboutNewRequest(user, tokenCode);

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

    await notifyUserAboutNewFriend(user, tokenCode);

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
        const res = await blockUserCheck();

        if (res.body.length === 0) {
          setIsUserBlocked(false);
        } else {
          setIsUserBlocked(res.body[0].blocked);
        }

        const response = await didUserBlockProfile();

        if (response.body.length === 0) {
          setHasUserBlockProfile(false);
        } else {
          setHasUserBlockProfile(response.body[0].blocked);
        }
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
    const customerInfo = await Purchases.getCustomerInfo();

    try {
      const resp = await Purchases.purchaseProduct(
        subscriptions,
        null,
        Purchases.PURCHASE_TYPE.INAPP
      );

      const res = await supabase.from("subscriptions").insert([
        {
          userId: supabase.auth.currentUser.id,
          creatorId: userDetails.user_id,
          creatorProfileImage: userDetails.profileimage,
          userProfileImage: user.profileimage,
          creatorUsername: userDetails.username,
          userUsername: user.username,
          creatorDisplayname: userDetails.displayName,
          userDisplayname: user.displayName,
          subscriptionName: subscriptions,
          subscriptionId: customerInfo.originalAppUserId,
        },
      ]);

      console.log("res", res);

      return res && resp;
    } catch (error) {
      if (error.userCancelled) {
        return null;
      } else {
        console.log("error", error);
        Alert.alert("Something Went Wrong, Try Again");
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

  useEffect(() => {
    const main = async () => {
      const userId = supabase.auth.currentUser.id;
      Purchases.setDebugLogsEnabled(true);

      await Purchases.configure({
        apiKey: "appl_tIhSBcbpwTRUbYlfVvyNQXVJuzb",
        appUserID: userId,
      });

      const prods = await Purchases.getProducts(listOfProducts);

      const customerInfo = await Purchases.getCustomerInfo();

      const currentSubscription = customerInfo.activeSubscriptions;

      async function findProduct() {
        const box = {
          allProducts: prods.map((i) => i.identifier),
          userSubs: currentSubscription,
        };

        const intersection = box.allProducts.filter(
          (element) => !box.userSubs.includes(element)
        );

        let availableSubscription =
          intersection[Math.floor(Math.random() * intersection.length)];

        setSubscriptions(availableSubscription);
      }

      findProduct();
    };
    main();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (hasUserBlockProfile === true) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: scheme === "light" ? "white" : "#080A0B",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: scheme === "dark" ? "white" : "black",
            alignSelf: "center",
            fontFamily: "Poppins-Bold",
          }}
        >
          {userDetails.username} is blocked
        </Text>
        <Pressable
          onPress={() => handleUnblock()}
          style={{
            backgroundColor: scheme === "light" ? "black" : "white",
            width: screenWidth * 0.4,
            height: screenHeight * 0.035,
            justifyContent: "center",
            borderRadius: 10,
            top: screenHeight * 0.05,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color: scheme === "light" ? "white" : "black",
              fontFamily: "Poppins-Bold",
              alignSelf: "center",
              fontSize: 12,
            }}
          >
            Unblock
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (isUserBlocked === true) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: scheme === "light" ? "white" : "#080A0B",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: scheme === "dark" ? "white" : "black",
            alignSelf: "center",
            fontFamily: "Poppins-Bold",
          }}
        >
          {userDetails.username} blocked you
        </Text>
      </SafeAreaView>
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
                      onPress={() => handleBlock()}
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
