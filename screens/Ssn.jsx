import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";

export default function FinancialInfo({ navigation, route }) {
  const [ssn, setSsn] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");

  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  const handleSsnChange = (text) => {
    const cleanedText = text.replace(/\D/g, "");
    setSsn(cleanedText.slice(-4));
  };

  const handleAccountNumberChange = (text) => {
    const cleanedText = text.replace(/\D/g, "");
    setAccountNumber(cleanedText);
  };

  const handleRoutingNumberChange = (text) => {
    const cleanedText = text.replace(/\D/g, "");
    setRoutingNumber(cleanedText);
  };

  const validateInputs = () => {
    if (!ssn || !accountNumber || !routingNumber) {
      Alert.alert("Missing Information", "Please fill in all the fields.");
      return false;
    }

    if (ssn.length !== 4) {
      Alert.alert("Invalid SSN", "Please enter the last 4 digits of your SSN.");
      return false;
    }

    if (accountNumber.length < 8 || accountNumber.length > 12) {
      Alert.alert(
        "Invalid Account Number",
        "Please enter a valid account number (8-12 digits)."
      );
      return false;
    }

    if (routingNumber.length !== 9) {
      Alert.alert(
        "Invalid Routing Number",
        "Please enter a valid 9-digit routing number."
      );
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateInputs()) {
      navigation.navigate("BusinessSignUp", {
        route,
        accountNumber,
        routingNumber,
        ssn,
      });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Let's Get Your Payments Set Up!</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>xxx-xx-</Text>
          <TextInput
            style={styles.input}
            value={ssn}
            onChangeText={handleSsnChange}
            maxLength={4}
            keyboardType="numeric"
            placeholder="Last 4 of SSN"
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={accountNumber}
            onChangeText={handleAccountNumberChange}
            maxLength={12}
            keyboardType="numeric"
            placeholder="Account Number"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={routingNumber}
            onChangeText={handleRoutingNumberChange}
            maxLength={9}
            keyboardType="numeric"
            placeholder="Routing Number"
          />
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#4A3AFF",
  },
  backButton: {
    aspectRatio: 1,
    height: 30,
    left: 20,
    marginBottom: 20,
  },
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#F4F4F9",
    marginTop: 10,
  },
  heading: {
    fontSize: 22,
    color: "#333",
    fontWeight: "800",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  prefix: {
    fontSize: 16,
    paddingRight: 10,
    color: "#333",
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderColor: "#DDD",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  continueButton: {
    backgroundColor: "#4A3AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  continueButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
