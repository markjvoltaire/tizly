import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";
import * as ImagePicker from "expo-image-picker";

export default function EditProfile({ navigation }) {
  const { user, setUser } = useUser();
  const [imagePreview, setImagePreview] = useState(user.profileimage);
  const [imageData, setImageData] = useState(false);

  const [name, setName] = useState(user.username);

  const pickPost = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [9, 16],
      canAskAgain: true,
      quality: 0.1,
      allowsEditing: false,
    };

    const photo = await ImagePicker.launchImageLibraryAsync(options);

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

      setImagePreview(newfile.uri);
      setImageData(newfile);
    }
  };

  let xhr; // XHR object variable

  const handleXHR = async () => {
    const data = new FormData();
    data.append("file", imageData);
    data.append("upload_preset", "TizlyUpload");
    data.append("cloud_name", "doz01gvsj");

    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/doz01gvsj/upload", true);

    xhr.onload = () => handleUploadResponse(xhr);
    xhr.onerror = handleUploadError;

    xhr.send(data);
  };

  const handleUploadResponse = async (xhr) => {
    const userId = supabase.auth.currentUser.id;

    if (xhr.status === 200) {
      const resp = JSON.parse(xhr.responseText);

      if (user.username == !name) {
        const res = await supabase
          .from("profiles")
          .update({
            profileimage: resp.secure_url,
            usename: name,
          })
          .eq("user_id", userId);

        if (res.error === null) {
          setUser(res.body[0]);
        } else {
          console.log("ERROR", res.error);
          Alert.alert("Something Went Wrong");
        }
      }

      await editProfileImage(resp);
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
    // navigation.goBack();
  };

  const cancelUpload = () => {
    if (xhr) {
      xhr.abort(); // Abort the XHR request
      setCanceled(true); // Set the canceled state to true
      setCanceled(false);
      navigation.goBack();
    }
  };

  const editProfileImage = async (resp) => {
    const userId = supabase.auth.currentUser.id;
    const res = await supabase
      .from("profiles")
      .update({
        profileimage: resp.secure_url,
      })
      .eq("user_id", userId);

    if (res.error === null) {
      setUser(res.body[0]);
    } else {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    }
  };

  const editUsername = async () => {
    const userId = supabase.auth.currentUser.id;
    const res = await supabase
      .from("profiles")
      .update({
        username: name,
      })
      .eq("user_id", userId);

    if (res.error === null) {
      setUser(res.body[0]);
    } else {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    }
  };

  async function editProfile() {
    const userId = supabase.auth.currentUser.id;

    if (!imageData) {
      if (user.username === name) {
        Alert.alert("No change was made");
      } else {
        await editUsername();

        Alert.alert("Your changes were saved");
        navigation.goBack();
      }
    }

    if (imageData && user.username !== name) {
      await handleXHR();
      await editUsername();
      Alert.alert("Your changes were saved");
      navigation.goBack();

      return;
    }
    if (imageData) {
      await handleXHR();
      Alert.alert("Your changes were saved");
      navigation.goBack();
      return;
    }
  }

  return (
    <View style={{ padding: 16, backgroundColor: "white", flex: 1 }}>
      <TouchableOpacity
        onPress={() => pickPost()}
        style={{ alignItems: "center" }}
      >
        <Image
          source={{ uri: imagePreview }}
          style={{
            width: 124,
            height: 124,
            marginRight: 10,
            borderRadius: 100,
            marginBottom: 20,
            backgroundColor: "grey",
            borderWidth: 1,
            borderColor: "green",
          }}
        />
        <Text style={{ fontSize: 13, fontWeight: "400", color: "#313131" }}>
          Change Profile Image
        </Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <Text style={styles.optionText}>Name</Text>

      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="grey"
        style={{
          height: 40,
          width: 350,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 12,
          marginBottom: 20,
          paddingHorizontal: 10,
          fontFamily: "gilroy",
          borderWidth: 1,
          borderColor: "#BBBBBB",
          backgroundColor: "#F3F3F9",
          top: 10,
          marginBottom: 50,
        }}
        value={name}
        onChangeText={(text) => {
          setName(text);
        }}
      />

      <TouchableOpacity onPress={() => editProfile()} style={styles.button}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  separator: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 16 },

  optionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#313131",
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
