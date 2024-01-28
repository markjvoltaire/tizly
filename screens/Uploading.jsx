import React, { useEffect, useState, useRef } from "react";
import { Alert, SafeAreaView, StyleSheet, Text } from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";

const Uploading = ({ route, navigation }) => {
  const { user } = useUser();
  const { postInfo, description } = route.params;

  const video = useRef(null);
  const [postProgress, setPostProgress] = useState("");
  const [canceled, setCanceled] = useState(false);

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
      console.log("resp", resp);
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

  async function uploadToSupabase(resp) {
    console.log("starting supabase");

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
      console.log("resp", resp);
    } else {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    }

    console.log("FROM SUPABASE UPLOAD", res);
    return res;
  }

  useEffect(() => {
    handleXHR();
    return () => {
      navigation.navigate("Home");
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Text style={{ alignSelf: "center" }}>Uploading</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Uploading;
