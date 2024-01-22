import { SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useState } from "react";

import LoginForm from "../components/Login/LoginForm";
import LoginHeader from "../components/Login/LoginHeader";

export default function Login({ navigation }) {
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#00A3FF" }}>
      <LoginHeader navigation={navigation} />
      <View style={{ top: height * 0.2 }}>
        <LoginForm navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
