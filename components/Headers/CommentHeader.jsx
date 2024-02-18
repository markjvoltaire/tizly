import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Image,
  useColorScheme,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { getUser } from "../../services/user";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

export default function CommentHeader({ comment }) {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const { user } = useUser();
  const scheme = useColorScheme();

  const details = {
    user_id: comment.comment.userId,
  };

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const resp = await getUser(details);
        setUserDetails(resp.body);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        // Set loading to false once the request is complete
        setLoading(false);
      }
    };
    getUserDetail();
  }, []);

  return (
    <View>
      {loading ? (
        // Show loading indicator while fetching data
        <ActivityIndicator size="small" color="grey" />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", top: 10 }}>
          <Pressable
            onPress={() =>
              userDetails.user_id === user.user_id
                ? navigation.navigate("UserProfile")
                : navigation.navigate("ProfileDetail", {
                    userDetails,
                  })
            }
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                height: screenHeight * 0.03,
                width: screenWidth * 0.85,
                marginRight: screenWidth * 0.07,
                marginBottom: screenHeight * 0.025,
              }}
            >
              <Image
                style={{
                  height: screenHeight * 0.04,
                  width: screenWidth * 0.085,
                  borderRadius: 100,
                  marginLeft: 10,
                  backgroundColor: "grey",
                }}
                source={{ uri: userDetails.profileimage }}
              />

              <View
                style={{
                  marginLeft: 10,
                  paddingRight: screenWidth * 0.02,
                }}
              >
                <Text
                  style={{
                    color: scheme === "light" ? "black" : "white",
                    fontFamily: "Poppins-Bold",
                    fontSize: 14,
                    marginBottom: -3,
                  }}
                >
                  {userDetails.displayName}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontWeight: "600",
                    fontSize: 12,
                  }}
                >
                  @{userDetails.username}
                </Text>
              </View>
            </View>
          </Pressable>
          {/* Render other components using userDetails */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
