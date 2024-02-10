import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Animated,
  Text,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";
import ProfileCard from "../notifications/ProfileCard";

export default function ImageBanner({ item }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [imageLoaded, setImageLoaded] = useState(false);

  const navigation = useNavigation();

  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  // const handlePress = () => {
  //   navigation.navigate("ProfileDetail", { userDetails: item });
  // };

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

  const onImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <View style={{ width: width * 0.4 }}>
        <ProfileCard userDetails={item} />
      </View>
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
            <Image
              style={{
                height: 300,
                width: 185,
                borderRadius: 10,
                backgroundColor: "grey",
              }}
              source={{ uri: item.bannerImage }}
              onLoad={onImageLoad}
            />
            {imageLoaded ? null : (
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
                opacity: 0.2,
              }}
            ></View>
          </View>
        </Animated.View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({});
