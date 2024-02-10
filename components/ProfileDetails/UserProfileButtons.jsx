import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";

export default function UserProfileButtons({ navigation, user }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const [friendStatus, setFriendStatus] = useState("notFriends");

  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation for the first button
    Animated.timing(opacity1, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();

    // Fade in animation for the second button with a delay
    Animated.timing(opacity2, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={{ flexDirection: "row" }}>
      <Animated.View
        style={{
          opacity: opacity1,
        }}
      >
        <Pressable
          onPress={() => navigation.navigate("EditProfile", { user })}
          style={{
            borderWidth: 1,

            backgroundColor: "white",
            width: screenWidth * 0.3,
            height: screenHeight * 0.036,
            padding: 1,
            marginRight: 20,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              alignSelf: "center",

              paddingTop: screenHeight * 0.005,
            }}
          >
            Edit Profile
          </Text>
        </Pressable>
      </Animated.View>
      <Animated.View
        style={{
          opacity: opacity2,
        }}
      >
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: "white",
            width: screenWidth * 0.09,
            height: screenHeight * 0.036,
            padding: 1,
            aspectRatio: 1,
            borderRadius: 100,
            backgroundColor: "white",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("Settings")}
        >
          <Image
            style={{ height: 30, width: 30, alignSelf: "center" }}
            source={require("../../assets/More.png")}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({});
