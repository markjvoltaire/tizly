import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

export default function ServiceCard({ profile, screenWidth, navigation }) {
  const serviceTitle = "Inside and Outside Clean";
  const serviceDescription =
    "Transforming rides one detail at a time! Passionate about perfection.";
  const servicePrice = 452.3;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Pay", {
          serviceDescription,
          servicePrice,
          serviceTitle,
          profile,
        })
      }
    >
      <View
        style={{
          borderRadius: 10,
          width: screenWidth * 0.98,
          elevation: 5, // Add elevation for drop shadow
        }}
      >
        <View
          style={{
            alignSelf: "center",
            borderRadius: 10,
            backgroundColor: "white",
            width: screenWidth * 0.95,
            elevation: 5, // Add elevation for drop shadow
            shadowColor: "#000", // Shadow color
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            marginBottom: 25, // Adjust margin to accommodate drop shadow
            paddingHorizontal: 15, // Padding for inner content
            paddingVertical: 10, // Padding for inner content
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ height: 80, width: 80, borderRadius: 10 }}
              source={{ uri: profile.profileimage }}
            />
            <View style={{ marginLeft: 15 }}>
              <Text
                style={{
                  fontSize: 16,
                  paddingBottom: 5,
                }}
              >
                {serviceTitle}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#888",
                  marginBottom: 10,
                  width: screenWidth * 0.7,
                }}
              >
                {serviceDescription}
              </Text>

              <Text
                style={{ fontSize: 14, paddingRight: 30, fontWeight: "600" }}
              >
                ${(Math.round(servicePrice * 100) / 100).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
