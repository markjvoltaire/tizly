import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useUser } from "../../context/UserContext";
import { notifyUserAboutNewRequest } from "../../services/notification";

export default function AppHeader({ navigation }) {
  const scheme = useColorScheme();

  const { user } = useUser();

  const tokenCode = user.expo_push_token;
  const userDetails = user;

  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => navigation.navigate("FriendsList")}>
        <Image
          style={styles.icon}
          source={
            scheme === "light"
              ? require("../../assets/friends.png")
              : require("../../assets/FriendsLight.png")
          }
        />
      </Pressable>

      <Text
        style={[
          styles.title,
          { color: scheme === "light" ? "#00A3FF" : "white" },
        ]}
      >
        Tizly
      </Text>

      <Pressable onPress={() => navigation.navigate("Settings")}>
        <Image
          style={styles.icon}
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

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  icon: {
    height: 18,
    width: 18,
    marginHorizontal: 10,
  },
  title: {
    fontFamily: "Poppins-Black",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Poppins-Black",
    fontSize: 18,
    marginLeft: 10,
  },
});
