import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useStripe, CardField } from "@stripe/stripe-react-native";
import React, { useState } from "react";

export default function Pay({ route }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { confirmPayment } = useStripe();
  const stripe = useStripe();

  const { profile, serviceTitle, serviceDescription, servicePrice } =
    route.params;

  const handlePayPress = async () => {
    try {
      // sending request
      const response = await fetch("https://tizlyexpress.onrender.com/pay", {
        method: "POST",
        body: JSON.stringify({ name, servicePrice }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        returnURL: null,
      });
      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) return null;
      Alert.alert("Payment complete, thank you!");
    } catch (err) {
      console.error(err);
      Alert.alert("Something went wrong, try again later!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#888"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handlePayPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Pay</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
  },
  cardContainer: {
    width: "100%",
    height: 50,
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
