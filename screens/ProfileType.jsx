import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function ProfileType({ navigation }) {
  const [selectedType, setSelectedType] = useState(null);

  const handleSelect = (type) => {
    setSelectedType(type);
    const route = type === "personal" ? "AddCity" : "Name";
    navigation.navigate(route, { type });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Join as a Business or an Individual?</Text>
      {["personal", "business"].map((type, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.option]}
          onPress={() => handleSelect(type)}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionText}>
              {type === "personal" ? "Individual" : "Business"}
            </Text>
            <Text style={styles.subText}>
              {type === "personal"
                ? "Looking to book services tailored to your needs? Join as an Individual!"
                : "Ready to showcase your services and reach more clients? Join as a Business!"}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  option: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
  },
  optionContent: {
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  goBackButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  goBackText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
