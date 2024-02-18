import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getUser } from "../../services/user";
import ProfileCard from "../notifications/ProfileCard";

export default function ReactionProfile(item) {
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    const getUserInfo = async () => {
      const post = {
        user_id: item.item.userId,
      };

      const resp = await getUser(post);
      setUserDetails(resp.body);
      setLoading(false);
    };
    getUserInfo();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <ProfileCard userDetails={userDetails} />
    </View>
  );
}

const styles = StyleSheet.create({});
