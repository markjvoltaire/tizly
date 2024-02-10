import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  Alert,
  Pressable,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../services/supabase";

export default function ProfileInformation({ userDetails }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modal, setModal] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          bottom: screenHeight * 0.2,
        }}
      >
        <Pressable onPress={() => setModal(true)}>
          <Animated.Image
            style={{
              height: screenHeight * 0.06,
              width: screenWidth * 0.13,
              borderRadius: 100,
              marginLeft: 10,
              opacity: fadeAnim,
              backgroundColor: "grey",
            }}
            source={{ uri: userDetails.profileimage }}
          />
        </Pressable>
        <View style={{ marginRight: 10, left: 10 }}>
          <Animated.Text
            style={{
              color: "white",
              fontFamily: "Poppins-Bold",
              fontSize: 20,
              marginBottom: -2,
              opacity: fadeAnim,
            }}
          >
            {userDetails.displayName}
          </Animated.Text>
          <Animated.Text
            style={{
              color: "#CECECE",
              fontWeight: "600",
              fontSize: 16,
              opacity: fadeAnim,
            }}
          >
            @{userDetails.username}
          </Animated.Text>
        </View>
      </View>

      <Modal animationType="fade" transparent={true} visible={modal}>
        <Pressable onPress={() => setModal(false)}>
          <View
            style={{
              height: screenHeight,
              width: screenWidth,
              backgroundColor: "black",
              opacity: 0.9,
            }}
          ></View>
          <View
            style={{
              position: "absolute",
              alignSelf: "center",
              top: screenHeight * 0.3,
            }}
          >
            <Image
              style={{
                height: screenHeight * 0.2,
                aspectRatio: 1,
                borderRadius: 100,
                position: "absolute",
                backgroundColor: "grey",
                alignSelf: "center",
              }}
              source={{ uri: userDetails.profileimage }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({});
