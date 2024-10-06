import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  Modal,
  Platform,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";
import StarRating from "../component/StarRating";
import ServiceCard from "../component/ServiceCard";
import SearchServiceCard from "../component/SearchServiceCard";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const recommendedData = [
  {
    id: "1",
    name: "David James San Francisco",
    rating: "4.9",
    reviews: "236",
    address: "600 Fillmore Street, San Francisco",
    category: "Hair Salon",
    image: "https://example.com/salon1.jpg", // replace with actual image URLs
  },
  {
    id: "2",
    name: "Creation Beauty Studio",
    rating: "5.0",
    reviews: "83",
    address: "7683 Thornton Avenue",
    category: "Beauty Salon",
    image: "https://example.com/salon2.jpg",
  },
  {
    id: "3",
    name: "Creation Beauty Studio",
    rating: "5.0",
    reviews: "83",
    address: "7683 Thornton Avenue",
    category: "Beauty Salon",
    image: "https://example.com/salon2.jpg",
  },
];

const newToFreshaData = [
  {
    id: "1",
    name: "J. Roland Salon Sausalito",
    rating: "5.0",
    reviews: "82",
    address: "20 Caledonia Street, Sausalito",
    category: "Hair Salon",
    image: "https://example.com/salon3.jpg",
  },
  {
    id: "2",
    name: "Jen Head Spa",
    rating: "4.9",
    reviews: "85",
    address: "Fremont, CA",
    category: "Beauty Spa",
    image: "https://example.com/spa1.jpg",
  },
  {
    id: "3",
    name: "Jen Head Spa",
    rating: "4.9",
    reviews: "85",
    address: "Fremont, CA",
    category: "Beauty Spa",
    image: "https://example.com/spa1.jpg",
  },
];

const HomeScreen = ({ navigation }) => {
  const { user } = useUser();

  const [forYouList, setForYouList] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [refreshing, setRefreshing] = useState(false); // State for refreshing
  const [expoPushToken, setExpoPushToken] = useState("");

  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: "Here is the notification body",
        data: { data: "goes here", test: { test1: "more data" } },
      },
      trigger: { seconds: 2 },
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      // if (finalStatus !== "granted") {
      //   alert("Failed to get push token for push notification!");
      //   return;
      // }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error("Project ID not found");
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log("token", token);

        await updateExpoToken(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      null;
    }

    return token;
  }

  const updateExpoToken = async (token) => {
    console.log("token", token);

    const userId = supabase.auth.currentUser.id;

    const res = await supabase
      .from("profiles")
      .update({ expo_push_token: token })
      .eq("user_id", userId);

    if (res.error) {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    }

    return res;
  };

  async function getForYou() {
    const userLatitude = parseFloat(user.latitude);
    const userLongitude = parseFloat(user.longitude);

    // Function to calculate distance between two lat/lng points
    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 3958.8; // Radius of the Earth in miles
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in miles
    }

    try {
      let query = supabase
        .from("services")
        .select("*")
        .eq("deactivated", false);

      // Fetch all services first
      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned");
      }

      // Filter services within 30 miles of the user's location
      const filteredData = data.filter((service) => {
        const distance = getDistance(
          userLatitude,
          userLongitude,
          parseFloat(service.latitude),
          parseFloat(service.longitude)
        );
        return distance <= 50; // 50 miles radius
      });

      // Shuffle and limit the data to 5 items
      const shuffledData = filteredData.sort(() => 0.5 - Math.random());
      const limitedData = shuffledData.slice(0, 5);

      setForYouList(limitedData);
    } catch (error) {
      console.error("Error fetching For You data:", error.message);
      Alert.alert("Error", "Failed to fetch For You data");
    }
  }

  async function searchServices() {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .ilike("description", `%${query}%`)
        .eq("deactivated", false);

      if (error) {
        throw error;
      }

      setSearchResults(data); // Assuming setSearchResults is correctly defined elsewhere
    } catch (error) {
      console.error("Error searching services:", error.message);
      Alert.alert("Error", "Failed to search services");
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh the data
      await getForYou(); // Ensure this function updates the forYouList
      setRefreshing(false);
    } catch (error) {
      console.error("Error refreshing data:", error.message);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getForYou();
  }, []);

  useEffect(() => {
    if (query.trim() !== "") {
      searchServices();
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const screenWidth = Dimensions.get("window").width;

  const handleCardPress = (item) => {
    console.log(item);
  };

  const renderCard = ({ item }) => (
    <Pressable onPress={() => navigation.navigate("ServiceDetails", { item })}>
      <View style={styles.card}>
        <Image
          source={{ uri: item.thumbnail }} // Use the image URL dynamically
          style={{
            width: screenWidth * 0.7,
            height: screenWidth * 0.64,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            resizeMode: "cover",
          }}
        />
        <View style={{ padding: 5 }}>
          <Text style={styles.cardTitle}>{item.title}</Text>

          <Text style={styles.cardAddress}>
            {item.city}, {item.state}
          </Text>
          <Text style={styles.cardCategory}>Starting at ${item.price}</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "blue",
        borderRadius: 8,
        margin: 4,
        width: "40%", // Adjust based on your design
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={{ padding: 1 }}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hey {user.username}</Text>
          </View>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#dcdcdc",
              borderRadius: 10,
              padding: 15,
              fontSize: 16,
              backgroundColor: "#fff",
              marginBottom: 2,
            }}
            placeholder="What are you looking for?"
            autoCapitalize="none"
          />

          {/* Categories Section */}

          {/* Savings Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              invite a friend to earn 15% of your next booking
            </Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreText}>Explore One Key benefits</Text>
            </TouchableOpacity>
          </View>

          {/* Recommended Section */}
          <Text style={styles.sectionTitle}>Recommended</Text>
          <View style={{ marginBottom: 10 }}>
            <FlatList
              horizontal
              data={forYouList}
              renderItem={renderCard}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <Text style={styles.sectionTitle}>New to Book Mate</Text>
          <FlatList
            horizontal
            data={forYouList}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
  },
  categoriesContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    margin: 4,
    width: "60%", // Adjust based on your design
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  messageContainer: {
    backgroundColor: "#e6f0ff",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    marginTop: 20,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 18,
    alignSelf: "center",
  },
  exploreButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  exploreText: {
    color: "white",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 0.2,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginRight: 30,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 1,
    marginBottom: 2,
  },
  cardRating: {
    fontSize: 14,
    marginTop: 5,
  },
  cardAddress: {
    fontSize: 12,
    color: "#777",
  },
  cardCategory: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});

export default HomeScreen;
