import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import React, { useRef } from "react";
import { Video } from "expo-av";

export default function PostPreview({ item }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [status, setStatus] = React.useState({});
  const video = useRef(null);

  if (item.mediaType === "image") {
    return (
      <View
        style={{
          width: screenWidth * 0.12,
          height: screenHeight * 0.07,
          top: screenHeight * 0.02,
          borderRadius: 5,
          backgroundColor: "grey",
        }}
      >
        <Image
          style={{
            width: screenWidth * 0.12,
            height: screenHeight * 0.07,
            borderRadius: 5,
          }}
          source={{ uri: item.media }}
        />
      </View>
    );
  }

  if (item.mediaType === "status") {
    return (
      <View
        style={{
          width: screenWidth * 0.12,
          height: screenHeight * 0.07,
          top: screenHeight * 0.02,
          borderRadius: 5,
          borderWidth: 0.3,
        }}
      >
        <View
          style={{
            width: screenWidth * 0.1,
            height: screenHeight * 0.07,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ alignSelf: "center", fontSize: 4, fontWeight: "300" }}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  }

  if (item.mediaType === "video") {
    return (
      <View
        style={{
          width: screenWidth * 0.12,
          height: screenHeight * 0.07,
          top: screenHeight * 0.02,
          borderRadius: 5,
        }}
      >
        <Video
          shouldPlay={false}
          ref={video}
          resizeMode="cover"
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          style={{
            width: screenWidth * 0.12,
            height: screenHeight * 0.07,
            borderRadius: 5,
            backgroundColor: "grey",
          }}
          source={{ uri: item.media }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
