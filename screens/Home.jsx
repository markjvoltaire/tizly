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
} from "react-native";
import { getFriends, getUnlockedUserPost } from "../services/user";
import PostHeader from "../components/Headers/PostHeader";
import { useScrollToTop } from "@react-navigation/native";
import PhotoPost from "../components/PostTypes/PhotoPost";
import VideoPost from "../components/PostTypes/VideoPost";
import StatusPost from "../components/PostTypes/StatusPost";
import AppHeader from "../components/Headers/AppHeader";
import { RefreshControl, ScrollView } from "react-native";

export default function Home({ navigation }) {
  const scheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [listOfPosts, setListOfPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUserData();
    };

    loadData();
  }, []);

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
      <View style={styles.item}>
        {postHeader}
        {postContent}
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View
        style={{ backgroundColor: "white", flex: 1, justifyContent: "center" }}
      >
        {listOfPosts.length === 0 ? (
          <Text>No posts found. Please check your internet connection.</Text>
        ) : (
          <ActivityIndicator color="grey" size="large" />
        )}
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: scheme === "light" ? "white" : "#121212",
      }}
    >
      <AppHeader />
      <View style={{ width: width, alignSelf: "center" }}>
        <FlatList
          onRefresh={() => onRefresh()} // Move onRefresh to FlatList
          refreshing={refreshing} // Add refreshing prop to FlatList
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

const styles = StyleSheet.create({
  item: {
    alignSelf: "center",
    marginBottom: 10,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderColor: 10,
  },
});
