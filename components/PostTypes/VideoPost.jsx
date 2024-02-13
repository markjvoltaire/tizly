import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  ActivityIndicator,
  Modal,
  useColorScheme,
} from "react-native";
import { Video } from "expo-av";
import Buttons from "../Engagement/Buttons";
import AccessTab from "../AccessType/AccessTab";
import ProfileInformation from "../ProfileDetails/ProfileInformation";
import { useNavigation } from "@react-navigation/native";

export default function VideoPost({ post }) {
  const navigation = useNavigation();
  const [status, setStatus] = useState({});
  const video = useRef(null);
  const progressIntervalRef = useRef(null);
  const scheme = useColorScheme();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [modalVisible, setModalVisible] = useState(false);

  const aspectRatio =
    post.width !== null && post.height !== null
      ? post.width / post.height
      : 1020 / 1080;

  const newWidth = screenWidth * 0.92;
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
    <>
      <Pressable onPress={() => navigation.navigate("VideoPost", { post })}>
        <View>
          {post.description !== "" && (
            <Text
              style={{
                left: screenWidth * 0.02,
                width: screenWidth * 0.9,
                paddingBottom: 23,
                top: 6,
                color: scheme === "light" ? "black" : "white",
              }}
            >
              {post.description}
            </Text>
          )}
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
                width: newWidth,
                height: newHeight > newWidth ? 500 : newWidth,
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
              justifyContent: "center",
              alignSelf: "center",
              height: 70,
              width: 70,
            }}
            source={require("../../assets/Play.png")}
          />

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
    </>
  );
}
