import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import Buttons from "../Engagement/Buttons";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";

export default function PostContent({ post }) {
  const scheme = useColorScheme();
  const video = useRef(null);
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;
  const [status, setStatus] = useState({});
  const navigation = useNavigation();

  if (post.mediaType === "image") {
    const calculateAspectRatio = () => post.width / post.height;
    const aspectRatio = calculateAspectRatio();

    const newWidth = width * 0.95;
    const newHeight = newWidth / aspectRatio;
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
      <View style={{}}>
        {post.description ? (
          <Text
            style={{
              color: scheme === "dark" ? "white" : "black",
              fontSize: 13,
              paddingBottom: 8,
              bottom: 5,
              lineHeight: 23,
              left: 12,
              width: width * 0.92,
              fontFamily: "SF-Medium",
            }}
          >
            {post.description}
          </Text>
        ) : null}
        <Image
          style={{
            height: newHeight,
            width: newWidth,
            borderRadius: 10,
            marginBottom: 15,
            alignSelf: "center",
            backgroundColor: "grey",
          }}
          source={{ uri: post.media }}
        />

        <Text
          style={{
            color: "#9F9F9F",
            left: width * 0.03,
            marginBottom: 10,
            bottom: 6,
          }}
        >
          {formattedDate}
        </Text>

        <View style={{ left: width * 0.03 }}>
          <Buttons post={post} />
        </View>
      </View>
    );
  }

  if (post.mediaType === "video") {
    const calculateAspectRatio = () => post.width / post.height;
    const aspectRatio = calculateAspectRatio();

    const newWidth = width * 0.95;
    const newHeight = newWidth / aspectRatio;

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
      <View style={{}}>
        {post.description ? (
          <Text
            style={{
              color: scheme === "dark" ? "white" : "black",
              fontSize: 13,
              paddingBottom: 8,
              bottom: 5,
              lineHeight: 23,
              left: 12,
              width: width * 0.92,
              fontFamily: "SF-Medium",
            }}
          >
            {post.description}
          </Text>
        ) : null}
        <Pressable
          onPress={() =>
            navigation.navigate("VideoPost", {
              post,
            })
          }
        >
          <Video
            isMuted
            isLooping
            ref={video}
            resizeMode="cover"
            style={{
              height: newHeight / 1.3,
              width: newWidth,
              borderRadius: 10,
              marginBottom: 15,
              alignSelf: "center",
              borderRadius: 10,
              backgroundColor: "grey",
            }}
            source={{ uri: post.media }}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
        </Pressable>
        <Image
          style={{
            position: "absolute",
            top: "40%",

            alignSelf: "center",
            height: 70,
            width: 70,
          }}
          source={require("../../assets/Play.png")}
        />

        <Text
          style={{
            color: "#9F9F9F",
            left: width * 0.03,
            marginBottom: 10,
            bottom: 6,
          }}
        >
          {formattedDate}
        </Text>

        <View style={{ left: width * 0.03 }}>
          <Buttons post={post} />
        </View>
      </View>
    );
  }

  if (post.mediaType === "status") {
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
      <View style={{ left: width * 0.15 }}>
        <Text
          style={{
            color: scheme === "dark" ? "white" : "black",
            fontSize: 13,
            bottom: 9,
            lineHeight: 20,
            width: width * 0.82,
            fontFamily: "SF-Medium",
          }}
        >
          {post.description}
        </Text>

        <Text
          style={{
            color: "#9F9F9F",
            marginBottom: 10,
            bottom: 6,
          }}
        >
          {formattedDate}
        </Text>

        <View style={{ top: 2 }}>
          <Buttons post={post} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
