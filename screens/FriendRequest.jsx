import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { supabase } from "../services/supabase";
import { Dimensions } from "react-native";
import RequestCard from "../components/notifications/RequestCard";

export default function FriendRequest() {
  const scheme = useColorScheme();
  const [loading, setLoading] = useState(true); // State for loading status
  const [refreshing, setRefreshing] = useState(false); // State for refreshing status
  const [friendRequests, setFriendRequests] = useState([]);
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  async function getNotifications() {
    const userId = supabase.auth.currentUser.id;

    // Fetch friend requests
    const { body: friendRequests } = await supabase
      .from("friendRequests")
      .select("*")
      .eq("receiverId", userId)
      .eq("status", "pending");

    return friendRequests;
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const resp = await getNotifications();
      console.log("REFRESHING");
      setFriendRequests(resp);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    const getList = async () => {
      try {
        const resp = await getNotifications();
        setFriendRequests(resp);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setLoading(false);
      }
    };
    getList();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: scheme === "light" ? "white" : "#080A0B",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={scheme === "light" ? "black" : "white"}
        />
      </SafeAreaView>
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
        Friend Requests
      </Text>
      {friendRequests.length === 0 ? (
        <Text
          style={{
            alignSelf: "center",
            textAlign: "center",
            top: height * 0.2,
            fontSize: 14,
            color: scheme === "light" ? "#555" : "white",
            fontFamily: "Poppins-Bold",
          }}
        >
          Your list of friend requests is currently empty. 🤔
        </Text>
      ) : (
        <FlatList
          data={friendRequests}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row", // Set flexDirection to 'row'
                paddingBottom: height * 0.03,
                paddingTop: height * 0.01,
                borderBottomWidth: 0.2,
                borderColor: scheme === "light" ? 10 : "#383838",
              }}
            >
              <RequestCard item={item} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[scheme === "light" ? "black" : "white"]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
