import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Animated,
} from "react-native";
import PostHeader from "../Headers/PostHeader";
import { useUser } from "../../context/UserContext";

import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { supabase } from "../../services/supabase";
import { getUser } from "../../services/user";
export default function Buttons({ post, userDetails }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showReactionModal, setReactionModal] = useState(false);
  const [showReactionSent, setShowReactionSent] = useState(false); // New state
  const [token, setToken] = useState(null);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getPushToken = async () => {
      const resp = await getUser(post);
      setToken(resp.body.expo_push_token);
    };
    getPushToken();
  }, []);

  useEffect(() => {
    if (showReactionSent) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start(() => setShowReactionSent(false));
    }
  }, [showReactionSent, fadeAnim]);

  const handleReaction = async (reactionType) => {
    try {
      const newReaction = {
        comment: null,
        creatorId: post.user_id,
        userId: user.user_id,
        userProfileImage: user.profileimage,
        postId: post.id,
        userUsername: user.username,
        creatorUsername: post.username,
        creatorDisplayname: post.displayName,
        userDisplayname: user.displayName,
        creatorProfileImage: post.profileimage,
        media: post.media,
        mediaType: post.mediaType,
        eventType: "reaction",
        description: post.description,
        liked: false,
        reactionType: reactionType,
      };

      const resp = await supabase.from("notifications").insert([newReaction]);
      setReactionModal(false);
      setShowReactionSent(true);

      setTimeout(() => {
        setShowReactionSent(false);
      }, 2000);
      return resp;
    } catch (error) {
      console.error("Error submitting reaction:", error);
      throw error;
    }
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Comments", { post, token })}
        style={{ width: 25, left: post.user_id === user.user_id ? 5 : 5 }}
      >
        <Image
          style={{ height: 20, width: 20 }}
          source={require("../../assets/Chat.png")}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setReactionModal(true)}
        style={{ width: 25, left: 40 }}
      >
        <Image
          style={{
            height: 20,
            width: 20,
            left: post.user_id === user.user_id ? -15 : -15,
          }}
          source={require("../../assets/Category.png")}
        />
      </TouchableOpacity>

      {/* REACTION MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReactionModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              width: screenWidth,
              height: screenHeight,
              position: "absolute",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setReactionModal(false)}
          >
            <View
              style={{
                backgroundColor: "black",
                width: screenWidth,
                height: screenHeight,
                position: "absolute",
                opacity: 0.5,
              }}
            ></View>
          </Pressable>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
              width: screenWidth * 0.98,
              height: screenHeight * 0.4,
              padding: 20,
              borderRadius: 10,
              bottom: 40,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            ></View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                top: screenHeight * 0.07,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  handleReaction("❤");
                }}
              >
                <Text style={{ fontSize: 40 }}>❤</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleReaction("😂")}>
                <Text style={{ fontSize: 40 }}>😂</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleReaction("👏")}>
                <Text style={{ fontSize: 40 }}>👏</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleReaction("🔥")}>
                <Text style={{ fontSize: 40 }}>🔥</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                top: screenHeight * 0.16,
              }}
            >
              <TouchableOpacity onPress={() => handleReaction("💯")}>
                <Text style={{ fontSize: 40 }}>💯</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleReaction("😮")}>
                <Text style={{ fontSize: 40 }}>😮</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleReaction("😍")}>
                <Text style={{ fontSize: 40 }}>😍</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleReaction("😎")}>
                <Text style={{ fontSize: 40 }}>😎</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* REACTION SENT POPUP */}
      {showReactionSent && (
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 10,
            borderRadius: 5,
            bottom: 20,
            left: screenWidth / 2 - 80,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Poppins-Bold",
            }}
          >
            Reaction sent
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between", // Adjust as needed
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
});
