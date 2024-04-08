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
  Button,
  SafeAreaView,
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
  const [displayname, setDisplayname] = useState(user.username);
  const [selectedType, setSelectedType] = useState(user.profession);
  const [accountTypeModal, setAccountTypeModal] = useState(false);
  const [uploadingAvi, setUploadinAvi] = useState(false);
  const professions = [
    { id: 1, profession: "Catering" },
    { id: 2, profession: "Barber" },
    { id: 3, profession: "Photographer" },
    { id: 4, profession: "Fitness" },
    { id: 5, profession: "Make Up Artist" },
    { id: 6, profession: "Home Improvement" },
    { id: 7, profession: "Visual Media" },
    { id: 8, profession: "Hair Stylist" },
    { id: 9, profession: "DJ" },
    { id: 10, profession: "Mechanic" },
    { id: 11, profession: "Bartender" },
    { id: 12, profession: "Videographer" },
  ];

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  async function editProfessionType(item) {
    const userId = supabase.auth.currentUser.id;
    const res = await supabase
      .from("profiles")
      .update({
        profession: item.profession,
      })
      .eq("user_id", userId);

    if (res.error === null) {
      setUser(res.body[0]);
    } else {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    }

    return res;
  }

  const handleSave = () => {
    // Implement save logic here
    updateUserInfo();
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

  async function updateUserInfo() {
    const userId = supabase.auth.currentUser.id;
    const res = await supabase
      .from("profiles")
      .update({
        username: displayname,
        bio: bio,
      })
      .eq("user_id", userId);

    if (res.error === null) {
      Alert.alert("Your changes were saved");
      setUser(res.body[0]);
    } else {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    }

    return res;
  }

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
          <Text style={{ fontWeight: "600", fontSize: 20, paddingBottom: 10 }}>
            Name
          </Text>
          <TextInput
            value={displayname}
            onChangeText={setDisplayname}
            placeholderTextColor="#999"
            style={styles.input}
            placeholder="Name"
          />

          {/* <TextInput
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#999"
            style={styles.input}
            placeholder="Location"
          /> */}
          {user.type === "business" ? (
            <>
              {/* Profession Type  */}
              <Text
                style={{ fontWeight: "600", fontSize: 20, paddingBottom: 10 }}
              >
                Profession Type
              </Text>
              <TouchableOpacity
                onPress={() => setAccountTypeModal(true)}
                style={styles.typeButton}
              >
                <Text style={styles.typeButtonText}>{selectedType}</Text>
              </TouchableOpacity>
            </>
          ) : null}
          {/* Bio Input */}
          <Text style={{ fontWeight: "600", fontSize: 20, paddingBottom: 10 }}>
            Profile Description
          </Text>
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

      <Modal animationType="slide" visible={accountTypeModal}>
        <SafeAreaView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 20,
              fontWeight: "600",
              marginLeft: 10, // Adjust margin as needed
            }}
          >
            Select Profession Type
          </Text>
        </SafeAreaView>

        <View style={{ top: 50 }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 10,
              left: 5,
              top: 1,
            }}
          >
            {professions.map((item) => (
              <View
                key={item.id}
                style={{
                  flexBasis: "33.33%",
                  marginBottom: 50,
                  paddingRight: 10,
                }}
              >
                <View>
                  <TouchableOpacity
                    onPress={() => editProfessionType(item)}
                    style={{
                      backgroundColor: "white",
                      alignItems: "center",
                      height: 50,
                      justifyContent: "center",
                      borderRadius: 9,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: "black",
                      }}
                    >
                      {item.profession}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => setAccountTypeModal(false)}
            style={{
              backgroundColor: "#007AFF",
              width: 270,
              height: 50,
              justifyContent: "center", // Align text vertically
              alignItems: "center", // Align text horizontally
              alignSelf: "center",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

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
          Updating Profile
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

  typeButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    width: "100%",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  inner: {
    flex: 1,
    justifyContent: "center",

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
    fontWeight: "500",
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
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
