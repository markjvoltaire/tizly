import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Animated,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for icons
import LottieView from "lottie-react-native";
import { getPosts } from "../services/user";
import { Video, AVPlaybackStatus } from "expo-av";

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
          <View style={styles.reviewHeader}>
            <Image
              source={{ uri: review.profileImage }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{review.name}</Text>
          </View>
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
const BioSection = ({ bio, profileDetails }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.bioText}>{profileDetails.bio}</Text>
    </View>
  );
};

// Photo Grid Component
const PhotoGrid = ({ photos, loadingGrid, profilePost, fadeAnim }) => {
  const renderItem = ({ item }) => (
    <Pressable style={styles.photoItem}>
      <Animated.Image
        source={{ uri: item.media }}
        style={{
          flex: 1,
          borderRadius: 8,
          backgroundColor: "grey",
          opacity: fadeAnim,
        }}
      />
    </Pressable>
  );

  if (loadingGrid) {
    return (
      <View>
        <LottieView
          style={{
            height: 130,
            width: 130,

            alignSelf: "center",
          }}
          source={require("../assets/lottie/grey-loader.json")}
          autoPlay
        />
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      {/* <Text style={styles.sectionHeader}>Portfolio</Text> */}
      {profilePost.length === 0 ? (
        <Text
          style={{
            alignSelf: "center",
            color: "grey",
            fontFamily: "alata",
            fontSize: 23,
            bottom: 10,
          }}
        >
          No Images Uploaded
        </Text>
      ) : (
        <FlatList
          data={profilePost}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={styles.photoGridContainer}
        />
      )}
    </View>
  );
};

export default function ProfileDetail({ route, navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loadingGrid, setLoadingGrid] = useState(true);
  const [profilePost, setProfilePost] = useState([]);
  const profileDetails = route.params.item;

  console.log("route", route);

  useEffect(() => {
    const getUserInfo = async () => {
      const resp = await getPosts(profileDetails.user_id);
      setProfilePost(resp);

      setLoadingGrid(false);
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Sample reviews data
  const reviews = [
    {
      name: "John Doe",
      profileImage:
        "https://res.cloudinary.com/doz01gvsj/image/upload/v1710390562/ouwx9rs34ytxck9fe6w1.jpg",
      text: "Great user!",
      rating: 5,
    },
    {
      name: "Jane Smith",
      profileImage:
        "https://res.cloudinary.com/doz01gvsj/image/upload/v1710390562/icjhhp25f0glvgtpi0ze.jpg",
      text: "Very helpful.",
      rating: 4,
    },
    {
      name: "Alice Johnson",
      profileImage:
        "https://res.cloudinary.com/doz01gvsj/image/upload/v1710390562/zyqtuhjr5bkm0nfjdol9.jpg",

      text: "Could improve communication.",
      rating: 3,
    },
  ];

  const averageRating = () => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Sample bio for a Miami photographer
  const bio =
    "Miami-based photographer specializing in capturing the vibrant colors and energy of the city. With a keen eye for detail and a passion for storytelling, I aim to create stunning visuals that evoke emotion and capture the essence of each moment.";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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
                  {route.params.item.profession}
                </Text>
              </View>
            </View>
            {/* Line Break */}

            {/* Bio Section */}
            <BioSection profileDetails={profileDetails} bio={bio} />
            {/* Line Break */}
            <View style={styles.lineBreak} />
            {/* Portfolio Section */}
            <PhotoGrid
              profileDetails={profileDetails}
              profilePost={profilePost}
              loadingGrid={loadingGrid}
              fadeAnim={fadeAnim}
            />
            {/* Line Break */}
            <View style={styles.lineBreak} />
            {/* Review Section */}
            <ReviewSection reviews={reviews} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* Fixed bar at the bottom */}
      <View style={styles.bottomBar}>
        <Text style={styles.priceText}>
          Average Rating:{" "}
          {[...Array(Math.floor(averageRating()))].map((_, index) => (
            <FontAwesome key={index} name="star" size={16} color="gold" />
          ))}
          {averageRating() % 1 >= 0.5 && (
            <FontAwesome name="star-half-full" size={16} color="gold" />
          )}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("InboxDetails", { profileDetails })
          }
          style={styles.bookButton}
        >
          <Text style={styles.bookButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
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
    fontWeight: "bold",
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
