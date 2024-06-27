import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";

export default function PostService() {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageData, setImageData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useUser();
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);

      const newFile = {
        uri: result.assets[0].uri,
        type: `image/${result.assets[0].uri.split(".").pop()}`,
        name: `image.${result.assets[0].uri.split(".").pop()}`,
      };

      console.log("newFile", newFile);
      setImageData(newFile);
    }
  };

  const handleXHR = async (serviceData) => {
    setModalVisible(true);

    const data = new FormData();
    data.append("file", imageData);
    data.append("upload_preset", "TizlyUpload");
    data.append("cloud_name", "doz01gvsj");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/doz01gvsj/upload", true);

    xhr.onload = () => handleUploadResponse(xhr, serviceData);
    xhr.onerror = handleUploadError;

    xhr.send(data);
  };

  const handleUploadResponse = async (xhr, serviceData) => {
    if (xhr.status === 200) {
      const resp = JSON.parse(xhr.responseText);
      const userId = supabase.auth.currentUser.id;

      const { data, error } = await supabase.from("services").insert([
        {
          user_id: userId,
          description: description,
          city: user.city,
          state: user.state,
          title: title,
          thumbnail: resp.secure_url,
          price: price,
        },
      ]);

      Alert.alert("Your Service Was Added");
      setModalVisible(false);
      setDescription();
      setThumbnail();
      setPrice();
      setTitle();
      setImageData();
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
  };

  const handleClear = async () => {
    console.log("CLEAR");
    setDescription();
    setImageData();
    setPrice();
    setThumbnail();
    setTitle();
  };

  const handleSubmit = async () => {
    const serviceData = {
      title,
      thumbnail,
      description,
      price,
    };

    if (!description || !imageData || !title || !thumbnail || !price) {
      Alert.alert("Please fill all fields.");
      return;
    }

    await handleXHR(serviceData);

    Keyboard.dismiss();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const LoadingModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Handle modal close if needed
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Uploading...</Text>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={dismissKeyboard}
        >
          <View>
            <Text style={styles.label}>Service Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter service name"
            />

            <Text style={styles.label}>Service Thumbnail</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {thumbnail ? (
                <Image source={{ uri: thumbnail }} style={styles.image} />
              ) : (
                <Text style={{ color: "grey" }}>Select an Image</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Service Description</Text>
            <TextInput
              style={styles.inputDesciption}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your service in detail, highlighting key features, benefits, and any unique aspects."
              multiline
            />

            <Text style={styles.label}>Service Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the price of the service"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <View style={{ paddingBottom: 50 }}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: "#46A05F",
                  width: width * 0.8,
                  height: height * 0.06,
                  padding: 12,
                  alignSelf: "center",
                  borderRadius: 13,
                  top: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-SemiBold",
                    alignSelf: "center",
                    fontSize: 18,
                    color: "white",
                  }}
                >
                  Post Service
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 450 }}>
              <TouchableOpacity
                onPress={handleClear}
                style={{
                  backgroundColor: "black",
                  width: width * 0.8,
                  height: height * 0.06,
                  padding: 12,
                  alignSelf: "center",
                  borderRadius: 13,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-SemiBold",
                    alignSelf: "center",
                    fontSize: 18,
                    color: "white",
                  }}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <LoadingModal />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  inputDesciption: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    height: 170,
    backgroundColor: "#F3F3F9",
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F3F3F9",
    marginBottom: 12,
  },
  imagePicker: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F3F9",
    height: 200,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 10,

    borderRadius: 10,
  },
});
