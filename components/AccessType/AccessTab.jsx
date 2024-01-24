import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

export default function AccessTab({ post }) {
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  // Conditionally set the label based on mediaType
  const label =
    post.mediaType === "image"
      ? "Photo 📸"
      : post.mediaType === "video"
      ? "Video 🎥"
      : "status";

  return (
    <View
      style={{
        width: width * 0.2,
        height: height * 0.025,
        backgroundColor: "#8DAEDF",
        borderRadius: 5,
        justifyContent: "center",
        top: 10,
        left: width * 0.02,
      }}
    >
      <Text
        style={{
          color: "white",
          fontFamily: "Poppins-Bold",
          alignSelf: "center",
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
