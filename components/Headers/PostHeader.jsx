import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  useColorScheme,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getUser } from "../../services/user";
import { useUser } from "../../context/UserContext";

export default function PostHeader({ post, navigation }) {
  const [userDetails, setUserDetails] = useState({});
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  const postDate = new Date(post.date);
  const currentDate = new Date();
  const timeDifference = currentDate - postDate;
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  const scheme = useColorScheme();

  const formatTimeAgo = (value, unit) => {
    return value === 1 ? `1 ${unit} ago` : `${value} ${unit}s ago`;
  };

  let formattedDate;

  if (daysDifference > 7) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = postDate.getMonth();
    const monthName = monthNames[month];
    formattedDate = `${monthName} ${postDate.getDate()}  ${postDate.getFullYear()}`;
  } else if (daysDifference > 0) {
    formattedDate = formatTimeAgo(daysDifference, "day");
  } else if (hoursDifference > 0) {
    formattedDate = formatTimeAgo(hoursDifference, "hour");
  } else if (minutesDifference > 0) {
    formattedDate = formatTimeAgo(minutesDifference, "minute");
  } else {
    formattedDate = "Just now";
  }

  const { user } = useUser();

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
      <View
        style={{ backgroundColor: scheme === "light" ? "white" : "#080A0B" }}
      >
        <Text style={{ color: scheme === "dark" ? "white" : "black" }}>
          PLEASE WAIT
        </Text>
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
              paddingRight: width * 0.08,
            }}
          >
            <Text
              style={{
                color: "#121212",
                fontFamily: "Poppins-Bold",
                fontSize: 13,
                marginBottom: -3,
                color: scheme === "light" ? "black" : "white",
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
