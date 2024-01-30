import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { getPosts } from "../../services/user";
import PostHeader from "../Headers/PostHeader";
import PhotoPost from "../PostTypes/PhotoPost";
import VideoPost from "../PostTypes/VideoPost";
import StatusPost from "../PostTypes/StatusPost";
import NoPosts from "./NoPosts";
import { useScrollToTop } from "@react-navigation/native";

export default function UnlockedFeed({ userDetails, navigation }) {
  const userid = userDetails.user_id;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const getAllPost = async () => {
      try {
        const resp = await getPosts(userid);

        setPosts(resp);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllPost();
  }, [userid]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  // Check if the posts array is empty
  if (posts.length === 0) {
    return (
      <View style={{ top: screenHeight * 0.02 }}>
        <NoPosts userDetails={userDetails} />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const postHeader = <PostHeader navigation={navigation} post={item} />;

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
          paddingBottom: screenHeight * 0.06,
          borderBottomWidth: 2,
          borderColor: 10,
          alignSelf: "center",
        }}
      >
        {postHeader}
        {postContent}
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()} // Adjust with your item ID
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
