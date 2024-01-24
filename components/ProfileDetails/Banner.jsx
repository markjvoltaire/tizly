import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  Image,
  View,
  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";

const Banner = ({ userDetails }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const video = useRef(null);

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
      {userDetails.bannerImageType === "video" ? (
        <>
          <View
            style={{
              position: "absolute",
              height: screenHeight * 0.92,
              width: screenWidth,
              backgroundColor: "black",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="white" />
          </View>
          <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
            <Video
              shouldPlay
              isLooping
              ref={video}
              resizeMode={
                userDetails.bannerHeight > userDetails.bannerWidth
                  ? "cover"
                  : null
              }
              style={{
                width: screenWidth,
                height: screenHeight * 0.92,
                alignSelf: "center",
              }}
              source={{ uri: userDetails.bannerImage }}
            />
          </Animated.View>
        </>
      ) : (
        <>
          <View
            style={{
              position: "absolute",
              height: screenHeight * 0.92,
              width: screenWidth,
              backgroundColor: "black",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="white" />
          </View>
          <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
            <Image
              resizeMode="cover"
              style={{
                width: screenWidth,
                height: screenHeight * 0.92,
                alignSelf: "center",
              }}
              source={{ uri: userDetails.bannerImage }}
            />
          </Animated.View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Banner;
