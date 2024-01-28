import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import PostPreview from "./PostPreview";

export default function NotificationHeader({ userDetails, item }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation(); // Use useNavigation hook to get the navigation prop
  const [modalVisible, setModalVisible] = useState(false);

  const goToProfile = () => {
    navigation.navigate("ProfileDetail", { userDetails }); // Navigate to the "ProfileDetail" screen
  };

  const goToPost = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const date = new Date(item.created_at);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  let formattedDate;

  if (daysDifference > 7) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = date.getMonth();
    const monthName = monthNames[month];
    formattedDate = `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
  } else if (daysDifference > 0) {
    formattedDate =
      daysDifference === 1 ? "1 day ago" : `${daysDifference} days ago`;
  } else if (hoursDifference > 0) {
    formattedDate =
      hoursDifference === 1 ? "1 hour ago" : `${hoursDifference} hours ago`;
  } else if (minutesDifference > 0) {
    formattedDate =
      minutesDifference === 1
        ? "1 minute ago"
        : `${minutesDifference} minutes ago`;
  } else {
    formattedDate = "Just now";
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center", top: 1 }}>
      {/* USERDETAILS View */}
      <Pressable onPress={() => goToPost()}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            top: 10,
            height: screenHeight * 0.03,
            width: screenWidth * 0.85,
            marginRight: screenWidth * 0.07,
            marginBottom: screenHeight * 0.025,
          }}
        >
          <Pressable onPress={() => goToProfile()}>
            <Image
              style={{
                height: screenHeight * 0.04,
                width: screenWidth * 0.095,
                borderRadius: 100,
                marginLeft: 10,
                backgroundColor: "grey",
                aspectRatio: 1,
              }}
              source={{ uri: userDetails.profileimage }}
            />
          </Pressable>

          <View
            style={{
              marginLeft: 10,
              paddingRight: screenWidth * 0.02,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                fontSize: 12,
                width: screenWidth,
              }}
            >
              {userDetails.username} commented: {item.comment}
            </Text>
          </View>
        </View>
        <Text
          style={{
            top: 1,
            color: "#979797",
            fontFamily: "Poppins-SemiBold",
            fontSize: 12,
            left: 10,
          }}
        >
          {formattedDate}
        </Text>
      </Pressable>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          onPress={() => closeModal()}
        >
          <View
            style={{
              width: screenWidth,
              height: screenHeight,
              backgroundColor: "black",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              opacity: 0.9,
              padding: 20,
              alignItems: "center",
            }}
          >
            {/* Your modal Background */}
          </View>
          <View
            style={{
              position: "absolute",
              bottom: screenHeight * 0.3,
              justifyContent: "center",
            }}
          >
            {item.mediaType === "image" ? (
              <Image
                resizeMode="contain"
                style={{
                  aspectRatio: 1,
                  height: screenHeight * 0.4,
                  borderRadius: 10,
                }}
                source={{ uri: item.media }}
              />
            ) : item.mediaType === "status" ? (
              <View
                style={{
                  backgroundColor: "white",
                  bottom: screenHeight * 0.1,
                  height: screenHeight * 0.3,
                  width: screenWidth * 0.7,
                  justifyContent: "center",
                  borderRadius: 10,
                }}
              >
                <Text style={{ alignSelf: "center" }}>{item.description}</Text>
              </View>
            ) : (
              <Text>VIDEO</Text>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* PostPreview */}
      <View
        style={{
          height: screenHeight * 0.03,
          width: screenWidth * 0.07,
          justifyContent: "center",
          bottom: screenHeight * 0.02,
          alignItems: "center",
          right: screenWidth * 0.03,
        }}
      >
        <TouchableOpacity onPress={() => goToPost()}>
          <PostPreview item={item} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
