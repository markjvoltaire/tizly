import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { useUser } from "../context/UserContext";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../services/supabase";
import LottieView from "lottie-react-native";

export default function EditProfile({ navigation }) {
  const { user, setUser } = useUser();
  const inputRef = useRef(null);
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [type, setType] = useState(user.type);
  const [bio, setBio] = useState(user.bio);
  const [imagePreview, setImagePreview] = useState(user.profileimage);

  const [uploadingAvi, setUploadinAvi] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSave = () => {
    // Implement save logic here
  };

  const pickProfileImage = async () => {
    try {
      const photo = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [9, 16],
        canAskAgain: true,
        quality: 0.5,
      });

      if (photo.canceled) {
        // If the user cancels image selection
        return null;
      }

      const newfile = {
        uri: photo.assets[0].uri,
        type: `test/${photo.assets[0].uri.split(".")[1]}`,
        name: `test.${photo.assets[0].uri.split(".")[1]}`,
        mediaType: photo.assets[0].type,
        height: photo.assets[0].height,
        width: photo.assets[0].width,
      };
      setUploadinAvi(true);
      await handleXHR(newfile); // Pass newfile directly to handleXHR

      return newfile;
    } catch (error) {
      console.error("Error picking profile image:", error);
      return null;
    }
  };
  let xhr; // XHR object variable

  const handleXHR = async (newfile) => {
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

    const res = await supabase
      .from("profiles")
      .update({
        profileimage: resp.secure_url,
      })
      .eq("user_id", userId);

    if (res.error === null) {
      //   Alert.alert("Upload successful", "Your Profile Was Updated");
      setImagePreview(res.body[0].profileimage);
      setUser(res.body[0]);
      setUploadinAvi(false);
    } else {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
      setUploadinAvi(false);
    }

    return res;
  }

  const handleUploadError = () => {
    console.log("An error occurred during the upload to Cloudinary.");
    handleUploadFailure();
  };

  const handleUploadFailure = () => {
    Alert.alert("An error occurred during the upload");
    setUploadinAvi(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.inner}>
          {/* Profile Image */}
          <TouchableOpacity onPress={() => pickProfileImage()}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: imagePreview }}
                style={styles.profileImage}
              />
              <Text style={styles.changePhotoText}>Change Profile Photo</Text>
            </View>
          </TouchableOpacity>

          {/* Name Input */}
          <TextInput
            value={user.displayName}
            onChangeText={setName}
            placeholderTextColor="#999"
            style={styles.input}
            placeholder="Name"
          />

          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#999"
            style={styles.input}
            placeholder="Location"
          />

          {/* Type (Business or Individual) */}
          <TextInput
            value={user.type}
            onChangeText={setType}
            placeholderTextColor="#999"
            style={styles.input}
            placeholder="Type (Business or Individual)"
          />

          {/* Bio Input */}
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholderTextColor="#999"
            style={[styles.input, styles.bioInput]}
            placeholder="Bio"
            multiline
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      <Modal animationType="slide" visible={uploadingAvi}>
        <Text
          style={{
            color: "black",
            top: 290,
            fontSize: 20,
            alignSelf: "center",
            fontWeight: "600",
          }}
        >
          Updating Profile Image
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
    bottom: 50,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "grey",
  },
  changePhotoText: {
    color: "#318bfb",
    marginTop: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
    width: "100%",
  },
  bioInput: {
    height: 60,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#318bfb",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
