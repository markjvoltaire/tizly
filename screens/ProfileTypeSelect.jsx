import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function ProfileTypeSelect({ navigation, route }) {
  const [accountType, setAccountType] = useState("");

  const selectAccountType = (type) => {
    setAccountType(type);
    navigation.navigate(type === "personal" ? "SignUp" : "SelectBusinessType", {
      accountType: type,
      screenName: route.params.screenName,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Account Type</Text>
      <TouchableOpacity
        onPress={() => selectAccountType("business")}
        style={styles.button}
        accessibilityLabel="Select Business Account"
      >
        <Text style={styles.buttonText}>Business Account</Text>
        <Text style={styles.subText}>
          Business accounts showcase their services for individuals to schedule
          appointments or reservations.
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => selectAccountType("personal")}
        style={styles.button}
        accessibilityLabel="Select Personal Account"
      >
        <Text style={styles.buttonText}>Personal Account</Text>
        <Text style={styles.subText}>
          User profiles serve as a gateway to discover and engage with
          businesses offering various services.
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: "#808080",
  },
});
