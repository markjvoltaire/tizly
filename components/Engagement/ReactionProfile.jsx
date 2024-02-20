import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { getUser } from "../../services/user";
import ProfileCard from "../notifications/ProfileCard";

export default function ReactionProfile({ item }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const scheme = useColorScheme();

  const userInfo = {
    user_id: item.userId,
  };

  useEffect(() => {
    const getProfiles = async () => {
      try {
        const res = await getUser(userInfo);
        setUserDetails(res.body);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };
    getProfiles();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ paddingBottom: 30, flexDirection: "row" }}>
      <ProfileCard userDetails={userDetails} />
      <Text
        style={{
          color: scheme === "dark" ? "white" : "black",
          fontSize: 30,
          top: 5,
          left: 10,
        }}
      >
        {item.reactionType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: 40,
    paddingBottom: 20,
  },
});
