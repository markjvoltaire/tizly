import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Animated,
} from "react-native";

export default function ProfileInformation({ userDetails }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          bottom: screenHeight * 0.2,
        }}
      >
        <Animated.Image
          style={{
            height: screenHeight * 0.06,
            width: screenWidth * 0.13,
            borderRadius: 100,
            marginLeft: 10,
            opacity: fadeAnim,
            backgroundColor: "grey",
          }}
          source={{ uri: userDetails.profileimage }}
        />
        <View style={{ marginRight: 10, left: 10 }}>
          <Animated.Text
            style={{
              color: "white",
              fontFamily: "Poppins-Bold",
              fontSize: 20,
              marginBottom: -2,
              opacity: fadeAnim,
            }}
          >
            {userDetails.displayName}
          </Animated.Text>
          <Animated.Text
            style={{
              color: "#CECECE",
              fontWeight: "600",
              fontSize: 16,
              opacity: fadeAnim,
            }}
          >
            @{userDetails.username}
          </Animated.Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
