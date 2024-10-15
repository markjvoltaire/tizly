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

export default function BusinessIntro({ route, navigation }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedMCC, setSelectedMCC] = useState(null);
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  const zipCode = route.params.zipCode;

  const mccs = [
    { id: 4, code: "7542", description: "Car Detailing" }, // Car Wash code (Car Detailing)
    { id: 5, code: "7349", description: "Home Cleaning" }, // House Cleaning code
    { id: 6, code: "0780", description: "Lawn Mowing" }, // Landscaping and Lawn Care Services
    { id: 10, code: "7333", description: "Photography" }, // Photography code
    { id: 9, code: "7991", description: "Personal Training" }, // Fitness code (Personal Training)
    { id: 7, code: "0750", description: "Pet Grooming" }, // Veterinary and Pet Grooming code
    { id: 11, code: "7333", description: "Videography" }, // Videography code
    { id: 7, code: "7297", description: "Massage" }, // Massage Parlors
  ];

  const toggleDropdown = () => {
    const toValue = dropdownVisible ? 0 : 200; // Adjust 200 to your desired height
    Animated.timing(dropdownHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelect = (item) => {
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
      <View style={styles.container}>
        <Text style={styles.heading}>
          Tell us a bit about your business to set you up.
        </Text>

        <Pressable style={styles.dropdown} onPress={toggleDropdown}>
          <Text style={styles.dropdownText}>
            {selectedMCC
              ? selectedMCC.description
              : "Select Your Business Category"}
          </Text>
          {/* <Image
            style={styles.dropdownIcon}
            source={require("../assets/dropdown-icon.png")} // Replace with your dropdown icon image
          /> */}
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

        {selectedMCC && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() =>
              navigation.navigate("Dob", {
                route,
                selectedMCC,
                zipCode,
              })
            }
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
    width: 40,
  },
  backButtonImage: {
    width: 30,
    height: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 30,
    textAlign: "center",
  },
  dropdown: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "#666666",
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },
  dropdownMenu: {
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 30,
  },
  dropdownItem: {
    padding: 15,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333333",
  },
  nextButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
