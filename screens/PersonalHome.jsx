import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  Pressable,
  Animated,
  Image,
  Alert,
  Dimensions,
  RefreshControl, // Import RefreshControl
  Platform,
} from "react-native";
import { useUser } from "../context/UserContext"; // Import useUser context
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons
import { supabase } from "../services/supabase";
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

const PersonalHome = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value is 0
  const { user, setUser } = useUser(); // Destructure user and setUser from the useUser hook
  const [forYouList, setForYouList] = useState([]);
  const [newServices, setNewServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  // Function to refresh the data
  const onRefresh = async () => {
    setRefreshing(true);
    await getForYou();
    await getNew();
    setRefreshing(false);
  };

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

  // Sample services to display when typing into the search bar
  const services = [
    { name: "Car Detailing", icon: "car-sport-outline" },
    { name: "Home Cleaning", icon: "home-outline" },
    { name: "Lawn Mowing", icon: "leaf-outline" },
    { name: "Photography", icon: "camera-outline" },
    { name: "Personal Training", icon: "barbell-outline" },
    { name: "Pet Grooming", icon: "paw-outline" },
    { name: "Videography", icon: "videocam-outline" },
    { name: "Massage", icon: "body-outline" },
  ];

  // Reusable function to calculate distance between two lat/lng points
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

  // Reusable function to fetch services
  async function fetchServices(
    query,
    userLatitude,
    userLongitude,
    radius = 50,
    limit = 12
  ) {
    try {
      // Fetch all services using the provided query
      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned");
      }

      // Filter services within the specified radius of the user's location
      const filteredData = data.filter((service) => {
        const distance = getDistance(
          userLatitude,
          userLongitude,
          parseFloat(service.latitude),
          parseFloat(service.longitude)
        );
        return distance <= radius;
      });

      // Shuffle and limit the data to the specified number of items
      const shuffledData = filteredData.sort(() => 0.5 - Math.random());
      return shuffledData.slice(0, limit);
    } catch (error) {
      console.error("Error fetching services:", error.message);
      Alert.alert("Error", "Failed to fetch services");
      return [];
    }
  }

  // Function to get services "For You"
  async function getForYou() {
    const userLatitude = parseFloat(user.latitude);
    const userLongitude = parseFloat(user.longitude);

    let query = supabase.from("services").select("*").eq("deactivated", false);

    const forYouServices = await fetchServices(
      query,
      userLatitude,
      userLongitude
    );
    setForYouList(forYouServices);
  }

  // Function to get new services
  async function getNew() {
    const userLatitude = parseFloat(user.latitude);
    const userLongitude = parseFloat(user.longitude);

    let query = supabase
      .from("services")
      .select("*")
      .eq("deactivated", false)
      .order("id", { ascending: false });

    const newServicesData = await fetchServices(
      query,
      userLatitude,
      userLongitude
    );
    setNewServices(newServicesData);
  }

  useEffect(() => {
    // Call these functions to fetch data when the component mounts
    getForYou();
    getNew();

    // Fade-in effect when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Duration of the fade-in effect in milliseconds
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Filter services based on search query
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Search Input with Clear Button */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search on Tizly"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <Pressable style={styles.clearButton} onPress={handleClearSearch}>
              <Text style={styles.clearButtonText}>X</Text>
            </Pressable>
          )}
        </View>

        {searchQuery === "" ? (
          <>
            {/* Today's picks header */}
            <View style={styles.picksHeader}>
              <Text style={styles.picksText}>Today's picks</Text>

              <Pressable onPress={() => navigation.navigate("EditLocation")}>
                <View style={styles.locationContainer}>
                  <Icon
                    name="location-outline"
                    size={18}
                    color="#000"
                    style={styles.locationIcon}
                  />
                  <Text style={styles.locationText}>
                    {user?.city && user?.state
                      ? `${user.city}, ${user.state}`
                      : "North Miami, Florida"}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Product grid displaying For You Services */}
            {forYouList.length === 0 ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.noServicesContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                <Text style={styles.noServicesText}>
                  No services available at the moment. Please check back later.
                </Text>
              </ScrollView>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.grid}
                style={{ backgroundColor: "#f8f9fa" }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                {forYouList.map((service, index) => (
                  <Pressable
                    key={index}
                    style={styles.productContainer}
                    onPress={() =>
                      navigation.navigate("ServiceDetails", { item: service })
                    }
                  >
                    <Image
                      source={{ uri: service.thumbnail }}
                      style={styles.thumbnail}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productPrice} numberOfLines={1}>
                        ${service.price}
                      </Text>

                      <Text style={styles.productTitle} numberOfLines={1}>
                        • {service.title}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </>
        ) : (
          <>
            {/* Services list filtered by search query */}

            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: height * 0.3,
              }}
              showsVerticalScrollIndicator={false}
              data={filteredServices}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Category", { item })}
                  style={styles.serviceContainer}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    color="#000"
                    style={styles.serviceIcon}
                  />
                  <Text style={styles.serviceText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    No matching services found
                  </Text>
                </View>
              )}
            />
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 2,
  },
  noServicesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noServicesText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginVertical: 10,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#F1F2F6",
    borderWidth: 1,
    borderColor: "#dcdcdc",

    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  clearButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: "#888",
  },
  picksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    marginLeft: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginRight: 10,
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E90FF",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productContainer: {
    width: "49.5%",
    marginBottom: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    padding: 5,
  },
  picksText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    backgroundColor: "#EEEFF2",
    borderRadius: 5,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  productPrice: {
    fontSize: 14,

    marginRight: 5,
  },
  serviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  serviceIcon: {
    marginRight: 10,
  },
  serviceText: {
    fontSize: 16,
  },
  noResultsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: "#888",
  },
});

export default PersonalHome;
