import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function ExploreHeader() {
  return (
    <View
      style={{
        padding: 10,
        borderBottomWidth: 0.9,
        borderBottomColor: 10,
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins-Black",
          fontSize: 18,
          color: "#00A3FF",
        }}
      >
        Explore
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
