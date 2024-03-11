import { Dimensions, SafeAreaView, View } from "react-native";
import React from "react";
import SignUpHeader from "../components/signup/SignUpHeader";
import SignUpForm from "../components/signup/SignUpForm";

export default function SignUp({ navigation }) {
  let height = Dimensions.get("window").height;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#00A3FF",
      }}
    >
      <SignUpHeader navigation={navigation} />
      <View style={{ top: height * 0.1 }}>
        <SignUpForm navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}
