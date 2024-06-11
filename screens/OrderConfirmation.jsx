import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function OrderConfirmation({ route, navigation }) {
  const order = route.params.order.body[0];
  console.log("order", order);
  const {
    created_at,
    id,
    orderId,
    orderStatus,
    purchaserId,
    serviceId,
    user_id,
  } = order;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Order Confirmation</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Order ID:</Text>
          <Text style={styles.value}>{orderId}</Text>

          <Text style={styles.label}>Payment Date:</Text>
          <Text style={styles.value}>
            {new Date(created_at).toLocaleString()}
          </Text>

          <Text style={styles.label}>Purchaser ID:</Text>
          <Text style={styles.value}>{purchaserId}</Text>

          {/* <Text style={styles.label}>Service ID:</Text>
          <Text style={styles.value}>{serviceId}</Text> */}

          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{order.seller_id}</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
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
    backgroundColor: "#46A05F",
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
