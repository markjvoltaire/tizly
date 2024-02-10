import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";
import ProfileCard from "../notifications/ProfileCard";

export default function VideoBanner({ item }) {
  const video = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [videoLoaded, setVideoLoaded] = useState(false);

  const navigation = useNavigation();

  const { user, setUser } = useUser();

  const handlePress = () => {
    if (user.user_id === item.user_id) {
      navigation.navigate("UserProfile");
    }

    if (user.user_id !== item.user_id) {
      navigation.navigate("ProfileDetail", { userDetails: item });
    }
  };
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onVideoLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <>
      <ProfileCard userDetails={item} />
      <Pressable onPress={handlePress}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View
            style={{
              height: 300,
              width: 185,
              alignSelf: "center",
              borderRadius: 10,
              position: "relative",
            }}
          >
            <Video
              isMuted
              shouldPlay
              isLooping
              ref={video}
              resizeMode="cover"
              style={{
                height: 300,
                width: 185,
                alignSelf: "center",
                borderRadius: 10,
              }}
              source={{ uri: item.bannerImage }}
              onReadyForDisplay={onVideoLoad}
            />
            {videoLoaded ? null : (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="white" />
              </View>
            )}
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                borderRadius: 10,
                backgroundColor: "black",
                position: "absolute",
                opacity: 0.4,
              }}
            ></View>
          </View>
        </Animated.View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({});
