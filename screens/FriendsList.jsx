import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { supabase } from "../services/supabase";
import ProfileCard from "../components/notifications/ProfileCard";

export default function FriendsList() {
  const scheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllFriends() {
      try {
        const resp = await getFriends();

        setFriendsList(resp);
        const res = await getUsers(resp); // Pass resp directly here

        setUserList(res);
      } catch (error) {
        console.error("Error fetching friends:", error.message);
      } finally {
        setLoading(false);
      }
    }
    getAllFriends();
  }, []);

  async function getFriends() {
    const userId = supabase.auth.currentUser.id;
    const { data: friends1, error: error1 } = await supabase
      .from("friendRequests")
      .select("receiverId, senderId")
      .eq("status", "friends")
      .eq("receiverId", userId);

    const { data: friends2, error: error2 } = await supabase
      .from("friendRequests")
      .select("receiverId, senderId")
      .eq("status", "friends")
      .eq("senderId", userId);

    if (error1 || error2) {
      throw new Error("Failed to fetch friends.");
    }

    const postList = [...friends1, ...friends2];

    const filteredValues = postList
      .flatMap((item) => Object.values(item))
      .filter((id) => id !== userId);

    return filteredValues;
  }

  async function getUsers(friendsList) {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", friendsList);

    return resp.body;
  }

  const handleRefresh = async () => {
    if (!isRefreshing) {
      setIsRefreshing(true);

      try {
        const resp = await getFriends();
        setFriendsList(resp);
        const res = await getUsers(resp);
        setUserList(res);
      } catch (error) {
        // Handle any potential errors here
        console.error("Error refreshing data:", error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <ProfileCard userDetails={item} />
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: scheme === "light" ? "white" : "#080A0B",
          flex: 1,
          justifyContent: "center",
          alignItems: "center", // Center align items horizontally
        }}
      >
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: scheme === "light" ? "white" : "#080A0B",
        flex: 1,
      }}
    >
      <Text
        style={{
          color: scheme === "dark" ? "white" : "black",
          fontFamily: "Poppins-Black",
          fontSize: 22,
          marginBottom: 10,
          left: 15,
        }}
      >
        {friendsList.length} Friends
      </Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        data={userList}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        keyExtractor={(item, index) => index.toString()} // Updated keyExtractor to use index
      />
    </SafeAreaView>
  );
}
