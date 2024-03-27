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
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";

export default function InboxDetails({ route }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const { user } = useUser();
  const scheme = useColorScheme();

  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState();

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: scheme === "light" ? "white" : "#111111",
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
        backgroundColor: "white",
      }}
    >
      <TouchableWithoutFeedback onPress={handleScreenPress}>
        <View style={styles.flex1}>
          <KeyboardAvoidingView
            style={styles.flex1}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 0}
          >
            <View style={styles.flex1}></View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: "white",
              }}
            >
              <TextInput
                placeholderTextColor="#080A0B"
                style={styles.commentInput}
                placeholder="Say Something"
                value={comment}
                onChangeText={(text) => setComment(text)}
              />

              <Pressable
                style={{
                  backgroundColor: "#007AFF", // Blue color
                  width: screenWidth * 0.25,
                  height: screenHeight * 0.04,
                  justifyContent: "center",
                  borderRadius: 10,
                }}
                onPress={() => handleCommentSubmit()}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Poppins-Bold",
                    alignSelf: "center",
                    fontWeight: "800",
                  }}
                >
                  Send
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
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
