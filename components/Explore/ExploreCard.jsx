import { StyleSheet, Text, View } from "react-native";
import React from "react";
import VideoBanner from "./VideoBanner";
import ImageBanner from "./ImageBanner";

export default function ExploreCard({ item }) {
  if (item.bannerImageType === "image") {
    return (
      <View style={{ padding: 5 }}>
        <ImageBanner item={item} />
      </View>
    );
  }

  if (item.bannerImageType === "video") {
    return (
      <View style={{ padding: 5 }}>
        <VideoBanner item={item} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
