import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { getNotifications } from "../services/user";
import React, { useState, useEffect, useRef } from "react";
import CommentCard from "../components/notifications/CommentCard";
import { useScrollToTop } from "@react-navigation/native";
import PostPreview from "../components/notifications/PostPreview";
import ReactionCard from "../components/notifications/ReactionCard";
import RequestCard from "../components/notifications/RequestCard";

export default function Alerts() {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  useScrollToTop(ref);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const fetchNotifications = async () => {
      const resp = await getNotifications();

      setNotifications(resp);

      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const resp = await getNotifications();
      setNotifications(resp);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    if (item.eventType === "comment") {
      return (
        <View
          style={{
            flexDirection: "row", // Set flexDirection to 'row'
            paddingBottom: screenHeight * 0.01,
            borderBottomWidth: 0.2,
            borderColor: "#CCCCCC", // Replace with a valid color value
          }}
        >
          <CommentCard item={item} />
          <PostPreview item={item} />
        </View>
      );
    }

    if (item.eventType === "friendRequest") {
      return (
        <View
          style={{
            flexDirection: "row", // Set flexDirection to 'row'
            paddingBottom: screenHeight * 0.01,
            borderBottomWidth: 0.2,
            borderColor: "#CCCCCC", // Replace with a valid color value
          }}
        >
          <RequestCard item={item} />
        </View>
      );
    }

    if (item.eventType === "reaction") {
      return (
        <View
          style={{
            flexDirection: "row", // Set flexDirection to 'row'
            paddingBottom: screenHeight * 0.01,
            borderBottomWidth: 0.2,
            borderColor: "#CCCCCC", // Replace with a valid color value
          }}
        >
          <ReactionCard item={item} />
          <PostPreview item={item} />
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View
        style={{ justifyContent: "center", flex: 1, backgroundColor: "white" }}
      >
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Text
        style={{
          fontFamily: "Poppins-Black",
          fontSize: 20,
          left: 5,
          paddingBottom: screenHeight * 0.02,
        }}
      >
        Notifications
      </Text>
      <FlatList
        ref={ref}
        showsVerticalScrollIndicator={false}
        data={notifications}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
