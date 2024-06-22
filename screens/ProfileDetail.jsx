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
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getPosts } from "../services/user";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";
import { supabase } from "../services/supabase";

const ProfileDetail = ({ route, navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loadingGrid, setLoadingGrid] = useState(true);
  const [profilePost, setProfilePost] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const screenName = "UserProfile";

  console.log("route", route.params);

  const profile = route.params.item;

  console.log("profile", profile);

  const classes = [
    {
      id: "2",
      title: "Photo Shoot",
      name: "Voltaire Views",
      type: "fitness",
      price: "$250",
      image: require("../assets/cameraMan.jpg"),
    },
    {
      id: "3",
      title: "Make Session",
      name: "Ashley Beauty",
      type: "Beauty",
      price: "$175",
      image: require("../assets/makeUp.jpg"),
    },
    {
      id: "4",
      title: "Make Session",
      name: "Ashley Beauty",
      type: "Beauty",
      price: "$175",
      image: require("../assets/photo3.jpg"),
    },
  ];

  useEffect(() => {
    const getUserInfo = async () => {
      if (!user) return;

      const resp = await getPosts(user.user_id);
      setProfilePost(resp);
      setLoadingGrid(false);
      setLoading(false);
    };
    getUserInfo();
  }, [user]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderReviewItem = ({ item }) => (
    <Animated.View style={{ ...styles.reviewItem, opacity: fadeAnim }}>
      <Text style={styles.reviewText}>
        "Mark's session was phenomenal! His talent and professionalism truly
        shine. I'm delighted with the stunning photos he captured. Highly
        recommend!"
      </Text>
      <View style={styles.reviewFooter}>
        <Image
          style={styles.reviewImage}
          source={require("../assets/photo2.jpg")}
        />
        <View>
          <Text style={styles.reviewAuthor}>stephanie</Text>
          <Text style={styles.reviewTime}>2 weeks ago</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderPortfolioItem = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity>
        <Image style={styles.portfolioImage} source={item.image} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: profile.profileimage }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{profile.username}</Text>
            <Text style={styles.profileProfession}>{profile.profession}</Text>
          </View>
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5.0</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>28</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
          </View>
        </View>
        {profile.type === "business" ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("InboxDetails", { profileDetails: profile })
            }
            style={{
              width: 300,
              height: 40,
              borderRadius: 10,
              justifyContent: "center",
              backgroundColor: "#46A05F",

              alignSelf: "center",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "white",
                fontFamily: "gilroy",
                fontSize: 16,
              }}
            >
              Send Message
            </Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.separator} />
        <View style={styles.contentContainer}>
          {/* <Text style={styles.sectionTitle}>Reviews</Text>
          <FlatList
            style={{ right: 10, width: screenWidth * 0.94 }}
            horizontal
            data={classes}
            keyExtractor={(item) => item.id}
            renderItem={renderReviewItem}
            showsHorizontalScrollIndicator={false}
          /> */}
          {/* <View style={styles.separator} /> */}
          {/* <Text style={styles.sectionTitle}>Portfolio</Text>
          <FlatList
            horizontal
            style={{ right: 10, width: screenWidth * 0.94 }}
            data={classes}
            keyExtractor={(item) => item.id}
            renderItem={renderPortfolioItem}
            showsHorizontalScrollIndicator={false}
          /> */}
          {/* <View style={styles.separator} /> */}
          <Text style={styles.sectionTitle}>Services</Text>
          <Pressable onPress={() => console.log("Service selected")}>
            <View style={styles.serviceItem}>
              <Image
                style={styles.serviceImage}
                source={require("../assets/photo1.jpg")}
              />
              <View>
                <Text style={styles.serviceTitle}>Lifestyle Package</Text>
                <Text style={styles.serviceDetails}>$150 per hour</Text>
              </View>
            </View>
          </Pressable>
          <Pressable onPress={() => console.log("Service selected")}>
            <View style={styles.serviceItem}>
              <Image
                style={styles.serviceImage}
                source={require("../assets/photo2.jpg")}
              />
              <View>
                <Text style={styles.serviceTitle}>Fashion Photoshoot</Text>
                <Text style={styles.serviceDetails}>$200 per hour</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main containers
  container: { flex: 1, backgroundColor: "white" },
  scrollView: { padding: 16 },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  profileInfo: { alignItems: "center" },
  profileStats: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
    width: "100%",
  },
  contentContainer: { marginBottom: 50 },
  separator: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 16 },

  // Profile info
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    backgroundColor: "grey",
  },
  profileName: { fontSize: 24, fontWeight: "bold" },
  profileProfession: { fontSize: 16, color: "#636363" },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 14, color: "#636363" },

  // Sections
  sectionTitle: { fontSize: 20, fontFamily: "gilroy", marginBottom: 8 },

  // Reviews
  reviewItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    marginRight: 16,
    marginBottom: 10,
    marginLeft: 10,
    width: 270,
    height: 200,
    elevation: 5, // Add elevation for drop shadow
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reviewText: { fontSize: 14, marginBottom: 18 },
  reviewFooter: { flexDirection: "row", alignItems: "center" },
  reviewImage: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  reviewAuthor: { fontSize: 14, fontWeight: "bold" },
  reviewTime: { fontSize: 12, color: "#636363" },

  // Portfolio
  portfolioImage: { width: 200, height: 150, borderRadius: 8, marginRight: 16 },

  // Services
  serviceItem: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  serviceImage: { width: 50, height: 50, borderRadius: 8, marginRight: 16 },
  serviceTitle: { fontSize: 16, fontWeight: "bold" },
  serviceDetails: { fontSize: 14, color: "#636363" },

  // Login modal
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loginContent: { alignItems: "center" },
  loginTitle: { fontSize: 32, fontFamily: "gilroy", marginBottom: 16 },
  loginSubtitle: { fontSize: 18, marginBottom: 8 },
  loginInfo: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: "#C52A66",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  input: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: "#C52A66",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalFooter: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  forgotPasswordText: { color: "#C52A66", marginTop: 16 },
});

export default ProfileDetail;
