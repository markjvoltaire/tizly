import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { getUser } from "../../services/user";
import ProfileCard from "../notifications/ProfileCard";

export default function BlockProfile({ item }) {
  const scheme = useColorScheme();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state

  const userInfo = {
    user_id: item.creatorId,
  };

  useEffect(() => {
    const getProfiles = async () => {
      try {
        const res = await getUser(userInfo);

        setUserDetails(res.body);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };
    getProfiles();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  return (
    <View>
      <ProfileCard userDetails={userDetails} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: 40,
  },
});
