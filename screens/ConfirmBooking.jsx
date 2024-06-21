import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";
import { supabase } from "../services/supabase";

export default function ConfirmBooking({ route, navigation }) {
  const { selectedDate, selectedTime } = route.params;
  const service = route.params.service;
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const { user } = useUser();

  // Get screen dimensions
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Convert selectedDate to a readable format
  const formattedDate = new Date(selectedDate).toLocaleDateString();

  async function uploadOrder() {
    try {
      //   setAddingCarModal(true);
      const newOrder = {
        seller_id: route.params.service.user_id,
        purchaserId: user.user_id,
        orderStatus: "incomplete",
      };
      const resp = await supabase.from("orders").insert([newOrder]);

      return resp;
    } catch (error) {
      console.error("Error submitting comment:", error);
      throw error;
    }
  }

  const handlePayPress = async () => {
    setLoading(true); // Set loading state to true
    setProcessing(true);
    try {
      // sending request

      const response = await fetch("https://tizlyexpress.onrender.com/pay", {
        method: "POST",
        body: JSON.stringify({ servicePrice: service.price }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert(data.message);
        setLoading(false); // Set loading state to false
        setProcessing(false);
        console.log("LINE 83");

        return;
      }
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        returnURL: null,
      });
      if (initSheet.error) {
        Alert.alert(initSheet.error.message);
        setLoading(false); // Set loading state to false
        setProcessing(false);

        return;
      }
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) {
        console.log("presentSheet", presentSheet);
        setLoading(false); // Set loading state to false
        setProcessing(false);
        return;
      }
      const order = await uploadOrder();
      Alert.alert("Payment complete, thank you!");
      navigation.navigate("OrderConfirmation", { order });
      return order;
    } catch (err) {
      console.error(err);
      Alert.alert("Something went wrong, try again later!");
    } finally {
      setLoading(false); // Ensure loading state is set to false in the finally block
      setProcessing(false);
    }
  };

  // Function to handle booking action (can be replaced with actual booking logic)
  const handleBookNow = () => {
    // Implement booking logic here
    alert("Booking confirmed!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <View style={styles.serviceDetails}>
          <Image style={styles.thumbnail} source={{ uri: service.thumbnail }} />
          <View style={styles.textDetails}>
            <Text style={styles.title}>{service.title}</Text>

            <Text style={styles.detailText}>Date: {formattedDate}</Text>
            <Text style={styles.detailText}>Time: {selectedTime}</Text>
            <Text style={styles.detailText}>Price: ${service.price}</Text>
          </View>
        </View>
        <Text style={styles.description}>{service.description}</Text>
      </View>
      <TouchableOpacity style={styles.bookNowButton} onPress={handlePayPress}>
        <Text style={styles.buttonText}>Complete Purchase</Text>
      </TouchableOpacity>
      <Modal visible={processing} animationType="fade">
        <SafeAreaView style={{ backgroundColor: "#46A05F", flex: 1 }}>
          <LottieView
            style={{
              height: 500,
              width: 500,
              alignSelf: "center",
            }}
            source={require("../assets/lottie/3Dots.json")}
            autoPlay
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

    alignItems: "center",
    padding: 20,
  },
  detailsContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  textDetails: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 3,
    color: "#333",
  },
  bookNowButton: {
    backgroundColor: "#46A05F",
    borderRadius: 10,
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
