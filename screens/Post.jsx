import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";

import LottieView from "lottie-react-native";

export default function Post() {
  const [image, setImage] = useState(null);
  const { user, setUser } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [postInfo, setPostInfo] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(!user ? false : true);

  async function getUser(userid) {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userid)
      .single()
      .limit(1);

    return resp;
  }

  const pickImage = async () => {
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!photo.canceled) {
      setImage(photo.assets[0].uri);
      const newfile = {
        uri: photo.assets[0].uri,
        type: `test/${photo.assets[0].uri.split(".")[1]}`,
        name: `test.${photo.assets[0].uri.split(".")[1]}`,
        mediaType: photo.assets[0].type,
        height: photo.assets[0].height,
        width: photo.assets[0].width,
      };
      setPostInfo(newfile);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handlePickDifferentImage = () => {
    pickImage();
  };

  const handlePost = async () => {
    // Logic to handle posting the image
    await handleXHR(postInfo);
  };

  async function loginWithEmail() {
    // setModalLoader(true);
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    console.log("email", email);
    console.log("password", password);
    if (error) {
      Alert.alert(error.message);
    } else {
      console.log("user", user.id);
      const resp = await getUser(user.id);
      console.log("resp", resp);
      supabase.auth.setAuth(user.access_token);
      console.log("resp", resp);
      setUser(resp.body);
    }
  }

  const logUserIn = () => {
    loginWithEmail();
    // Add your login logic here
  };

  const handleLoginModal = () => {
    setModalVisible(true);
    // Add your login logic here
  };
  const handleUploadError = () => {
    console.log("An error occurred during the upload to Cloudinary.");
    handleUploadFailure();
  };

  let xhr; // XHR object variable

  const handleXHR = async (newfile) => {
    console.log("newfile", newfile);
    setUploading(true);
    const data = new FormData();
    data.append("file", newfile);
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
      }
    });

    xhr.onload = () => handleUploadResponse(xhr);
    xhr.onerror = handleUploadError;

    xhr.send(data);
  };

  const handleUploadFailure = () => {
    Alert.alert("An error occurred during the upload");
    setUploading(false);
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

  async function uploadToSupabase(resp) {
    const userId = supabase.auth.currentUser.id;

    const res = await supabase.from("post").insert([
      {
        user_id: userId,

        media: resp.secure_url,
        mediaType: resp.resource_type,

        height: resp.height,
        width: resp.width,
      },
    ]);

    if (res.error === null) {
      Alert.alert("Upload successful");
      setImage(null);
      setPostInfo(null);
      setUploading(false);
    } else {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
      setUploading(true);
    }

    return res;
  }

  // IF NO USER IS LOGGED IN
  if (isLoggedIn === false) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{}}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: "AirbnbCereal-Bold",
              marginBottom: 20,
            }}
          >
            Post
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "AirbnbCereal-Medium",
              marginBottom: 10,
              color: "#717171",
            }}
          >
            Log in to upload a post
          </Text>
          <Text
            style={{
              fontSize: 20,

              marginBottom: 20,
              color: "#717171",
            }}
          >
            Once you login, you'll be able to add post
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 5,
              alignSelf: "stretch",
            }}
            onPress={handleLoginModal}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "600",
                fontFamily: "AirbnbCereal-Bold",
                textAlign: "center",
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "white",
              borderRadius: 10,
              top: 200,
              padding: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                marginBottom: 15,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Login or Sign Up
            </Text>
            <TextInput
              style={{
                height: 40,
                width: "100%",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 12,
                marginBottom: 10,
                paddingHorizontal: 10,
                fontFamily: "alata",
                borderWidth: 1,
                borderColor: "#BBBBBB",
                backgroundColor: "#F3F3F9",
              }}
              placeholderTextColor="grey"
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={{
                height: 40,
                width: "100%",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 10,
                paddingHorizontal: 10,
                fontFamily: "alata",
                borderWidth: 1,
                borderColor: "#BBBBBB",
                backgroundColor: "#F3F3F9",
              }}
              placeholderTextColor="grey"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#007AFF",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 5,
                alignSelf: "stretch",
              }}
              onPress={logUserIn}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: "600",
                  fontFamily: "AirbnbCereal-Bold",
                  textAlign: "center",
                }}
              >
                Log In
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ marginRight: 5 }}>Don't have an account?</Text>
              <Button
                title="Sign Up"
                onPress={() => {
                  // Add your sign up functionality here
                }}
              />
            </View>
            <Button
              title="Not Yet"
              onPress={() => setModalVisible(!modalVisible)}
              color="grey"
            />
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.selectedImage} />
        ) : (
          <Text style={styles.imagePickerText}>Add Image</Text>
        )}
      </TouchableOpacity>

      {/* Remove Button */}
      {image && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemoveImage}
        >
          <Text style={styles.removeButtonText}>Remove Image</Text>
        </TouchableOpacity>
      )}

      {/* Pick Different Image Button */}
      {image && (
        <TouchableOpacity
          style={styles.pickDifferentImageButton}
          onPress={handlePickDifferentImage}
        >
          <Text style={styles.pickDifferentImageButtonText}>
            Pick Different Image
          </Text>
        </TouchableOpacity>
      )}

      {/* Post Button */}
      <TouchableOpacity
        style={[
          styles.postButton,
          { backgroundColor: image ? "#1da1f2" : "#ccc" },
        ]}
        onPress={handlePost}
        disabled={!image}
      >
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>

      <Modal animationType="slide" visible={uploading}>
        <Text
          style={{
            color: "black",
            top: 290,
            fontSize: 20,
            alignSelf: "center",
            fontWeight: "600",
          }}
        >
          Uploading
        </Text>
        <LottieView
          style={{
            height: 530,
            width: 530,
            top: 200,
            alignSelf: "center",
          }}
          source={require("../assets/lottie/airplaneLoading.json")}
          autoPlay
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  imagePicker: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
  },
  imagePickerText: {
    fontSize: 16,
    color: "#1da1f2",
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    marginTop: 20, // Increased margin
    alignItems: "center",
  },
  removeButtonText: {
    fontSize: 16,
    color: "#ff0000",
    textDecorationLine: "underline",
  },
  pickDifferentImageButton: {
    marginTop: 20, // Increased margin
    alignItems: "center",
  },
  pickDifferentImageButtonText: {
    fontSize: 16,
    color: "#1da1f2",
    textDecorationLine: "underline",
  },
  postButton: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 16,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
