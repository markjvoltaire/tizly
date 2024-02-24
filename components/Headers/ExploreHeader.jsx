import { Image, StyleSheet, Text, View, useColorScheme } from "react-native";
import React from "react";

export default function ExploreHeader() {
  const scheme = useColorScheme();
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
          color: scheme === "light" ? "black" : "white",
        }}
      >
        Explore
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
