import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function AppHeader() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center", // Center the content vertically
        padding: 10,
        borderBottomWidth: 0.9,
        borderBottomColor: 10,
      }}
    >
      <Image
        style={{ height: 18, width: 18, left: 10 }}
        source={require("../../assets/Friends.png")}
      />
      <Text
        style={{
          fontFamily: "Poppins-Black",
          fontSize: 18,
          color: "#00A3FF",
        }}
      >
        Tizly
      </Text>

      <Image
        style={{ height: 18, width: 18, right: 10 }}
        source={require("../../assets/Settings.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({});