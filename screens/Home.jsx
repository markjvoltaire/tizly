import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Dimensions,
  Image,
  Pressable,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  deletePost,
  getFriends,
  getRandomFeed,
  getUnlockedUserPost,
  reportPostById,
} from "../services/user";

import { useScrollToTop } from "@react-navigation/native";
import AppHeader from "../components/Headers/AppHeader";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import ProfileImage from "../components/Headers/ProfileImage";
import ProfileInfo from "../components/Headers/ProfileInfo";
import PostContent from "../components/Post/PostContent";

export default function Home({ navigation }) {
  const scheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [listOfPosts, setListOfPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // 2 seconds loading time
    return () => clearTimeout(timer);
  }, []); // Reset loading state whenever text input changes

  const { user } = useUser();

  const ref = useRef(null);
  useScrollToTop(ref);

  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  const fetchUserData = async () => {
    try {
      const friendList = await getFriends();
      const feedList = await getUnlockedUserPost(friendList);

      setListOfPosts(feedList || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentDelete = (item) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Your code to delete the post from the backend goes here
              // For example, you might want to call an API endpoint to delete the post
              await deletePost(item);
              // Assuming the comment is deleted successfully, update the postList
              setListOfPosts((prevPost) =>
                prevPost.filter((postItem) => postItem.id !== item.id)
              );

              Alert.alert("Post Deleted", "Your post has been deleted.");

              // Show a success message or perform any other actions after deletion
            } catch (error) {
              console.error("Error deleting comment:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleOptionPress = (item) => {
    item.user_id === user.user_id
      ? handleCommentDelete(item)
      : reportPost(item);
  };

  const reportPost = (item) => {
    Alert.alert(
      "Report Post",
      "Are you sure you want to report this Post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Report",
          onPress: async () => {
            try {
              // Your code to report the Post goes here
              // For example, you might want to call an API endpoint to report the post
              await reportPostById(item);
              // Show a success message
              Alert.alert(
                "Report Sent",
                "Your report has been sent. Thank you for your feedback."
              );

              // Perform any other actions after reporting
            } catch (error) {
              console.error("Error reporting post:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUserData();
    };

    loadData();
  }, []);

  const renderItem = ({ item }) => {
    const moreImage = (
      <Pressable
        onPress={() => handleOptionPress(item)}
        style={{
          position: "absolute",
          left: width * 0.85,
        }}
      >
        <Image
          style={{
            height: 40,
            width: 40,
            marginRight: 10,
            bottom: height * 0.02,
          }}
          source={
            scheme === "light"
              ? require("../assets/More.png")
              : require("../assets/MoreLight.png")
          }
        />
      </Pressable>
    );

    return (
      <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          }}
        >
          {moreImage}

          <ProfileImage
            navigation={navigation}
            post={item}
            style={styles.profileImage}
          />
          <ProfileInfo navigation={navigation} post={item} />
        </View>
        <View style={{ bottom: 15 }}>
          <PostContent post={item} />
        </View>
      </>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const checkChanges = async () => {
    await fetchUserData();
  };

  useFocusEffect(
    React.useCallback(() => {
      checkChanges();
      return () => {
        null;
      };
    }, [])
  );

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: scheme === "light" ? "white" : "#111111",
          flex: 1,
        }}
      ></View>
    );
  }

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: scheme === "light" ? "#F9F9F9" : "#111111",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {listOfPosts.length === 0 ? (
          <View
            style={{
              backgroundColor: scheme === "light" ? "white" : "#111111",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color="grey" size="large" />
          </View>
        ) : (
          <ActivityIndicator color="grey" size="large" />
        )}
      </View>
    );
  }

  if (listOfPosts.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: scheme === "light" ? "white" : "#111111",
        }}
      >
        <AppHeader navigation={navigation} />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text
            style={{
              width: width * 0.9,
              alignSelf: "center",
              textAlign: "center",
              top: height * 0.2,
              fontSize: 14,
              color: scheme === "light" ? "#555" : "white",
              fontFamily: "Poppins-Bold",
            }}
          >
            It seems like your feed is currently empty 🤔. Connect with others
            to see their posts and grow your list of friends!
          </Text>

          <Pressable
            onPress={() => navigation.navigate("Explore")}
            style={{
              backgroundColor: scheme === "light" ? "black" : "white",
              width: width * 0.8,
              height: height * 0.05,
              justifyContent: "center",
              borderRadius: 10,
              top: height * 0.28,

              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: scheme === "light" ? "white" : "black",
                fontFamily: "Poppins-Bold",
                alignSelf: "center",
                fontSize: 16,
              }}
            >
              Go Explore 🔍
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: scheme === "light" ? "white" : "#111111",
      }}
    >
      <AppHeader navigation={navigation} />
      <View
        style={{
          width: width,
          alignSelf: "center",
          marginBottom: height * 0.05,
        }}
      >
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh} // Moved onRefresh to FlatList
          showsVerticalScrollIndicator={false}
          data={listOfPosts}
          ref={ref}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View
              style={{
                bottom: 5,
                height: 0.4,
                backgroundColor: scheme === "dark" ? "#262626" : "#CED0CE",
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  textContainer: {
    bottom: 8,
  },
  displayName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  username: {
    color: "gray",
  },
});
