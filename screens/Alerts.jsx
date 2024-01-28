import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import { getNotifications } from "../services/user";
import React, { useState, useEffect, useRef } from "react";
import CommentCard from "../components/Notifications/CommentCard";
import { useScrollToTop } from "@react-navigation/native";

export default function Alerts() {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const ref = useRef(null);
  useScrollToTop(ref);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const fetchNotifications = async () => {
      const resp = await getNotifications();
      setNotifications(resp);
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
            paddingBottom: screenHeight * 0.03,
            borderBottomWidth: 1,
            borderColor: 10,
          }}
        >
          <CommentCard item={item} />
        </View>
      );
    }
  };

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
