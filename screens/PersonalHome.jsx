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

export default function PersonalHome({ navigation }) {
  const [forYouList, setForYouList] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false); // State for refreshing
  const [expoPushToken, setExpoPushToken] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    console.log("REGISTERING FOR PUSH NOTIFICATIONS");
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

        await updateExpoToken(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert("Must use physical device for Push Notifications");
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

    console.log("res", res);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text
        style={{
          alignSelf: "center",
          fontFamily: "Poppins-Black",
          color: "#4A3AFF",
          fontSize: 25,
          marginBottom: 10,
        }}
      >
        tizly
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="What are you looking for?"
        placeholderTextColor="#888"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      {query.length === 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Image
            resizeMode="contain"
            style={{
              height: screenHeight * 0.16,
              alignSelf: "center",
              marginBottom: 15,
            }}
            source={require("../assets/bookingImage.png")}
          />

          <View>{/* ADD CATEGORIES HERE */}</View>

          <View
            style={{
              height: 0.8,
              backgroundColor: "#e0e0e0",
              marginBottom: 10,
              width: screenWidth * 0.95,
              alignSelf: "center",
            }}
          />

          <Text style={[styles.sectionTitle, styles.secondSectionTitle]}>
            Nearby {user.city}, {user.state}
          </Text>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{
              marginBottom: 200,
              alignSelf: "center",
            }}
          >
            {forYouList.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  height: 150,

                  width: screenWidth,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 18,
                    color: "gray",
                    top: 10,
                  }}
                >
                  No Services just yet
                </Text>
              </View>
            ) : (
              forYouList.map((item, index) => (
                <View key={item.id}>
                  <ServiceCard
                    navigation={navigation}
                    item={item}
                    index={index}
                  />
                </View>
              ))
            )}
          </ScrollView>
        </ScrollView>
      ) : (
        <>
          <Text style={[styles.sectionTitle, {}]}>Search Results</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}
          >
            {searchResults.length === 0 ? (
              <View>
                <Text
                  style={[
                    styles.sectionTitle,
                    { marginTop: 20, alignSelf: "center" },
                  ]}
                >
                  No Results Found
                </Text>
              </View>
            ) : (
              <View style={{ alignSelf: "center", marginBottom: 200 }}>
                {searchResults.map((item, index) => (
                  <View key={index.id} index={index.id}>
                    <SearchServiceCard
                      navigation={navigation}
                      item={item}
                      index={index}
                    />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 0.3,
    borderRadius: 12,
    marginBottom: 15,

    backgroundColor: "#F3F3F9",
    paddingHorizontal: 10,

    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "gilroy",
    color: "#444444",
    marginBottom: 15,
    marginLeft: 19,
  },
  secondSectionTitle: {
    marginTop: 4,
  },
  horizontalScroll: {
    marginBottom: 20,
    marginLeft: 1,
  },
  scrollItem: {
    width: 200,
    height: 150,
    marginBottom: 5,
    backgroundColor: "#ccc",
    marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  scrollItemText: {
    color: "#2C3624",
    fontFamily: "interSemiBold",
    fontSize: 16,
    marginBottom: 5,
  },
});
