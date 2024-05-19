import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

export default function OrderDetails({ route, navigation }) {
  const profile = route.params.profile;

  const orderDetails = route.params.item;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Order Confirmation</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Order ID:</Text>
          <Text style={styles.value}>UHCSHAKJ</Text>
          <Text style={styles.label}>Created At:</Text>
          <Text style={styles.value}>fafsaf</Text>
          <Text style={styles.label}>Purchaser ID:</Text>
          <Text style={styles.value}>jodsjofos</Text>
          <Text style={styles.label}>Service ID:</Text>
          <Text style={styles.value}>fwfwef</Text>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>fweText /</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Go Back To Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#635BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
