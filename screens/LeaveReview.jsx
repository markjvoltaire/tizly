import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";

export default function LeaveReview({ defaultRating = 0, route, navigation }) {
  const [rating, setRating] = useState(defaultRating);
  const [showSubmitButton, setShowSubmitButton] = useState(defaultRating !== 0);
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;
  console.log("route", route.params);

  const leaveRating = async () => {
    const userId = supabase.auth.currentUser.id;
    const res = await supabase
      .from("orders")
      .update({ rating: rating })
      .eq("purchaserId", userId)
      .eq("serviceId", route.params.serviceId);

    if (res.error) {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    } else {
      Alert.alert("Thank you for your review");
      navigation.goBack();
      navigation.goBack();
    }
  };

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
    setShowSubmitButton(true);
  };

  const handleSubmit = async () => {
    await leaveRating();
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.starContainer}
        >
          <Text style={i <= rating ? styles.filledStar : styles.emptyStar}>
            ★
          </Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.ratingContainer}>
      <Text style={styles.ratingText}>Rating</Text>
      <View style={styles.starsContainer}>{renderStars()}</View>

      {/* Review Text Input */}
      {/* <TextInput
        style={styles.reviewInput}
        multiline
        numberOfLines={4} // Adjust as needed
        placeholder="Write your review..."
        value={reviewText}
        onChangeText={setReviewText}
      /> */}

      {/* Submit Button */}
      {showSubmitButton && (
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: "#46A05F",
            width: width * 0.8,
            height: height * 0.06,
            padding: 12,
            alignSelf: "center",
            borderRadius: 13,
            top: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              alignSelf: "center",
              fontSize: 18,
              color: "white",
            }}
          >
            Send Rating
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ratingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  ratingText: {
    fontSize: 18,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  starContainer: {
    padding: 5,
  },
  filledStar: {
    color: "gold",
    fontSize: 45,
  },
  emptyStar: {
    color: "lightgrey",
    fontSize: 45,
  },
  reviewInput: {
    width: "80%",
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    textAlignVertical: "top", // Align text to top in multiline input
    marginBottom: 20,
    padding: 10,
  },
});
