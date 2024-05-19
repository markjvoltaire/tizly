import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  Button,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";

import LottieView from "lottie-react-native";
import { supabase } from "../services/supabase";

export default function Pay({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const { profile, serviceTitle, serviceDescription, servicePrice } =
    route.params;
  const { confirmPayment } = useStripe();
  const stripe = useStripe();
  const { user, setUser } = useUser();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust duration as needed
      useNativeDriver: true,
    }).start();
  }, []);

  async function uploadOrder() {
    try {
      //   setAddingCarModal(true);
      const newOrder = {
        seller_id: profile.user_id,
        purchaserId: user.user_id,
        serviceId: "fhshfhskjdfhjk",
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
        body: JSON.stringify({ servicePrice }),
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

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: profile.profileimage }}
        style={[
          {
            width: screenWidth,
            height: screenHeight * 0.55,
            resizeMode: "cover",
            backgroundColor: "black",
          },
          { opacity: fadeAnim },
        ]}
      />
      <View
        style={{
          width: screenWidth,
          height: screenHeight * 0.55,
          backgroundColor: "black",
          position: "absolute",
          opacity: 0.5,
        }}
      ></View>

      <View style={{ margin: 20, bottom: screenHeight * 0.1 }}>
        <Text
          style={{
            color: "white",
            fontWeight: "800",
            fontSize: 25,
          }}
        >
          1 hour Photo Shoot
        </Text>

        <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
          ${servicePrice}
        </Text>
      </View>

      <View style={{ bottom: screenHeight * 0.094 }}>
        <Text style={{ fontSize: 18, margin: 12, fontWeight: "500" }}>
          What's Included
        </Text>
        <View
          style={{
            margin: 10,
            bottom: 6,
          }}
        >
          <Text>
            {`•`} Personalized consultation to discuss your vision, preferences,
            and specific requirements.
          </Text>
        </View>
        <View
          style={{
            margin: 10,
            bottom: 6,
          }}
        >
          <Text>
            {`•`} Delivery of high-resolution digital images, ready for print or
            online use.
          </Text>
        </View>

        <View
          style={{
            margin: 10,
            bottom: 6,
          }}
        >
          <Text>
            {" "}
            {`•`} Professional editing and retouching of all selected images.
          </Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={handlePayPress}
          disabled={loading}
          style={{
            backgroundColor: "#635BFF",
            height: screenHeight * 0.06,
            width: screenWidth * 0.9,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Book Now ${servicePrice}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={processing} animationType="fade">
        <SafeAreaView style={{ backgroundColor: "#635BFF", flex: 1 }}>
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
    backgroundColor: "white",

    flex: 1, // Ensure the container takes the full height of the screen
  },

  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 15,
  },
  reviewText: {
    fontSize: 16,
  },
  reviewRating: {
    fontSize: 14,
    color: "grey",
  },
  bioText: {
    fontSize: 14,
    fontWeight: "400",
  },
  photoGridContainer: {
    paddingTop: 20,
  },
  photoItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
  },
  photoImage: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "grey",
  },
  lineBreak: {
    borderBottomWidth: 0.4,
    borderBottomColor: "lightgrey",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  starRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starRating: {
    flexDirection: "row",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 18,
  },
  bookButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: "grey",
  },
  profileName: {
    fontWeight: "600",
    fontSize: 16,
  },
});
