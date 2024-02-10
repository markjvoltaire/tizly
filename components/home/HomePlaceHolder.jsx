import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

export default function HomePlaceHolder() {
  return (
    <View>
      <Text
        style={{
          textAlign: "center",
          top: 25,
          fontSize: 13,
          color: "#555",
          alignItems: "center",
          width: width * 0.9,
          alignSelf: "center",
        }}
      >
        Your feed is empty, here are some people you may know
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
