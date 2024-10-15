import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoAuthAddLocation({ route, navigation }) {
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");

  const details = route.params;

  // Define text variables
  const headerText = "Where Are You Located? Let’s Pin Your Spot!";
  const buttonText = "Next";
  const errorText = "Please select a city.";

  const handleCityChange = (text) => {
    setAddress(text);
  };

  const handleZipCodeChange = (text) => {
    setZipCode(text);
    if (zipCodeError) {
      validateZipCode(text);
    }
  };

  const validateZipCode = (code) => {
    const zipCodePattern = /^\d{5}$/; // A basic pattern to match a 5-digit ZIP code
    if (!zipCodePattern.test(code)) {
      setZipCodeError("Please enter a valid 5-digit ZIP code.");
      return false;
    }
    setZipCodeError("");
    return true;
  };

  const handleNext = () => {
    if (!validateZipCode(zipCode)) {
      return;
    }
    navigation.navigate("AddCity", {
      details,
      address,
      zipCode,
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>{headerText}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Street Address"
          value={address}
          onChangeText={handleCityChange}
          placeholderTextColor="#9E9E9E"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Zip Code"
          value={zipCode}
          keyboardType="number-pad"
          onChangeText={handleZipCodeChange}
          placeholderTextColor="#9E9E9E"
        />

        {zipCodeError ? (
          <Text style={styles.errorText}>{zipCodeError}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
  },
  backButtonContainer: {
    width: 40,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    marginTop: 25,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    fontSize: 16,
    padding: 12,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
