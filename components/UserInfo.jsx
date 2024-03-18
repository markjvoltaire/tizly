import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function UserInfo({ user }) {
  console.log("user", user);
  return (
    <View>
      <Text>{user.username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
