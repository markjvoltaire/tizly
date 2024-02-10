import React, { useState, useRef } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import { supabase } from "../services/supabase";

import LottieView from "lottie-react-native";
import ProfileInformation from "../components/ProfileDetails/ProfileInformation";

export default function EditProfile({ route }) {
  const { user, setUser } = useUser();
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;
  const navigation = useNavigation();
  const [canceled, setCanceled] = useState(false);
  const [pressCount, setPressCount] = useState(0);

  const [status, setStatus] = React.useState({});
  const video = useRef(null);

  // State for storing input values
  const [displayname, setDisplayname] = useState(user.displayName);

  const [username, setUsername] = useState(user.username);
  const [imagePreview, setImagePreview] = useState(user.profileimage);
  const [bannerPreview, setBannerPreview] = useState(user.bannerImage);

  const [postInfo, setPostInfo] = useState([]);
  const [bannerType, setBannerType] = useState(user.bannerImageType);

  const [profileImageModal, setProfileImageModal] = useState(false);
  const [profileBannerModal, setProfileBannerModal] = useState(false);

  const pickProfileImage = async () => {
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [9, 16],
      canAskAgain: true,
      quality: 0.6,
    });

    if (!photo.canceled) {
      let newfile = {
        uri: photo.assets[0].uri,
        type: `test/${photo.assets[0].uri.split(".")[1]}`,
        name: `test.${photo.assets[0].uri.split(".")[1]}`,
        mediaType: photo.assets[0].type,
        height: photo.assets[0].height,
        width: photo.assets[0].width,
      };

      setPostInfo(newfile);
      setImagePreview(photo.assets[0].uri);
      setProfileImageModal(true);
      return newfile;
    }
  };

  const pickBanner = async () => {
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [9, 16],
      canAskAgain: true,
      quality: 0.6,
      allowsEditing: false,
      videoMaxDuration: 8,
    });

    if (!photo.canceled) {
      let newfile = {
        uri: photo.assets[0].uri,
        type: `test/${photo.assets[0].uri.split(".")[1]}`,
        name: `test.${photo.assets[0].uri.split(".")[1]}`,
        mediaType: photo.assets[0].type,
        height: photo.assets[0].height,
        width: photo.assets[0].width,
      };

      setPostInfo(newfile);
      setBannerPreview(photo.assets[0].uri);
      setBannerType(photo.assets[0].type);
      setProfileBannerModal(true);
      return newfile;
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
      Alert.alert("Your changes were saved");
      setUser(res.body[0]);
    } else {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    }

    return res;
  }

  const updateProfile = async () => {
    const description = "UPLOAD_PROFILE_IMAGE_";
    if (
      imagePreview === user.profileimage &&
      bannerPreview === user.bannerImage &&
      username === user.username &&
      displayname === user.displayName
    ) {
      Alert.alert("No changes were made");
      return;
    } else if (
      (imagePreview === user.profileimage &&
        bannerPreview === user.bannerImage &&
        username !== user.username) ||
      displayname !== user.displayName
    ) {
      updateUserInfo();
      return;
    }

    try {
      setProfileImageModal(false);
      // If the uploadStatus function completes without throwing an error,
      // it is considered successful. You can show a success alert here.
      navigation.navigate("Uploading", {
        description,
        postInfo,
        displayname,
        username,
      });

      setPostInfo(null);
    } catch (error) {
      // Handle any errors that may occur during the upload process.
      console.error("Error uploading post:", error);
      // Optionally, show an error alert.
      alert("Upload failed. Please try again.");
    }
  };

  const updateBanner = async () => {
    const description = "UPLOAD_PROFILE_BANNER_";

    if (
      imagePreview === user.profileimage &&
      bannerPreview === user.bannerImage
    ) {
      Alert.alert("No changes were made");
      return;
    }
    try {
      setProfileBannerModal(false);
      // If the uploadStatus function completes without throwing an error,
      // it is considered successful. You can show a success alert here.
      navigation.navigate("Uploading", {
        description,
        postInfo,
        displayname,
        username,
      });

      setPostInfo(null);
    } catch (error) {
      // Handle any errors that may occur during the upload process.
      console.error("Error uploading post:", error);
      // Optionally, show an error alert.
      alert("Upload failed. Please try again.");
    }
  };

  const closeProfileModal = () => {
    setImagePreview(user.profileimage);
    setBannerPreview(user.bannerImage);
    setBannerType(user.bannerImageType);
    setProfileImageModal(false);
  };

  const closeBannerModal = () => {
    setBannerPreview(user.bannerImage);
    setBannerType(user.bannerImageType);
    setProfileBannerModal(false);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              borderBottomWidth: 0.9,
              borderBottomColor: "#ccc",
            }}
          >
            <Pressable onPress={() => navigation.goBack()}>
              <Image
                style={{ height: 20, width: 20, left: 10 }}
                source={require("../assets/Back.png")}
              />
            </Pressable>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins-Bold",
              }}
            >
              Edit Profile
            </Text>
            <Pressable onPress={() => updateProfile()}>
              <Image
                style={{ height: 20, width: 20, right: 10 }}
                source={require("../assets/Save.png")}
              />
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 20,
            }}
          >
            {/* Circle */}
            <View style={{ alignItems: "center" }}>
              <Text style={{ marginBottom: 5, fontFamily: "Poppins-SemiBold" }}>
                Profile Image
              </Text>
              <Pressable onPress={() => pickProfileImage()}>
                <Image
                  source={{ uri: imagePreview }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: "grey",
                  }}
                />
              </Pressable>
            </View>

            {/* Rectangle */}
            <Pressable onPress={() => pickBanner()}>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ marginBottom: 5, fontFamily: "Poppins-SemiBold" }}
                >
                  Profile Banner
                </Text>
                {bannerType === "video" ? (
                  <>
                    <Video
                      isMuted
                      isLooping
                      ref={video}
                      shouldPlay
                      source={{ uri: bannerPreview }}
                      resizeMode="cover"
                      style={{
                        width: 140,
                        height: 200,
                        backgroundColor: "grey",
                        borderRadius: 10,
                      }}
                      onPlaybackStatusUpdate={(status) =>
                        setStatus(() => status)
                      }
                    />
                    <View
                      style={{
                        opacity: 0.5,
                        position: "absolute",
                        backgroundColor: "black",
                        width: 140,
                        height: 200,
                        top: height * 0.03,
                        borderRadius: 10,
                      }}
                    ></View>
                  </>
                ) : (
                  <>
                    <Image
                      source={{ uri: bannerPreview }}
                      style={{
                        width: 140,
                        height: 200,
                        backgroundColor: "grey",
                        borderRadius: 10,
                      }}
                    />
                    <View
                      style={{
                        opacity: 0.5,
                        position: "absolute",
                        backgroundColor: "black",
                        width: 140,
                        height: 200,
                        top: height * 0.03,
                        borderRadius: 10,
                      }}
                    ></View>
                  </>
                )}
              </View>
            </Pressable>
          </View>
          <View style={{ margin: 30, top: 10 }}>
            <TextInput
              style={styles.input}
              value={displayname}
              placeholder="Display Name"
              onChangeText={(text) => setDisplayname(text)}
              placeholderTextColor={"#929292"}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={(text) => setUsername(text)}
              placeholderTextColor={"#929292"}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      {/* Profile Image Modal */}
      <Modal animationType="slide" visible={profileImageModal}>
        <SafeAreaView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              borderBottomWidth: 0.9,
              borderBottomColor: "#ccc",
            }}
          >
            <Pressable onPress={() => closeProfileModal()}>
              <Image
                style={{ height: 20, width: 20, left: 10 }}
                source={require("../assets/Back.png")}
              />
            </Pressable>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins-Bold",
              }}
            >
              Save This Profile Image?
            </Text>
            <Pressable onPress={() => updateProfile()}>
              <Image
                style={{ height: 20, width: 20, right: 10 }}
                source={require("../assets/Save.png")}
              />
            </Pressable>
          </View>
          <View style={{ alignSelf: "center" }}>
            <Image
              style={{
                height: 200,
                width: 200,
                borderRadius: 100,
                top: height * 0.16,
              }}
              source={{ uri: imagePreview }}
            />
          </View>
        </SafeAreaView>
      </Modal>
      {/* Profile Banner Modal */}
      <Modal animationType="slide" visible={profileBannerModal}>
        <View style={{ alignSelf: "center" }}>
          {bannerType === "video" ? (
            <>
              <Video
                isLooping
                ref={video}
                shouldPlay
                source={{ uri: bannerPreview }}
                style={{
                  width: width,
                  height: height,
                  backgroundColor: "black",
                  borderRadius: 10,
                }}
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              />
              <View
                style={{
                  opacity: 0.5,
                  position: "absolute",
                  backgroundColor: "black",
                  width: width,
                  height: height,

                  borderRadius: 10,
                }}
              ></View>
            </>
          ) : (
            <>
              <Image
                source={{ uri: bannerPreview }}
                style={{
                  width: width,
                  height: height,
                  backgroundColor: "grey",
                  borderRadius: 10,
                }}
              />
              <View
                style={{
                  opacity: 0.5,
                  position: "absolute",
                  backgroundColor: "black",
                  width: width,
                  height: height,

                  borderRadius: 10,
                }}
              ></View>
            </>
          )}
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,

              bottom: 800,
            }}
          >
            <Pressable onPress={() => closeBannerModal()}>
              <Image
                style={{ height: 30, width: 30, left: 10 }}
                source={require("../assets/BackWhite.png")}
              />
            </Pressable>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins-Bold",
                color: "white",
              }}
            >
              Save This Banner?
            </Text>
            <Pressable onPress={() => updateBanner()}>
              <Image
                style={{ height: 30, width: 30, right: 10 }}
                source={require("../assets/SaveWhite.png")}
              />
            </Pressable>
          </View>
          <ProfileInformation userDetails={user} />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: "#F3F3F9",
    borderRadius: 10,
    fontFamily: "Poppins-SemiBold",
  },
});
