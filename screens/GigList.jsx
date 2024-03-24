import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function GigList({ route }) {
  console.log("route", route.params);
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Text>{route.params}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
