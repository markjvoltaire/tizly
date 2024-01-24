import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getUser } from "../../services/user";
import { useUser } from "../../context/UserContext";

export default function PostHeader({ post, navigation }) {
  const [userDetails, setUserDetails] = useState({});
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;
  const { user, setUser } = useUser();

  const handlePress = () => {
    if (user.user_id === userDetails.user_id) {
      navigation.navigate("UserProfile");
    }

    if (user.user_id !== userDetails.user_id) {
      navigation.navigate("ProfileDetail", { userDetails });
    }
  };

  useEffect(() => {
    const getUserDetail = async () => {
      const resp = await getUser(post);

      setUserDetails(resp.body);
      try {
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    getUserDetail();
  }, []);

  if (userDetails === null) {
    return (
      <View style={{ backgroundColor: "white" }}>
        <Text>PLEASE WAIT</Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center", top: 10 }}>
      {/* USERDETAILS View */}
      <Pressable onPress={() => handlePress()}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            height: height * 0.03,
            width: width * 0.85,
            marginRight: width * 0.07,
            marginBottom: height * 0.025,
          }}
        >
          <Image
            style={{
              height: height * 0.04,
              width: width * 0.085,
              borderRadius: 100,
              marginLeft: 10,
              backgroundColor: "grey",
            }}
            source={{ uri: userDetails.profileimage }}
          />

          <View
            style={{
              marginLeft: 10,
              paddingRight: width * 0.02,
            }}
          >
            <Text
              style={{
                color: "#121212",
                fontFamily: "Poppins-Bold",
                fontSize: 13,
                marginBottom: -3,
              }}
            >
              {userDetails.displayName}
            </Text>
            <Text
              style={{
                color: "grey",
                fontWeight: "600",
                fontSize: 11,
              }}
            >
              @{userDetails.username}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
