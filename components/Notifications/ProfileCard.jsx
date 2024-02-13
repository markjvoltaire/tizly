import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  Alert,
  Pressable,
  useColorScheme,
} from "react-native";
import { supabase } from "../../services/supabase";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";

export default function ProfileCard({ userDetails }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { user } = useUser();
  const scheme = useColorScheme();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const handlePress = () => {
    if (user.user_id === userDetails.user_id) {
      navigation.navigate("UserProfile");
    }

    if (user.user_id !== userDetails.user_id) {
      navigation.navigate("ProfileDetail", { userDetails: userDetails });
    }
  };

  return (
    <>
      <Pressable onPress={() => handlePress()}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            top: 12,
            paddingBottom: 30,
          }}
        >
          <Animated.Image
            style={{
              height: 30,
              width: 30,
              borderRadius: 100,
              marginLeft: 10,
              opacity: fadeAnim,
              backgroundColor: "grey",
            }}
            source={{ uri: userDetails.profileimage }}
          />
          <View style={{ marginRight: 10, left: 10 }}>
            <Animated.Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 11,
                marginBottom: -2,
                opacity: fadeAnim,
                color: scheme === "light" ? "black" : "white",
              }}
            >
              {userDetails.displayName}
            </Animated.Text>
            <Animated.Text
              style={{
                fontWeight: "600",
                fontSize: 11,
                opacity: fadeAnim,
                color: "grey",
              }}
            >
              @{userDetails.username}
            </Animated.Text>
          </View>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({});
