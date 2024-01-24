import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import React from "react";

export default function Fader() {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  return (
    <>
      <View
        style={{
          opacity: 0.4,
          position: "absolute",
          backgroundColor: "black",
          width: screenWidth,
          height: screenHeight * 0.92,
        }}
      ></View>
    </>
  );
}

const styles = StyleSheet.create({});
