import React, { useRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Image,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";

export default function Search({ navigation }) {
  const textInputRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Focus on the text input after 1 second
      textInputRef.current.focus();
    }, 300);

    return () => clearTimeout(timeout); // Clean up timeout on unmount
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/backArrow.png")}
              style={{
                width: 20,
                height: 20,
                marginRight: 20,
              }}
            />
          </TouchableOpacity>
          <View style={styles.textInputContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.input}
              placeholder="What service do you need?"
              placeholderTextColor="#8A8A8A"
            />
            <Image
              source={require("../assets/searchGlass.png")}
              style={styles.image}
            />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Adjust for status bar height on Android
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between", // To move the red box to the other side
    alignItems: "center",
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    flex: 1, // Occupy remaining space
  },
  input: {
    flex: 1,
    fontFamily: "alata",
    borderWidth: 1,
    borderColor: "#BBBBBB",
    backgroundColor: "#F3F3F9",
    borderRadius: 20,
    padding: 10,
    paddingLeft: 35, // Adjust the space between image and text input
  },
  image: {
    width: 20,
    height: 20,
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -10 }], // Center vertically
  },
});
