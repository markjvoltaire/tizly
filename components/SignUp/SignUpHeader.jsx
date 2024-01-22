import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from "react-native";
import React from "react";

export default function SignUpHeader({ navigation }) {
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;
  return (
    <View>
      <TouchableOpacity
        style={{ width: width * 0.0 }}
        onPress={() => navigation.goBack()}
      >
        <Image
          style={{
            left: width * 0.05,
            resizeMode: "contain",
            width: width * 0.06,
            height: height * 0.028,
            top: height * 0.015,
          }}
          source={require("../../assets/WhiteBack.png")}
        />
      </TouchableOpacity>

      <Text
        style={{
          color: "white",
          position: "absolute",
          alignSelf: "center",
          fontSize: 34,
          fontFamily: "Poppins-SemiBold",
        }}
      >
        Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
