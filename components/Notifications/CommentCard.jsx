import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

import NotificationHeader from "./NotificationHeader";

export default function CommentCard({ item }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const userDetails = {
    profileimage: item.userProfileImage,
    displayName: item.userDisplayname,
    username: item.userUsername,
    user_id: item.userId,
  };
  return (
    <View>
      <NotificationHeader item={item} userDetails={userDetails} />
    </View>
  );
}

const styles = StyleSheet.create({});
