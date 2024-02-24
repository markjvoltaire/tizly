import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";

const Uploading = ({ route, navigation }) => {
  const { user, setUser } = useUser();
  const { postInfo, description, displayname, username } = route.params;

  const video = useRef(null);
  const [postProgress, setPostProgress] = useState("");
  const [canceled, setCanceled] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const scheme = useColorScheme();

  let xhr; // XHR object variable

  const handleXHR = async () => {
    const data = new FormData();
    data.append("file", postInfo);
    data.append("upload_preset", "TizlyUpload");
    data.append("cloud_name", "doz01gvsj");

    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/doz01gvsj/upload", true);

    let uploadProgress = 0;

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        uploadProgress = progress;
        setPostProgress(progress);

        console.log(`Upload Progress: ${progress}%`);

        if (progress === 100) {
          // Handle completion actions
        }
      }
    });

    xhr.onload = () => handleUploadResponse(xhr);
    xhr.onerror = handleUploadError;

    xhr.send(data);
  };

  const handleUploadResponse = async (xhr) => {
    if (xhr.status === 200) {
      const resp = JSON.parse(xhr.responseText);

      await uploadToSupabase(resp);
    } else {
      console.log("Upload to Cloudinary failed.");
      handleUploadFailure();
    }
  };

  const handleUploadError = () => {
    console.log("An error occurred during the upload to Cloudinary.");
    handleUploadFailure();
  };

  const handleUploadFailure = () => {
    Alert.alert("An error occurred during the upload");
    navigation.goBack();
  };

  const cancelUpload = () => {
    if (xhr) {
      xhr.abort(); // Abort the XHR request
      setCanceled(true); // Set the canceled state to true
      setCanceled(false);
      navigation.goBack();
    }
  };

  async function updateUserInfo() {
    const userId = supabase.auth.currentUser.id;
    const res = await supabase
      .from("profiles")
      .update({
        username: username,
        displayName: displayname,
      })
      .eq("user_id", userId);

    if (res.error === null) {
      navigation.navigate("EditProfile");
      Alert.alert("Your changes were saved");
      setUser(res.body[0]);
    } else {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    }

    return res;
  }

  async function uploadToSupabase(resp) {
    if (description === "UPLOAD_PROFILE_IMAGE_") {
      const userId = supabase.auth.currentUser.id;

      const res = await supabase
        .from("profiles")
        .update({
          profileimage: resp.secure_url,
          username: username,
          displayName: displayname,
        })
        .eq("user_id", userId);

      if (canceled) {
        Alert.alert("Your Post Was Canceled");
        return;
      }

      if (res.error === null) {
        navigation.navigate("EditProfile");
        Alert.alert("Upload successful", "Your Profile Was Updated");
        setUser(res.body[0]);
      } else {
        console.log("ERROR", res.error);
        Alert.alert("Something Went Wrong");
      }

      return res;
    } else if (description === "UPLOAD_PROFILE_BANNER_") {
      const userId = supabase.auth.currentUser.id;

      const res = await supabase
        .from("profiles")
        .update({
          bannerImage: resp.secure_url,
          bannerImageType: postInfo.mediaType,
          bannerHeight: postInfo.height,
          bannerWidth: postInfo.width,
          username: username,
          displayName: displayname,
        })
        .eq("user_id", userId);

      if (canceled) {
        Alert.alert("Your Post Was Canceled");
        return;
      }

      if (res.error === null) {
        navigation.navigate("UserProfile");
        Alert.alert("Your Profile Was Updated");
        setUser(res.body[0]);
      } else {
        console.log("ERROR", res.error);
        Alert.alert("Something Went Wrong");
      }

      return res;
    } else {
      const userId = supabase.auth.currentUser.id;
      const res = await supabase.from("post").insert([
        {
          user_id: userId,
          description,
          media: resp.secure_url,
          mediaType: resp.resource_type,
          subsOnly: true,
          height: resp.height,
          width: resp.width,
        },
      ]);

      if (canceled) {
        Alert.alert("Your Post Was Canceled");
        return;
      }

      if (res.error === null) {
        navigation.goBack();
        Alert.alert("Upload successful", "Your Post Was Uploaded");
      } else {
        console.log("ERROR", res.error);
        Alert.alert("Something Went Wrong");
      }

      return res;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (postInfo === null) {
        await updateUserInfo();
      } else {
        await handleXHR();
      }
    };

    fetchData();

    return () => {
      navigation.navigate("Home");
    };
  }, [postInfo]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: scheme === "light" ? "#00A3FF" : "#111111",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {description === "UPLOAD_PROFILE_IMAGE_" ? (
          <Text
            style={{
              alignSelf: "center",
              color: "white",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            Updating Your Profile Image
          </Text>
        ) : description === "UPLOAD_PROFILE_BANNER_" ? (
          <Text
            style={{
              alignSelf: "center",
              color: "white",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            Updating your banner
          </Text>
        ) : (
          <Text
            style={{
              alignSelf: "center",
              color: "white",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            Uploading your post
          </Text>
        )}

        <LottieView
          style={{
            height: 50,
            width: 50,
          }}
          source={require("../assets/lottie/whiteLoader.json")}
          autoPlay
        />
      </View>
      <TouchableOpacity
        onPress={cancelUpload}
        style={{
          backgroundColor: scheme === "light" ? "black" : "white",
          width: screenWidth * 0.62,
          height: screenHeight * 0.035,
          justifyContent: "center",
          borderRadius: 10,
          top: screenHeight * 0.07,
          alignSelf: "center",
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
          Cancel Upload
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Uploading;
