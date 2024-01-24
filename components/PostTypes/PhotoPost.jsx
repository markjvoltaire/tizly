import React, { useRef, useEffect } from "react";
import {
  Text,
  View,
  Animated,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import Buttons from "../Engagement/Buttons";
import AccessTab from "../AccessType/AccessTab";

export default function PhotoPost({ post }) {
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  const calculateAspectRatio = () => post.width / post.height;
  const aspectRatio = calculateAspectRatio();

  const newWidth = width * 0.92;
  const newHeight = newWidth / aspectRatio;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const date = new Date(post.date);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  let formattedDate;

  if (daysDifference > 7) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = date.getMonth();
    const monthName = monthNames[month];
    formattedDate = `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
  } else if (daysDifference > 0) {
    formattedDate =
      daysDifference === 1 ? "1 day ago" : `${daysDifference} days ago`;
  } else if (hoursDifference > 0) {
    formattedDate =
      hoursDifference === 1 ? "1 hour ago" : `${hoursDifference} hours ago`;
  } else if (minutesDifference > 0) {
    formattedDate =
      minutesDifference === 1
        ? "1 minute ago"
        : `${minutesDifference} minutes ago`;
  } else {
    formattedDate = "Just now";
  }

  return (
    <Animated.View
      style={{
        width: width * 0.96,
        opacity: fadeAnim,
      }}
    >
      {post.description === "" ? null : (
        <Text
          style={{
            left: width * 0.04,
            width: width * 0.9,
            paddingBottom: 23,
            top: 6,
          }}
        >
          {post.description}
        </Text>
      )}
      <View
        style={{
          width: newWidth,
          height: newHeight,
          alignSelf: "center",
          borderRadius: 10,

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Uncomment the line below once you have the actual image URI */}
        <View style={{ position: "absolute" }}>
          <ActivityIndicator size="large" />
        </View>
        <Image
          style={{
            width: newWidth,
            height: newHeight,
            alignSelf: "center",
            borderRadius: 10,
          }}
          source={{ uri: post.media }}
        />
      </View>
      <View style={{}}>
        <AccessTab post={post} />
      </View>
      <Text
        style={{
          paddingBottom: 26,
          top: 20,
          color: "#979797",
          fontFamily: "Poppins-SemiBold",
          fontSize: 12,
          left: 10,
        }}
      >
        {formattedDate}
      </Text>
      <View style={{ left: 8, top: height * 0.01 }}>
        <Buttons post={post} />
      </View>
    </Animated.View>
  );
}
