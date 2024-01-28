import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import PostHeader from "../Headers/PostHeader";
import ImageDetails from "./ImageDetails";
import StatusDetails from "./StatusDetails";
import VideoDetails from "./VideoDetails";

export default function PostInfo({ route }) {
  const post = route.params.post;

  const info = {
    user_id: post.creatorId,
  };
  if (post.mediaType === "image") {
    return (
      <ScrollView>
        <PostHeader post={info} />
        <ImageDetails post={post} />
      </ScrollView>
    );
  }

  if (post.mediaType === "status") {
    return (
      <ScrollView>
        <PostHeader post={info} />
        <StatusDetails post={post} />
      </ScrollView>
    );
  }

  if (post.mediaType === "video") {
    return (
      <ScrollView>
        <PostHeader post={info} />
        <VideoDetails post={post} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({});
