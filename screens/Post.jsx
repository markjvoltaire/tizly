import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Dimensions,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useScrollToTop } from "@react-navigation/native";
import { Video } from "expo-av";
import { uploadStatus } from "../services/user";
import { useUser } from "../context/UserContext";

export default function Post({ navigation }) {
  const [description, setDescription] = useState("");
  const [postInfo, setPostInfo] = useState(null);
  const scheme = useColorScheme();
  const { user } = useUser();
  const ref = useRef(null);
  const video = useRef(null);
  useScrollToTop(ref);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const pickPost = async () => {
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [9, 16],
      canAskAgain: true,
      videoMaxDuration: 15,
      quality: 0.6,
      allowsEditing: false,
    });

    console.log("photo", photo);

    if (!photo.canceled) {
      // "fileSize": 791445
      // "fileSize": 88749,
      let newfile = {
        uri: photo.assets[0].uri,
        type: `test/${photo.assets[0].uri.split(".")[1]}`,
        name: `test.${photo.assets[0].uri.split(".")[1]}`,
        mediaType: photo.assets[0].type,
        height: photo.assets[0].height,
        width: photo.assets[0].width,
      };

      setPostInfo(newfile);
      return newfile;
    }
  };

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  const uploadPost = async () => {
    try {
      if (postInfo === null) {
        await uploadStatus(description);
        // If the uploadStatus function completes without throwing an error,
        // it is considered successful. You can show a success arlert here.
        navigation.navigate("Home");
        setDescription("");
        Alert.alert("Upload successful");
      } else {
        // If the uploadStatus function completes without throwing an error,
        // it is considered successful. You can show a success alert here.
        navigation.navigate("Uploading", {
          description,
          postInfo,
        });

        setDescription("");
        setPostInfo(null);
      }
    } catch (error) {
      // Handle any errors that may occur during the upload process.
      console.error("Error uploading post:", error);
      // Optionally, show an error alert.
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: scheme === "light" ? "white" : "#111111",
        flex: 1,
      }}
    >
      <TouchableWithoutFeedback onPress={handleScreenPress}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                top: screenHeight * 0.015,
                fontWeight: "800",
                fontSize: 17,
                marginRight: screenWidth * 0.54,
                left: screenWidth * 0.05,
                color: scheme === "dark" ? "white" : "black",
              }}
            >
              Create Post
            </Text>
            <Pressable
              onPress={() => uploadPost(description)}
              style={{
                backgroundColor: scheme === "light" ? "black" : "white",
                width: screenWidth * 0.22,
                height: screenHeight * 0.035,
                justifyContent: "center",
                borderRadius: 10,
                top: screenHeight * 0.01,
                right: screenWidth * 0.07,
              }}
            >
              <Text
                style={{
                  color: scheme === "light" ? "white" : "black",
                  fontFamily: "Poppins-Bold",
                  alignSelf: "center",
                  fontSize: 12,
                }}
              >
                Upload
              </Text>
            </Pressable>
          </View>

          <TextInput
            multiline={true}
            placeholder="Say Something"
            style={{
              alignSelf: "center",
              paddingLeft: 8,
              borderColor: "black",
              borderWidth: 0.3,
              borderRadius: 12,
              backgroundColor: "#F3F3F9",
              height: screenHeight * 0.2,
              width: screenWidth * 0.95,
              fontFamily: "Poppins-SemiBold",
              fontSize: 12,
              top: screenHeight * 0.05,
            }}
            placeholderTextColor={scheme === "light" ? null : "#929292"}
            onChangeText={(text) => setDescription(text)}
            value={description}
          />

          <Pressable
            style={{
              height: 100,
              width: 100,
              top: screenHeight * 0.04,
              right: screenWidth * 0.4,
              borderRadius: 10,
              alignSelf: "center",
            }}
            onPress={() => pickPost()}
          >
            {postInfo === null ? (
              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    alignSelf: "center",
                  }}
                  source={
                    scheme === "light"
                      ? require("../assets/gallery.png")
                      : require("../assets/GalleryLight.png")
                  }
                />
              </View>
            ) : postInfo.mediaType === "image" ? (
              <>
                <Image
                  resizeMode="cover"
                  style={{
                    height: 80,
                    width: 80,
                    left: 10,
                    alignSelf: "center",
                    top: 40,
                    borderRadius: 10,
                  }}
                  source={{ uri: postInfo.uri }}
                />
                <Pressable
                  style={{
                    position: "absolute",
                    bottom: 32,
                    left: screenWidth * 0.27,
                  }}
                  onPress={() => setPostInfo(null)}
                >
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                    }}
                    source={
                      scheme === "dark"
                        ? require("../assets/whiteX.png")
                        : require("../assets/blackX.png")
                    }
                  />
                </Pressable>
              </>
            ) : (
              <>
                <Video
                  resizeMode="cover"
                  style={{
                    height: 80,
                    width: 80,
                    left: 10,
                    alignSelf: "center",
                    top: 40,
                    borderRadius: 10,
                  }}
                  source={{ uri: postInfo.uri }}
                />
                <Pressable
                  style={{
                    position: "absolute",
                    bottom: 32,
                    left: screenWidth * 0.27,
                  }}
                  onPress={() => setPostInfo(null)}
                >
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                    }}
                    source={
                      scheme === "dark"
                        ? require("../assets/whiteX.png")
                        : require("../assets/blackX.png")
                    }
                  />
                </Pressable>
              </>
            )}
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
