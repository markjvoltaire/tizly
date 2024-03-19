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
  Modal,
  TextInput,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for icons
import { getPosts } from "../services/user";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";
import { supabase } from "../services/supabase";

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
const BioSection = ({ user, navigation }) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      <Text style={{ fontSize: 16, marginBottom: 10 }}>{user.bio}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("EditProfile")}
        style={{
          backgroundColor: "#007AFF",
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 15,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

// Photo Grid Component
const PhotoGrid = ({ photos, loadingGrid, profilePost, fadeAnim, loading }) => {
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
      {!profilePost.length ? (
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

export default function UserProfile({ route, navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loadingGrid, setLoadingGrid] = useState(true);
  const [profilePost, setProfilePost] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function getUser(userid) {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userid)
      .single()
      .limit(1);

    return resp;
  }

  async function loginWithEmail() {
    // setModalLoader(true);
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
    } else {
      const resp = await getUser(user.id);
      supabase.auth.setAuth(user.access_token);
      console.log("resp", resp);
      setUser(resp.body);
    }
  }

  const logUserIn = () => {
    loginWithEmail();
    // Add your login logic here
  };

  const handleLoginModal = () => {
    setModalVisible(true);
    // Add your login logic here
  };

  useEffect(() => {
    const getUserInfo = async () => {
      if (!user) return;

      const resp = await getPosts(user.user_id);
      setProfilePost(resp);
      setLoadingGrid(false);
      setLoading(false);
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

  // IF NO USER IS LOGGED IN
  if (!user) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{}}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: "AirbnbCereal-Bold",
              marginBottom: 20,
            }}
          >
            Profile
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "AirbnbCereal-Medium",
              marginBottom: 10,
              color: "#717171",
            }}
          >
            Log in to see your profile
          </Text>
          <Text
            style={{
              fontSize: 20,

              marginBottom: 20,
              color: "#717171",
            }}
          >
            Once you login, you'll find your profile here
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 5,
              alignSelf: "stretch",
            }}
            onPress={handleLoginModal}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "600",
                fontFamily: "AirbnbCereal-Bold",
                textAlign: "center",
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "white",
              borderRadius: 10,
              top: 200,
              padding: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                marginBottom: 15,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Login or Sign Up
            </Text>
            <TextInput
              style={{
                height: 40,
                width: "100%",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 12,
                marginBottom: 10,
                paddingHorizontal: 10,
                fontFamily: "alata",
                borderWidth: 1,
                borderColor: "#BBBBBB",
                backgroundColor: "#F3F3F9",
              }}
              placeholderTextColor="grey"
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={{
                height: 40,
                width: "100%",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 10,
                paddingHorizontal: 10,
                fontFamily: "alata",
                borderWidth: 1,
                borderColor: "#BBBBBB",
                backgroundColor: "#F3F3F9",
              }}
              placeholderTextColor="grey"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#007AFF",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 5,
                alignSelf: "stretch",
              }}
              onPress={logUserIn}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: "600",
                  fontFamily: "AirbnbCereal-Bold",
                  textAlign: "center",
                }}
              >
                Log In
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ marginRight: 5 }}>Don't have an account?</Text>
              <Button
                title="Sign Up"
                onPress={() => {
                  // Add your sign up functionality here
                }}
              />
            </View>
            <Button
              title="Not Yet"
              onPress={() => setModalVisible(!modalVisible)}
              color="grey"
            />
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

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
                paddingLeft: 15,
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
                source={{ uri: user.profileimage }}
              />
              <View>
                <Text style={{ fontWeight: "600", fontSize: 22 }}>
                  {user.displayName}
                </Text>
                {/* <Text
                  style={{ fontWeight: "600", fontSize: 15, color: "grey" }}
                >
                  Photographer
                </Text> */}
              </View>
            </View>
            {/* Line Break */}

            {/* Bio Section */}
            <BioSection navigation={navigation} user={user} />

            {/* Line Break */}
            {/* <View style={styles.lineBreak} /> */}
            {/* Portfolio Section */}
            <PhotoGrid
              loadingGrid={loadingGrid}
              fadeAnim={fadeAnim}
              profilePost={profilePost}
              loading={loading}
            />
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
  },
  profileName: {
    fontWeight: "600",
    fontSize: 16,
  },
});
