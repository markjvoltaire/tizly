import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Animated,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for icons

// Reusable StarRating Component
const StarRating = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const halfStars = rating - filledStars >= 0.5 ? 1 : 0;

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(<FontAwesome key={i} name="star" size={16} color="gold" />);
    }
    if (halfStars === 1) {
      stars.push(
        <FontAwesome
          key={stars.length}
          name="star-half-full"
          size={16}
          color="gold"
        />
      );
    }
    return stars;
  };

  return <View style={styles.starRating}>{renderStars()}</View>;
};

// Review Component
const ReviewSection = ({ reviews }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Reviews</Text>
      {reviews.map((review, index) => (
        <View key={index} style={styles.reviewItem}>
          <Text style={styles.reviewText}>{review.text}</Text>
          <View style={styles.starRatingContainer}>
            <StarRating rating={review.rating} />
            <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Bio Component
const BioSection = ({ bio }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Bio</Text>
      <Text style={styles.bioText}>{bio}</Text>
    </View>
  );
};

// Photo Grid Component
const PhotoGrid = ({ photos }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.photoItem}>
      <Image source={{ uri: item }} style={styles.photoImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Portfolio</Text>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={styles.photoGridContainer}
      />
    </View>
  );
};

export default function ProfileDetail({ route }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Sample reviews data
  const reviews = [
    { text: "Great user!", rating: 5 },
    { text: "Very helpful.", rating: 4 },
    { text: "Could improve communication.", rating: 3 },
  ];

  // Sample bio for a Miami photographer
  const bio =
    "Miami-based photographer specializing in capturing the vibrant colors and energy of the city. With a keen eye for detail and a passion for storytelling, I aim to create stunning visuals that evoke emotion and capture the essence of each moment.";

  // Sample photos
  const photos = [
    "https://res.cloudinary.com/doz01gvsj/image/upload/v1710390562/zyqtuhjr5bkm0nfjdol9.jpg",
    "https://res.cloudinary.com/doz01gvsj/image/upload/v1710390562/utadsdu5c0so8y82qops.jpg",
    "https://res.cloudinary.com/doz01gvsj/image/upload/v1710390562/llbndfabegq9bvsimskb.jpg",
    "https://res.cloudinary.com/doz01gvsj/image/upload/v1710390562/ouwx9rs34ytxck9fe6w1.jpg",
    "https://res.cloudinary.com/doz01gvsj/image/upload/v1710390562/icjhhp25f0glvgtpi0ze.jpg",
    "https://res.cloudinary.com/doz01gvsj/image/upload/v1710390562/w7c4mnwdepivsmgwh1ao.jpg",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        data={[{ key: "empty-component" }]}
        renderItem={() => (
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 10,
                paddingTop: 10,
              }}
            >
              <Animated.Image
                style={{
                  height: 70,
                  width: 70,
                  borderRadius: 100,
                  marginRight: 10,
                  opacity: fadeAnim,
                  backgroundColor: "grey",
                }}
                source={{ uri: route.params.item.profileimage }}
              />
              <View>
                <Text style={{ fontWeight: "600", fontSize: 22 }}>
                  {route.params.item.username}
                </Text>
                <Text
                  style={{ fontWeight: "600", fontSize: 15, color: "grey" }}
                >
                  Photographer
                </Text>
              </View>
            </View>
            {/* Line Break */}

            {/* Bio Section */}
            <BioSection bio={bio} />
            {/* Line Break */}
            <View style={styles.lineBreak} />
            {/* Portfolio Section */}
            <PhotoGrid photos={photos} />
            {/* Line Break */}
            <View style={styles.lineBreak} />
            {/* Review Section */}
            <ReviewSection reviews={reviews} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 16,
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
});
