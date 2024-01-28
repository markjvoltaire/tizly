import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";

import { supabase } from "../../services/supabase";

export default function BannerButtons({ userDetails, friendStatus }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Create animated opacity values for the buttons
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

  if (friendStatus === "friends") {
    return (
      <View style={{ flexDirection: "row" }}>
        <Animated.View
          style={{
            opacity: opacity1,
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "white",
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
                color: "white",
                paddingTop: screenHeight * 0.005,
              }}
            >
              Following
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{
            opacity: opacity2,
          }}
        >
          <TouchableOpacity
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
          >
            <Image
              style={{ height: 30, width: 30, alignSelf: "center" }}
              source={require("../../assets/More.png")}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  if (friendStatus === "pending") {
    return (
      <View style={{ flexDirection: "row" }}>
        <Animated.View
          style={{
            opacity: opacity1,
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "white",
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
                fontFamily: "Poppins-SemiBold",
                alignSelf: "center",

                paddingTop: screenHeight * 0.005,
              }}
            >
              Pending
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: opacity2,
          }}
        >
          <TouchableOpacity
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
          >
            <Image
              style={{ height: 30, width: 30, alignSelf: "center" }}
              source={require("../../assets/More.png")}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  if (friendStatus === "notFriends") {
    return (
      <View style={{ flexDirection: "row" }}>
        <Animated.View
          style={{
            opacity: opacity1,
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "white",
              width: screenWidth * 0.3,
              height: screenHeight * 0.036,
              padding: 1,
              marginRight: 20,
              borderRadius: 12,
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                alignSelf: "center",
                color: "black",
                paddingTop: screenHeight * 0.005,
              }}
            >
              Follow
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: opacity2,
          }}
        >
          <TouchableOpacity
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
          >
            <Image
              style={{ height: 30, width: 30, alignSelf: "center" }}
              source={require("../../assets/More.png")}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
