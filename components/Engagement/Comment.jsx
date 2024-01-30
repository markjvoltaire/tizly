import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import PostHeader from "../Headers/PostHeader";
import { useUser } from "../../context/UserContext";
import CommentHeader from "../Headers/CommentHeader";

export default function Comment(comment, post) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const { user } = useUser();

  return (
    <View
      style={{
        paddingBottom: screenHeight * 0.02,
        borderBottomWidth: 1,
        borderColor: 10,
        width: screenWidth * 0.85,
      }}
    >
      <CommentHeader comment={comment} user={user} />
      <View
        style={{
          left: 10,
          width: screenWidth * 0.96,
        }}
      >
        <Text style={{ fontSize: 15 }}>{comment.comment.comment}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
