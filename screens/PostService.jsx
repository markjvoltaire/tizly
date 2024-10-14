import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
  Modal,
  Dimensions,
  Switch,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";

export default function PostService({ navigation }) {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageData, setImageData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [byHour, setByHour] = useState(false);
  const { user, setUser } = useUser();
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const [onBoard, setOnBoard] = useState(user.stripeAccountId);

  // Dropdown state management
  const [category, setCategory] = useState("Select a Category");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const categories = [
    "Car Detailing",
    "Home Cleaning",
    "Lawn Mowing",
    "Photography",
    "Personal Training",
    "Pet Grooming",
    "Videography",
    "Massage",
  ];

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setCategoryModalVisible(false);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this app to access your photos!");
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

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.cloudinary.com/v1_1/debru0cpu/image/upload",
      true
    );

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        handleUploadResponse(xhr, serviceData);
      } else {
        handleUploadError(xhr);
      }
    };

    xhr.onerror = () => handleUploadError(xhr);

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
          byHour: byHour,
          latitude: user.latitude,
          longitude: user.longitude,
          category: category,
        },
      ]);

      console.log("data", data);
      console.log("error", error);

      Alert.alert("Your Service Was Added");
      setModalVisible(false);
      setDescription("");
      setThumbnail(null);
      setPrice("");
      setTitle("");
      setImageData(null);
      setByHour(false);
      setCategory("Select a Category");
      return data;
    } else {
      console.log("Upload to Cloudinary failed.");
      handleUploadFailure();
      setModalVisible(false);
    }
  };

  const handleUploadError = () => {
    console.log("An error occurred during the upload to Cloudinary.");
    handleUploadFailure();
    setModalVisible(false);
  };

  const handleUploadFailure = () => {
    Alert.alert("An error occurred during the upload");
    setModalVisible(false);
  };

  const handleClear = () => {
    console.log("CLEAR");
    setDescription("");
    setImageData(null);
    setPrice("");
    setThumbnail(null);
    setTitle("");
    setByHour(false);
    setCategory("Select a Category");
  };

  const LoadingModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <LottieView
              autoPlay
              style={{ height: 300, width: 300, alignSelf: "center" }}
              source={require("../assets/lottie/3Dots.json")}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const handleSubmit = async () => {
    const serviceData = {
      title,
      thumbnail,
      description,
      price,
      byHour,
      category, // Add selected category here
    };

    if (
      !description ||
      !imageData ||
      !title ||
      !thumbnail ||
      !price ||
      category === "Select a Category"
    ) {
      Alert.alert("Please fill all fields.");
      return;
    }

    await handleXHR(serviceData);

    Keyboard.dismiss();
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
          onPress={Keyboard.dismiss}
        >
          <View>
            <Text style={styles.label}>Service Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter service name"
            />

            <Text style={styles.label}>Service Category</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  {
                    color: category === "Select a Category" ? "#ccc" : "black",
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>

            {/* Modal for category selection */}
            <Modal
              transparent={true}
              visible={categoryModalVisible}
              animationType="slide"
              onRequestClose={() => setCategoryModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.categoryOption}
                      onPress={() => handleCategorySelect(cat)}
                    >
                      <Text style={styles.categoryText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setCategoryModalVisible(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Rest of your form inputs like description, price, etc. */}

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
              style={styles.inputDescription}
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

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Charge by the hour</Text>
              <Switch value={byHour} onValueChange={setByHour} />
            </View>

            <View style={{ paddingBottom: 50 }}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: "#4A3AFF",
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

      {/* Modal for loading */}
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F3F3F9",
    marginBottom: 12,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  categoryOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  categoryText: {
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    color: "#FF0000",
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
});
