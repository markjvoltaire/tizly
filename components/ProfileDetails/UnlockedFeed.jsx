import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import PostHeader from "../Headers/PostHeader";
import PhotoPost from "../PostTypes/PhotoPost";
import VideoPost from "../PostTypes/VideoPost";
import StatusPost from "../PostTypes/StatusPost";
import NoPosts from "./NoPosts";
import { Image } from "react-native";
import { useUser } from "../../context/UserContext";
import { deletePost, reportPostById } from "../../services/user";

export default function UnlockedFeed({
  userDetails,
  navigation,
  posts,
  setPosts,
}) {
  const { user } = useUser();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Check if the posts array is empty
  if (posts.length === 0) {
    return (
      <View style={{ top: screenHeight * 0.02 }}>
        <NoPosts userDetails={userDetails} />
      </View>
    );
  }

  const handleOptionPress = (item) => {
    item.user_id === user.user_id
      ? handleCommentDelete(item)
      : reportPost(item);
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
              setPosts((prevPost) =>
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

  const renderItem = ({ item }) => {
    const postHeader = <PostHeader navigation={navigation} post={item} />;
    const moreImage = (
      <Pressable
        onPress={() => handleOptionPress(item)}
        style={{
          position: "absolute",
          left: screenWidth * 0.85,
          top: screenHeight * 0.003,
        }}
      >
        <Image
          style={{
            height: 40,
            width: 40,
            marginRight: 10,
            bottom: screenHeight * 0.01,
          }}
          source={require("../../assets/More.png")}
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
          paddingBottom: screenHeight * 0.04,
          borderBottomWidth: 2,
          borderColor: 10,
          alignSelf: "center",
        }}
      >
        {postHeader}
        {moreImage}
        {postContent}
      </View>
    );
  };

  return (
    <View style={{ bottom: screenHeight * 0.01 }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Adjust with your item ID
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
