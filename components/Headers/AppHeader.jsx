import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function AppHeader() {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: 10,
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins-Black",
          fontSize: 18,
          bottom: 4,
          color: "#00A3FF",
          alignSelf: "center",
        }}
      >
        Tizly
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
