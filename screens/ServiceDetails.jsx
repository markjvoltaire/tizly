import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";
import { supabase } from "../services/supabase";
import { SharedElement } from "react-native-shared-element";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ServiceDetails({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [businessProfile, setBusinessProfile] = useState({});
  const [bookingCount, setBookingCount] = useState(0);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [message, setMessage] = useState("");
  const { user } = useUser();

  useEffect(() => {
    fetchBusinessProfile(route.params.item.user_id);
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      await getBookingCount();
      await getRatings();
    };
    getInfo();
  }, []);

  async function getBookingCount() {
    const res = await supabase
      .from("orders")
      .select("*")
      .eq("orderStatus", "complete")
      .eq("seller_id", route.params.item.user_id);

    setBookingCount(res.body.length);
  }

  async function getRatings() {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("rating")
        .eq("orderStatus", "complete")
        .eq("seller_id", route.params.item.user_id);

      if (error) {
        console.error("Error fetching ratings:", error.message);
        return;
      }

      if (!data || data.length === 0) {
        console.log("No ratings found.");
        return;
      }

      const totalRatings = data.reduce((sum, record) => sum + record.rating, 0);
      const averageRating = totalRatings / data.length;

      setRatingAverage(averageRating);
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  }

  const fetchBusinessProfile = async (businessId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", businessId)
        .single();
      if (error) throw error;
      setBusinessProfile(data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
      Alert.alert("Error", "Failed to fetch user data");
    }
  };

  const goToAddTime = () => {
    navigation.navigate("AddDate", { serviceInfo: route.params.item });
  };

  const sendNotification = async (body, title) => {
    try {
      // Notification message
      const message = {
        to: businessProfile.expo_push_token,
        sound: "default",
        title: title,
        body: body,
      };

      // Send the notification
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
        body: JSON.stringify(message),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Notification sent successfully:", data);
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const sendMessage = async () => {
    try {
      const userId = supabase.auth.currentUser.id;
      const body = `New message from ${user.username}`;
      const title = "Tizly";
      const tokenCode = businessProfile.expo_push_token;

      if (message.trim() !== "") {
        const res = await supabase.from("messages").insert([
          {
            type: "message",
            sender: userId,
            receiver: businessProfile.user_id,
            message: message.trim(),
            threadID: `${userId}${businessProfile.user_id}`,
          },
        ]);

        console.log("businessProfile", `${userId}${businessProfile.user_id}`);

        if (res.error) {
          console.error("Error inserting message:", res.error);
          Alert.alert("An error has occurred, please try again.");
          return;
        }

        setMessage("");

        try {
          await sendNotification(body, title, tokenCode);
        } catch (notificationError) {
          console.error("Error sending push notification:", notificationError);
        }
      } else {
        Alert.alert("Please enter a message before sending.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("An error has occurred, please try again.");
    }
  };

  const BusinessInfo = ({ businessProfile, bookingCount, ratingAverage }) => {
    return (
      <View style={styles.businessInfoContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: businessProfile.profileimage }}
        />
        <View>
          <Text style={styles.profileName}>{businessProfile.username}</Text>
          <Text style={styles.ratingText}>
            {ratingAverage.toFixed(1)} ★ ({bookingCount})
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewContainer}
      >
        <SharedElement id={route.params.item.thumbnail}>
          <Image
            source={{ uri: route.params.item.thumbnail }}
            style={styles.image}
          />
          <View style={styles.imageOverlay} />
        </SharedElement>

        <View style={styles.detailsContainer}>
          <Text style={styles.serviceTitle}>{route.params.item.title}</Text>
          <Text style={styles.priceText}>${route.params.item.price}</Text>

          <View style={styles.messageContainer}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              multiline
              placeholder="ask any questions about this service"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <Pressable
            onPress={() =>
              navigation.navigate("ProfileDetail", {
                item: businessProfile,
              })
            }
          >
            <BusinessInfo
              bookingCount={bookingCount}
              businessProfile={businessProfile}
              ratingAverage={ratingAverage}
            />
          </Pressable>

          <Text style={styles.descriptionText}>
            {route.params.item.description}
          </Text>
        </View>

        <View style={{ marginBottom: 100 }} />
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={goToAddTime}
          disabled={loading}
          style={styles.bookButton}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.bookButtonText}>Select Date</Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal visible={processing} animationType="fade">
        <SafeAreaView style={styles.modalContainer}>
          <LottieView
            style={styles.lottie}
            source={require("../assets/lottie/3Dots.json")}
            autoPlay
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingBottom: 100,
    backgroundColor: "white",
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.5,
    resizeMode: "cover",
    backgroundColor: "#EEEFF2",
  },
  imageOverlay: {
    width: screenWidth,
    height: screenHeight * 0.5,
    backgroundColor: "black",
    position: "absolute",
    opacity: 0.4,
  },
  detailsContainer: {
    padding: 10,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007bff",
    marginVertical: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#555",
    marginTop: 12,
  },
  messageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2, // for Android shadow
    shadowColor: "#000000", // for iOS shadow
    shadowOpacity: 0.1, // for iOS shadow
    shadowRadius: 5, // for iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    }, // for iOS shadow
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    backgroundColor: "#f1f2f6",
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 7,
  },
  bottomBar: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bookButton: {
    backgroundColor: "#007bff",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#4A3AFF",
    justifyContent: "center",
  },
  lottie: {
    height: 200,
    width: 200,
    alignSelf: "center",
  },
  businessInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  profileName: {
    fontWeight: "600",
    fontSize: 18,
    color: "#333",
  },
  ratingText: {
    color: "#888",
    fontSize: 14,
  },
});
