import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";

export default function ProfileType({ navigation }) {
  const [selectedType, setSelectedType] = useState(null);

  const handleSelect = (type) => {
    setSelectedType(type);
    navigation.navigate("NoAuthAddLocation", { type });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Account Type</Text>
      <TouchableOpacity
        style={[styles.option, selectedType === "personal" && styles.selected]}
        onPress={() => handleSelect("personal")}
      >
        <Text style={styles.optionText}>Personal</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, selectedType === "business" && styles.selected]}
        onPress={() => handleSelect("business")}
      >
        <Text style={styles.optionText}>Business</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center content vertically
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    paddingBottom: 180, // Add padding at the top to move content down
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
  },
  option: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selected: {
    borderColor: "#46A05F",
  },
  optionText: {
    fontSize: 18,
    color: "#333",
  },
});
