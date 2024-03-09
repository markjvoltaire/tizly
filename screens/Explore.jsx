import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  View,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useScrollToTop } from "@react-navigation/native";
import PaginationComponent from "../components/explore/PaginationComponent";
import AppHeader from "../components/Headers/AppHeader";
import ExplorePlaceHolder from "../components/explore/ExplorePlaceHolder";
import ExploreHeader from "../components/Headers/ExploreHeader";

export default function Explore({ navigation }) {
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  useScrollToTop(ref);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const scheme = useColorScheme();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleTextInputChange = (text) => {
    setTextInput(text);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // 2 seconds loading time
    return () => clearTimeout(timer);
  }, []); // Reset loading state whenever text input changes

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: scheme === "light" ? "white" : "#111111",
          flex: 1,
        }}
      ></View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <>
        <SafeAreaView
          style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: scheme === "light" ? "white" : "#111111",
          }}
        >
          <ExploreHeader />
          <TextInput
            style={styles.textInput}
            placeholderTextColor="grey"
            placeholder="Your Search Starts Here"
            autoCapitalize="none"
            value={textInput}
            onChangeText={handleTextInputChange}
          />
          {textInput.length > 0 ? (
            <View style={{ top: screenHeight * 0.03, marginBottom: 65 }}>
              <PaginationComponent
                textInput={textInput}
                navigation={navigation}
              />
            </View>
          ) : (
            <View
              style={{
                top: screenHeight * 0.03,
                marginBottom: screenHeight * 0.1,
              }}
            >
              <ExplorePlaceHolder useScrollToTop={useScrollToTop} />
            </View>
          )}
        </SafeAreaView>
      </>
    </TouchableWithoutFeedback>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  textInput: {
    alignSelf: "center",
    paddingLeft: 8,
    borderColor: "black",
    borderWidth: 0.3,
    borderRadius: 12,
    backgroundColor: "#F3F3F9",
    width: 300,
    height: 40,
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    justifyContent: "center",
    top: 10,
  },
};
