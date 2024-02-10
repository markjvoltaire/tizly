import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";

export default function VideoScreen({ route }) {
  const post = route.params.post;
  const video = useRef(null);
  const [status, setStatus] = React.useState({});

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const aspectRatio =
    post.width !== null && post.height !== null
      ? post.width / post.height
      : 1020 / 1080;

  const newWidth = screenWidth * 0.92;
  const newHeight = newWidth / aspectRatio;

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute" }}>
        <ActivityIndicator size="large" />
      </View>
      <Video
        isLooping
        shouldPlay={true}
        useNativeControls={true}
        ref={video}
        resizeMode={post.height > post.width ? "cover" : null}
        style={{
          width: screenWidth,
          height: screenHeight * 0.91,
          alignSelf: "center",
          borderRadius: 10,
        }}
        source={{ uri: post.media }}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
