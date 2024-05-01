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
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for icons
import LottieView from "lottie-react-native";
import { getPosts } from "../services/user";
import { Video, AVPlaybackStatus } from "expo-av";
import ServicesList from "../component/ServicesList";

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
      {profilePost.length === 0 ? (
        <Text
          style={{
            alignSelf: "center",
            color: "grey",

            fontSize: 23,
            bottom: 5,
          }}
        >
          No Images Uploaded
        </Text>
      ) : (
        <>
          <Text style={styles.header}>Portfolio</Text>
          <FlatList
            data={profilePost}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            contentContainerStyle={styles.photoGridContainer}
          />
        </>
      )}
    </View>
  );
};

export default function ProfileDetail({ route, navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loadingGrid, setLoadingGrid] = useState(true);
  const [profilePost, setProfilePost] = useState([]);
  const profileDetails = route.params.item;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

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
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: "800", fontSize: 22 }}>
                  {route.params.item.displayName}
                </Text>
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 15,
                    color: "grey",
                    alignSelf: "center",
                  }}
                >
                  {route.params.item.profession}
                </Text>
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 15,
                    color: "grey",
                    alignSelf: "center",
                  }}
                >
                  📍 {route.params.item.location}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "black",
                  height: 50,
                  width: screenWidth * 0.9,
                  justifyContent: "center", // Center vertically
                  alignItems: "center", // Center horizontally
                  borderRadius: 10,
                  marginBottom: 20,
                }}
                onPress={() =>
                  navigation.navigate("InboxDetails", { profileDetails })
                }
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                >
                  Send Message
                </Text>
              </TouchableOpacity>
            </View>
            {/* Line Break */}

            {/* Bio Section */}
            <ServicesList />

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
  header: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 20,
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
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "500",
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
