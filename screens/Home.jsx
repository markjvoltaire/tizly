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
import PostHeader from "../components/Headers/PostHeader";
import { useScrollToTop } from "@react-navigation/native";
import PhotoPost from "../components/PostTypes/PhotoPost";
import VideoPost from "../components/PostTypes/VideoPost";
import StatusPost from "../components/PostTypes/StatusPost";
import AppHeader from "../components/Headers/AppHeader";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import ExploreCard from "../components/explore/ExploreCard";
import Push from "../components/Push";

export default function Home({ navigation }) {
  const scheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [listOfPosts, setListOfPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [randomUsers, setRandomUsers] = useState([]);

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
    const postHeader = <PostHeader navigation={navigation} post={item} />;
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
            bottom: height * 0.01,
          }}
          source={
            scheme === "light"
              ? require("../assets/More.png")
              : require("../assets/MoreLight.png")
          }
        />
      </Pressable>
    );

    let postContent;
    if (item.mediaType === "image") {
      postContent = <PhotoPost post={item} />;
    } else if (item.mediaType === "video") {
      postContent = <VideoPost post={item} />;
    } else {
      postContent = <StatusPost post={item} />;
    }

    return (
      <View
        style={{
          alignSelf: "center",
          marginBottom: 10,
          paddingBottom: 28,
          borderBottomWidth: 1,
          borderColor: scheme === "light" ? "10 " : "#383838",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {postHeader}
          {moreImage}
        </View>
        <View style={{ top: 10 }}>{postContent}</View>
      </View>
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

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: scheme === "light" ? "white" : "#080A0B",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {listOfPosts.length === 0 ? (
          <View
            style={{
              backgroundColor: scheme === "light" ? "white" : "#080A0B",
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
          backgroundColor: scheme === "light" ? "white" : "#080A0B",
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
              textAlign: "center",
              top: height * 0.2,
              fontSize: 14,
              color: "#555",
              fontFamily: "Poppins-Bold",
            }}
          >
            Your feed is empty. become friends with others to see their posts!
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: scheme === "light" ? "white" : "#080A0B",
      }}
    >
      <AppHeader navigation={navigation} />
      <View
        style={{
          width: width,
          alignSelf: "center",
          marginBottom: height * 0.02,
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
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
