import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getPost } from "../../services/user";
import StatusPost from "../PostTypes/StatusPost";

export default function StatusDetails({ post }) {
  const [postDetails, setPostDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const resp = await getPost(post);
        setPostDetails(resp.body);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserDetail();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,

          backgroundColor: "white",
          height: screenHeight,
          width: screenWidth,
          top: screenHeight * 0.2,
        }}
      >
        {/* Display a loading indicator here */}

        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  return (
    <View style={{ alignSelf: "center" }}>
      <StatusPost post={postDetails} />
    </View>
  );
}

const styles = StyleSheet.create({});
