import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Alert,
  Pressable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import {
  deleteComment,
  getComments,
  getUser,
  reportCommentById,
} from "../services/user";
import Comment from "../components/Engagement/Comment";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";
import ProfileCard from "../components/notifications/ProfileCard";
import { notifyUserAboutNewComment } from "../services/notification";

export default function Comments({ route }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const { user } = useUser();
  const scheme = useColorScheme();

  const post = route.params.post;
  const tokenCode = route.params.token;

  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(post);

  const handleOptionPress = (item) => {
    item.userId === user.user_id
      ? handleCommentDelete(item)
      : reportComment(item);
  };

  const reportComment = (item) => {
    Alert.alert(
      "Report Comment",
      "Are you sure you want to report this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Report",
          onPress: async () => {
            try {
              // Your code to report the comment goes here
              // For example, you might want to call an API endpoint to report the comment
              await reportCommentById(item);
              // Show a success message
              Alert.alert(
                "Report Sent",
                "Your report has been sent. Thank you for your feedback."
              );

              // Perform any other actions after reporting
            } catch (error) {
              console.error("Error reporting comment:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleCommentDelete = (item) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Your code to delete the comment from the backend goes here
              // For example, you might want to call an API endpoint to delete the comment
              await deleteComment(item);
              // Assuming the comment is deleted successfully, update the commentList
              setCommentList((prevComments) =>
                prevComments.filter((commentItem) => commentItem.id !== item.id)
              );

              // Show a success message or perform any other actions after deletion
            } catch (error) {
              console.error("Error deleting comment:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleCommentSubmit = async () => {
    if (comment.trim().length === 0) {
      Alert.alert("Add a comment");
    } else {
      try {
        const newComment = {
          comment: comment,
          creatorId: userDetails.user_id,
          userId: user.user_id,
          userProfileImage: user.profileimage,
          postId: post.id,
          userUsername: user.username,
          creatorUsername: userDetails.username,
          creatorDisplayname: userDetails.displayName,
          userDisplayname: user.displayName,
          creatorProfileImage: userDetails.profileimage,
          media: post.media,
          mediaType: post.mediaType,
          eventType: "comment",
          description: post.description,
          liked: false,
          reactionType: null,
        };

        const resp = await supabase.from("notifications").insert([newComment]);

        if (resp.body && resp.body.length > 0) {
          // Assuming resp.body is an array with at least one item
          setCommentList((prevComments) => [...prevComments, resp.body[0]]);
          setComment("");
          await notifyUserAboutNewComment(userDetails, comment, tokenCode);
          return resp;
        } else {
          console.error("Invalid response from supabase:", resp);
          Alert.alert("Error", "Failed to submit comment. Please try again.");
          return null; // or handle accordingly based on your requirements
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
        Alert.alert("Error", "Failed to submit comment. Please try again.");
        throw error;
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const resp = await getComments(post);
      if (resp.body.length === 0) {
        setCommentList([]);
      } else {
        setCommentList(resp.body);
      }
    } catch (error) {
      console.error("Error refreshing comments:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      try {
        const resp = await getUser(userDetails);
        setUserDetails(resp.body);
        const res = await getComments(post);
        setCommentList(res.body);
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: scheme === "light" ? "white" : "#080A0B",
          flex: 1,
        }}
      >
        <View style={{ top: screenHeight * 0.3 }}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: scheme === "light" ? "white" : "#080A0B",
      }}
    >
      <View style={{ alignSelf: "center" }}>
        <ProfileCard userDetails={userDetails} />
      </View>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -300}
      >
        <View style={styles.flex1}>
          {commentList.length === 0 ? (
            <Text
              style={{
                alignSelf: "center",
                top: screenHeight * 0.2,
                fontWeight: "800",
                color: scheme === "dark" ? "white" : "black",
              }}
            >
              Be The First To Comment
            </Text>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={commentList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ flexDirection: "row" }}>
                  <View style={{ marginRight: 10 }}>
                    <Comment post={post} comment={item} />
                  </View>
                  <TouchableOpacity onPress={() => handleOptionPress(item)}>
                    <Image
                      style={{ height: 30, width: 30 }}
                      source={
                        scheme === "light"
                          ? require("../assets/More.png")
                          : require("../assets/MoreLight.png")
                      }
                    />
                  </TouchableOpacity>
                </View>
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: scheme === "light" ? "white" : "#080A0B",
            borderTopWidth: 1,
            borderTopColor: "#ccc",
          }}
        >
          <TextInput
            placeholderTextColor="#080A0B"
            style={styles.commentInput}
            placeholder="Add a comment"
            value={comment}
            onChangeText={(text) => setComment(text)}
          />

          <Pressable
            style={{
              backgroundColor: scheme === "light" ? "#00A3FF" : "white",
              width: screenWidth * 0.25,
              height: screenHeight * 0.04,
              justifyContent: "center",
              borderRadius: 10,
            }}
            onPress={() => handleCommentSubmit()}
          >
            <Text
              style={{
                color: scheme === "light" ? "white" : "black",
                fontFamily: "Poppins-Bold",
                alignSelf: "center",
              }}
            >
              Comment
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    fontFamily: "Poppins-Black",
    fontSize: 20,
    left: 5,
    paddingBottom: Dimensions.get("window").height * 0.02,
  },
  flex1: {
    flex: 1,
    paddingBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  commentInput: {
    alignSelf: "center",
    paddingLeft: 8,
    borderColor: "black",
    borderWidth: 0.3,
    borderRadius: 12,
    backgroundColor: "#F3F3F9",
    width: 250,
    height: 40,
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    justifyContent: "center",
  },
});
