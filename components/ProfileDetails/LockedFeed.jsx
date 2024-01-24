import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getPosts } from "../../services/user";

export default function LockedFeed({ userDetails }) {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState([]);

  const userid = userDetails.user_id;

  useEffect(() => {
    const getPostCount = async () => {
      const resp = await getPosts(userid);
      setPost(resp);
      setLoading(false);
    };
    getPostCount();
  }, []);

  const photoCount = post.filter((item) => item.mediaType === "image");
  const videoCount = post.filter((item) => item.mediaType === "video");
  const textCount = post.filter((item) => item.mediaType === "status");

  if (loading) {
    return (
      <View style={{ top: 10 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
        bottom: 35,
      }}
    >
      <Image
        source={require("../../assets/blackLock.png")}
        style={styles.lockedImage}
      />
      <Text style={styles.messageText}>
        Unlock {userDetails.username}'s feed for exclusive content
      </Text>
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>{photoCount.length} Photos</Text>
        <Text style={styles.placeholderText}>{videoCount.length} Videos</Text>
        <Text style={styles.placeholderText}>{textCount.length} Status</Text>
      </View>
      <TouchableOpacity style={styles.unlockButton}>
        <Text style={styles.buttonText}>Unlock Feed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",

    flex: 1,
  },
  lockedImage: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
    fontFamily: "Poppins-Bold",
  },
  placeholderContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  placeholderText: {
    marginRight: 10,
    fontSize: 18,
    color: "#777",
    fontFamily: "Poppins-SemiBold",
  },
  unlockButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
