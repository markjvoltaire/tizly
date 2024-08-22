import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";
import { supabase } from "../services/supabase";
import { sendPushNotification } from "../services/notification";
import { getUser } from "../services/user";

export default function ConfirmBooking({ route, navigation }) {
  const { selectedDate, selectedTime } = route.params;
  const service = route.params.service;
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [hours, setHours] = useState(1); // Default to 1 hour
  const stripe = useStripe();
  const { user } = useUser();
  const [sellerBlob, setSellerBlob] = useState();

  // Convert selectedDate to a readable format
  const formattedDate = new Date(selectedDate).toLocaleDateString();

  const sendNotification = async (body, title, tokenCode) => {
    console.log("Sending push notification...");

    // notification message
    const message = {
      to: tokenCode,
      sound: "default",
      title: title,
      body: body,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  async function uploadOrder() {
    const resp = await getUser(service);
    const tokenCode = resp.body.expo_push_token;
    const body = `🎉 Great news! You've been booked.`;
    const title = "New Booking";
    try {
      const newOrder = {
        seller_id: route.params.service.user_id,
        purchaserId: user.user_id,
        orderStatus: "incomplete",
        date: selectedDate,
        time: selectedTime,
        serviceId: service.id,
        serviceTitle: service.title,
      };
      const resp = await supabase.from("orders").insert([newOrder]);

      console.log("upload order response", resp);
      await sendNotification(body, title, tokenCode);
      return resp;
    } catch (error) {
      console.error("Error submitting comment:", error);
      throw error;
    }
  }

  const handlePayPress = async () => {
    setLoading(true); // Set loading state to true
    setProcessing(true);
    const sellerStripeId = sellerBlob.stripeAccountId;
    console.log("sellerStripeId", sellerStripeId);
    try {
      const response = await fetch("https://tizlyexpress.onrender.com/pay", {
        method: "POST",
        body: JSON.stringify({
          servicePrice: service.price * hours,
          sellerStripeId: sellerStripeId,
        }), // Multiply price by hours if byHour is true
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert(data.message);
        setLoading(false); // Set loading state to false
        setProcessing(false);
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

  useEffect(() => {
    const getSellerBlob = async () => {
      const resp = await getUser(service);
      setSellerBlob(resp.body);
      setLoading(false);
    };
    getSellerBlob();
  }, []);

  // if (loading) {
  //   return (
  //     <View
  //       style={{ justifyContent: "center", flex: 1, backgroundColor: "white" }}
  //     >
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <View style={styles.serviceDetails}>
          <Image style={styles.thumbnail} source={{ uri: service.thumbnail }} />
          <View style={styles.textDetails}>
            <Text style={styles.title}>{service.title}</Text>
            <Text style={styles.detailText}>Date: {formattedDate}</Text>
            <Text style={styles.detailText}>Time: {selectedTime}</Text>
            <Text style={styles.detailText}>
              Price: ${service.price} {service.byHour ? "per hour" : null}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{service.description}</Text>
      </View>

      {service.byHour && (
        <View style={styles.hoursSelector}>
          <Text style={styles.hoursText}>Select Hours:</Text>
          <View style={styles.hoursControl}>
            <TouchableOpacity
              style={styles.hoursButton}
              onPress={() => setHours(hours - 1 >= 1 ? hours - 1 : 1)}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <Text style={styles.hours}>{hours}</Text>
            <TouchableOpacity
              style={styles.hoursButton}
              onPress={() => setHours(hours + 1)}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {service.byHour && (
        <Text style={styles.totalPrice}>
          Total Price: ${service.price * hours}
        </Text>
      )}

      <TouchableOpacity style={styles.bookNowButton} onPress={handlePayPress}>
        <Text style={styles.buttonText}>Complete Booking</Text>
      </TouchableOpacity>

      <Modal visible={processing} animationType="fade">
        <SafeAreaView style={styles.modalContainer}>
          <LottieView
            style={styles.animation}
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
    marginBottom: 10,
    color: "#666",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 3,
    color: "#333",
  },
  bookNowButton: {
    backgroundColor: "#4A3AFF",
    borderRadius: 10,
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  hoursSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  hoursText: {
    fontWeight: "500",
    fontSize: 17,
    marginRight: 10,
  },
  hoursControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  hoursButton: {
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 5,
  },
  hours: {
    fontWeight: "500",
    fontSize: 20,
    marginHorizontal: 10,
  },
  totalPrice: {
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: "#4A3AFF",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
});
