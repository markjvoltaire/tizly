import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

export default function ServicesList() {
  const screenWidth = Dimensions.get("window").width;

  // Hardcoded user data with services
  const user = {
    services: [
      {
        title: "Service 1",
        description: "Description for Service 1",
        price: "$50",
      },
      {
        title: "Service 2",
        description: "Description for Service 2",
        price: "$80",
      },
      {
        title: "Service 3",
        description: "Description for Service 3",
        price: "$100",
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Services</Text>
      {user.services.map((service, index) => (
        <TouchableOpacity key={index}>
          {/* Added key prop */}
          <View style={styles.serviceContainer}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.servicePrice}>{service.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 20,
  },
  serviceContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
