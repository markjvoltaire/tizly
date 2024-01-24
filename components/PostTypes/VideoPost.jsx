import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";
import Buttons from "../Engagement/Buttons";
import { useNavigation } from "@react-navigation/native";
import AccessTab from "../AccessType/AccessTab";

export default function VideoPost({ post }) {
  const [status, setStatus] = React.useState({});
  const video = useRef(null);
  const progressIntervalRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const aspectRatio =
    post.width !== null && post.height !== null
      ? post.width / post.height
      : 1020 / 1080;

  const newWidth = screenWidth * 0.92;
  const newHeight = newWidth / aspectRatio;

  useEffect(() => {
    const updateProgress = async () => {
      const status = await video.current.getStatusAsync();
      if (status.isLoaded) {
        const currentProgress = status.positionMillis / status.durationMillis;
        setProgress(currentProgress);
      }
    };

    progressIntervalRef.current = setInterval(updateProgress, 100);

    return () => {
      clearInterval(progressIntervalRef.current);
    };
  }, []);

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
    <Pressable>
      <View>
        {post.description === "" ? null : (
          <Text
            style={{
              left: screenWidth * 0.02,
              width: screenWidth * 0.9,
              paddingBottom: 23,
              top: 6,
            }}
          >
            {post.description}
          </Text>
        )}
        {/* Center the ActivityIndicator within the Video */}
        <View
          style={{
            position: "absolute",
            top: "50%", // Center vertically
            left: "50%", // Center horizontally
            transform: [{ translateX: -35 }, { translateY: -35 }], // Adjust based on the size of the ActivityIndicator
          }}
        >
          <ActivityIndicator size="large" />
        </View>
        <Video
          isMuted
          isLooping
          ref={video}
          resizeMode="cover"
          style={{
            width: newWidth,
            height: newHeight > newWidth ? 500 : newWidth,
            alignSelf: "center",
            borderRadius: 10,
          }}
          source={{ uri: post.media }}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        <Image
          style={{
            position: "absolute",
            top: "40%",
            justifyContent: "center",
            alignSelf: "center",
            height: 70,
            width: 70,
          }}
          source={require("../../assets/Play.png")}
        />
        <View
          style={{
            paddingBottom: screenHeight * 0.01,
            right: screenWidth * 0.02,
          }}
        >
          <AccessTab post={post} />
        </View>
        <Text
          style={{
            paddingBottom: 20,
            top: 12,
            color: "#979797",
            fontFamily: "Poppins-SemiBold",
            fontSize: 12,
          }}
        >
          {formattedDate}
        </Text>
        <View style={{ right: screenWidth * 0.01, top: screenHeight * 0.01 }}>
          <Buttons post={post} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
