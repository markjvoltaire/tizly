import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import React from "react";

export default function AppHeader({ navigation }) {
  const scheme = useColorScheme();
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
        source={
          scheme === "light"
            ? require("../../assets/friends.png")
            : require("../../assets/FriendsLight.png")
        }
      />
      <Text
        style={{
          fontFamily: "Poppins-Black",
          fontSize: 18,
          color: scheme === "light" ? "#00A3FF" : "white",
        }}
      >
        Tizly
      </Text>
      <Pressable onPress={() => navigation.navigate("Settings")}>
        <Image
          style={{ height: 18, width: 18, right: 10 }}
          source={
            scheme === "light"
              ? require("../../assets/settings.png")
              : require("../../assets/SettingsLight.png")
          }
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
