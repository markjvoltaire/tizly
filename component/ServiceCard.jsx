import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

export default function ServiceCard({ profile, screenWidth }) {
  return (
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
              inside and outside clean
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#888",
                marginBottom: 10,
                width: screenWidth * 0.7,
              }}
            >
              Transforming rides one detail at a time! Passionate about
              perfection.
            </Text>

            <Text style={{ fontSize: 14, paddingRight: 30, fontWeight: "600" }}>
              $45.00
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
