import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";

export default function NoPosts({ userDetails }) {
  const scheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Image
        source={
          scheme === "light"
            ? require("../../assets/LightClock.png")
            : require("../../assets/DarkClock.png")
        }
        style={styles.lockedImage}
      />
      <Text
        style={{
          fontSize: 14,
          textAlign: "center",
          marginBottom: 10,
          color: scheme === "light" ? "#555" : "white",
          fontFamily: "Poppins-Bold",
        }}
      >
        {userDetails.username} hasn't uploaded anything yet...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    bottom: 10,
    flex: 1,
  },
  lockedImage: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
    fontFamily: "Poppins-Bold",
  },
  placeholderContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  placeholderText: {
    marginRight: 10,
    fontSize: 18,
    color: "#777",
    fontFamily: "Poppins-SemiBold",
  },
  unlockButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
