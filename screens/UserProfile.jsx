import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Banner from "../components/ProfileDetails/Banner";
import { useFocusEffect } from "@react-navigation/native";
import Fader from "../components/ProfileDetails/Fader";
import ProfileInformation from "../components/ProfileDetails/ProfileInformation";
import UnlockedFeed from "../components/ProfileDetails/UnlockedFeed";
import UserProfileButtons from "../components/ProfileDetails/UserProfileButtons";
import { useScrollToTop } from "@react-navigation/native";
import { getPosts } from "../services/user";

export default function UserProfile({ navigation }) {
  const { user } = useUser();

  const [scrollPosition, setScrollPosition] = useState(0);
  const flatListRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useScrollToTop(flatListRef);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollPosition(offsetY);
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const resp = await getPosts(user.user_id);
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
        const resp = await getPosts(user.user_id);
        setPosts(resp);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllPost();
  }, []);

  const checkChanges = async () => {
    const resp = await getPosts(user.user_id);
    setPosts(resp);
  };

  useFocusEffect(
    React.useCallback(() => {
      setFocused(true);
      checkChanges();
      return () => {
        setFocused(false);
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <FlatList
        ref={flatListRef}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <>
            <Banner
              scrollPosition={scrollPosition}
              userDetails={user}
              focused={focused}
            />
            <Fader />
            <ProfileInformation navigation={navigation} userDetails={user} />
            <View
              style={{ bottom: screenHeight * 0.15, left: screenWidth * 0.02 }}
            >
              <UserProfileButtons user={user} navigation={navigation} />
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{ bottom: screenHeight * 0.07 }}>
            <UnlockedFeed
              setPosts={setPosts}
              posts={posts}
              userDetails={user}
              navigation={navigation}
            />
          </View>
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
