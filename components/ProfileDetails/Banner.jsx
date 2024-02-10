import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { Video } from "expo-av";
import { getUser } from "../../services/user";
import { supabase } from "../../services/supabase";

const Banner = ({ userDetails, scrollPosition, focused }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const video = useRef(null);
  const [userInfo, setUserInfo] = useState(userDetails);
  async function fetchUser() {
    try {
      const resp = await getUser(userInfo);
      setUserInfo(resp.body);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      if (userInfo.bannerImage === undefined) {
        await fetchUser();
      }
    };
    loadUser();
  }, [userInfo.bannerImage]);

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
      {userInfo.bannerImageType === "video" ? (
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
              shouldPlay={
                scrollPosition > 120 || focused === false ? false : true
              }
              isLooping
              ref={video}
              resizeMode={
                userInfo.bannerHeight > userInfo.bannerWidth ? "cover" : null
              }
              style={{
                width: screenWidth,
                height: screenHeight * 0.92,
                alignSelf: "center",
              }}
              source={{ uri: userInfo.bannerImage }}
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
              source={{ uri: userInfo.bannerImage }}
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
