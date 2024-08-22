import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Animated,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";

export default function AuthBusinessIntro({ route, navigation }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedMCC, setSelectedMCC] = useState(null);
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  const zipCode = route.params.zipCode;

  const mccs = [
    { id: 1, code: "7230", description: "Beauty" },
    { id: 2, code: "7241", description: "Barber Shops" },
    { id: 3, code: "5813", description: "Bartending" },
    { id: 4, code: "7542", description: "Auto Detailing" },
    { id: 5, code: "7349", description: "Cleaning Services" },
    { id: 6, code: "7349", description: "Maintenance Services" },
    { id: 7, code: "7297", description: "Massage Services" },
    { id: 8, code: "7299", description: "Miscellaneous" },
    { id: 9, code: "7991", description: "Fitness" },
    { id: 10, code: "7333", description: "Photography & Videography" },
  ];

  const toggleDropdown = () => {
    const toValue = dropdownVisible ? 0 : 200; // Adjust 200 to your desired height
    Animated.timing(dropdownHeight, {
      toValue,
      duration: 300, // Animation duration in milliseconds
      useNativeDriver: false,
    }).start();
    setDropdownVisible(!dropdownVisible);
  };

  

  const handleSelect = (item) => {
    console.log("item", item);
    setSelectedMCC(item);
    setDropdownVisible(false);
    Animated.timing(dropdownHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              style={styles.backButtonImage}
              source={require("../assets/WhiteBack.png")}
            />
          </Pressable>
        </View>

        <Text style={styles.heading}>
          Tell us a bit about your business so we can get you set up.
        </Text>

        <Pressable style={styles.dropdown} onPress={toggleDropdown}>
          <Text style={styles.dropdownText}>
            {selectedMCC
              ? selectedMCC.description
              : "Tap to Select Your Business Category"}
          </Text>
          <Image
            style={styles.dropdownIcon}
            source={require("../assets/WhiteBack.png")} // Replace with your dropdown icon image
          />
        </Pressable>

        <Animated.View
          style={[styles.dropdownMenu, { height: dropdownHeight }]}
        >
          <FlatList
            data={mccs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={styles.dropdownItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.dropdownItemText}>{item.description}</Text>
              </Pressable>
            )}
          />
        </Animated.View>
        {selectedMCC === null ? null : (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AuthDob", {
                route,
                selectedMCC,
                zipCode,
              })
            }
            style={styles.button}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#4A3AFF",
    padding: 15,
    height: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#4A3AFF",
    padding: 10,
    paddingBottom: 180,
  },
  backButtonContainer: {
    width: 90,
    marginBottom: 50,
  },
  backButtonImage: {
    aspectRatio: 1,
    height: 30,
  },
  heading: {
    fontSize: 20,
    marginBottom: 30,
    color: "white",
    fontWeight: "800",
    width: "100%",
  },
  dropdown: {
    padding: 15,
    backgroundColor: "black",
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    transform: [{ rotate: "270deg" }], // Rotate the arrow 180 degrees to point down
  },
  dropdownMenu: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 2,
    marginBottom: 50,
  },
  dropdownItem: {
    padding: 15,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#000",
  },
});
