import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Pressable,
  Alert,
  useColorScheme,
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
import ProfileImage from "../Headers/ProfileImage";
import ProfileInfo from "../Headers/ProfileInfo";
import PostContent from "../Post/PostContent";

export default function UnlockedFeed({
  userDetails,
  navigation,
  posts,
  setPosts,
}) {
  const { user } = useUser();
  const scheme = useColorScheme();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

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
              ? require("../../assets/More.png")
              : require("../../assets/MoreLight.png")
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
          <View>
            <ProfileInfo navigation={navigation} post={item} />
          </View>
        </View>
        <View style={{ bottom: 15 }}>
          <PostContent post={item} />
        </View>
      </>
    );
  };

  return (
    <View style={{ bottom: screenHeight * 0.01 }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Adjust with your item ID
        showsVerticalScrollIndicator={false}
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
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

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
