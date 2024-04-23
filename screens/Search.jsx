import React, { useRef, useEffect, useState } from "react";
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
import UserSearch from "../component/UserSearch";

export default function Search({ navigation }) {
  const textInputRef = useRef(null);
  const [showCategories, setShowCategories] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      textInputRef.current.focus();
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const handleCategoryPress = (category) => {
    // Handle category press here
    console.log("Category selected:", category);
  };

  const categories = [
    "Photography",
    "Catering",
    "Entertainment",
    "Fitness",
    "Bartending",
    "Videography",
    "Beauty",
  ];

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
              onChangeText={(text) => {
                setSearchValue(text);
                setShowCategories(text === "" ? true : false);
              }}
              value={searchValue}
            />
            <Image
              source={require("../assets/searchGlass.png")}
              style={styles.image}
            />
          </View>
        </View>

        {showCategories ? (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Categories</Text>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category)}
              >
                <Text>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <UserSearch navigation={navigation} searchValue={searchValue} />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    flex: 1,
  },
  input: {
    flex: 1,
    fontFamily: "alata",
    borderWidth: 1,
    borderColor: "#BBBBBB",
    backgroundColor: "#F3F3F9",
    borderRadius: 20,
    padding: 10,
    paddingLeft: 35,
  },
  image: {
    width: 20,
    height: 20,
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryItem: {
    backgroundColor: "#F3F3F9",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});
