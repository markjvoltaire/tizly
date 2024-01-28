import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppHeader from "../components/Headers/AppHeader";
import PostInfo from "../components/Post/PostInfo";

export default function PostDetail({ navigation, route }) {
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <Text
        style={{
          fontFamily: "Poppins-Black",
          fontSize: 20,
          bottom: 5,
          color: "#00A3FF",
          alignSelf: "center",
        }}
      >
        Tizly
      </Text>
      <PostInfo route={route} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
