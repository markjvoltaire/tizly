import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import { getPost } from "../services/user";

export default function AlertVideo({ route }) {
  const item = route.params.item;
  const video = useRef(null);
  const [status, setStatus] = React.useState({});
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVideo = async () => {
      const resp = await getPost(item);
      setPost(resp.body);
      setLoading(false);
    };
    getVideo();
  }, []);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
