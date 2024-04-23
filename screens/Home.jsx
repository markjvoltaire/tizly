import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Linking,
  TouchableOpacity,
  Animated,
  FlatList,
  ScrollView,
  Pressable,
  Button, // Import ScrollView
} from "react-native";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native"; // Import useScrollToTop
import { supabase } from "../services/supabase";
import { getRandomUser } from "../services/user";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import { useUser } from "../context/UserContext";

export default function Home({ navigation }) {
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  const [loading, setLoading] = useState(true);
  const [trendingUsers, setTrendingUsers] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(); // Ref for ScrollView

  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [isLoading, setIsLoading] = useState(true); // Introducing loading state
  const [allowLocation, setAllowLocation] = useState();
  const { user } = useUser();

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const goToProfile = (item) => {
    if (!user) {
      navigation.navigate("ProfileDetail", { item });
    } else if (item.user_id === user.user_id) {
      navigation.navigate("UserProfile");
    } else {
      navigation.navigate("ProfileDetail", { item });
    }
  };

  const reverseGeocode = async (currentLocation) => {
    try {
      const { coords } = currentLocation;
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        longitude: coords.longitude,
        latitude: coords.latitude,
      });

      const { isoCountryCode, city, subregion } = reverseGeocodedAddress[0];
      // console.log("reverseGeocodedAddress", reverseGeocodedAddress[0]);
      // console.log("Reverse Geocoded:", isoCountryCode);
      setCity(subregion); // Assuming `setCity` is defined elsewhere
      setIsLoading(false); // Set loading state to false when done
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      setIsLoading(false); // Set loading state to false when done
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      const getPermissions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Please grant location permissions");
          setAllowLocation(false);
          setIsLoading(false); // Set loading state to false when done
          return;
        } else {
          setAllowLocation(true);
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        // console.log("Location:", currentLocation);
        reverseGeocode(currentLocation);
      };

      getPermissions(); // Call getPermissions when screen is focused
    }, [])
  );

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // console.log("Please grant location permissions");
        setAllowLocation(false);
        setIsLoading(false); // Set loading state to false when done
        return;
      } else {
        setAllowLocation(true);
      }

      let currentLocation = await Location.getCurrentPositionAsync({});

      setLocation(currentLocation);
      // console.log("Location:", currentLocation);
      reverseGeocode(currentLocation);
    };
    getPermissions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getRandomUser();

        setTrendingUsers(resp);
        const timeout = setTimeout(() => {
          setLoading(false);
          fadeIn();
        }, 1000);

        return () => {
          clearTimeout(timeout);
          fadeAnim.setValue(0); // Reset the fade animation when component unmounts
        };
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  };

  useScrollToTop(scrollViewRef); // Hook up useScrollToTop to ScrollView

  // Mock data for carousel items

  const classes = [
    {
      id: "1",
      title: "Personal Training",
      name: "Fit Wit Jess",
      type: "fitness",
      price: "$40",
      image: require("../assets/trainer.jpg"),
    },
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
  ];

  const professions = [
    { id: 1, profession: "Catering" },
    { id: 2, profession: "Barber" },
    { id: 3, profession: "Photographer" },
    { id: 4, profession: "Fitness" },
    { id: 5, profession: "Make Up Artist" },
    { id: 6, profession: "Home Improvement" },
    { id: 7, profession: "Visual Media" },
    { id: 8, profession: "Hair Stylist" },
    { id: 9, profession: "DJ" },
    { id: 10, profession: "Mechanic" },
    { id: 11, profession: "Bartender" },
    { id: 12, profession: "Videographer" },
  ];

  if (loading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <LottieView
          style={{
            height: 500,
            width: 500,
            alignSelf: "center",
          }}
          source={require("../assets/lottie/location.json")}
          autoPlay
        />
        <Text style={{ fontFamily: "alata" }}>Loading</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <LottieView
          style={{
            height: 500,
            width: 500,
            alignSelf: "center",
          }}
          source={require("../assets/lottie/location.json")}
          autoPlay
        />
        <Text style={{ fontFamily: "alata" }}>Searching For Locals</Text>
      </View>
    );
  }

  if (allowLocation === false) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            color: "#333",
            fontFamily: "Arial",
            marginBottom: 20,
          }}
        >
          Location Access Disabled
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: "#666",
            fontFamily: "Arial",
            marginBottom: 30,
          }}
        >
          To use this feature, enable location access in your device settings.
        </Text>
        <Button
          title="Open Settings"
          onPress={handleOpenSettings}
          color="#ff5f5f"
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={{
        // opacity: fadeAnim,
        flex: 1,
        backgroundColor: "white",
        paddingBottom: 10,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", paddingBottom: 10 }}>
          <Pressable style={{ flexDirection: "row" }}>
            <Image
              style={{
                height: 30,
                width: 30,
                left: 15,
                resizeMode: "contain",
                marginRight: 20,
              }}
              source={require("../assets/Location.png")}
            />
            <Text style={{ top: 6, fontFamily: "alata" }}>{city}</Text>
          </Pressable>

          <Pressable
            style={{ marginLeft: "auto", marginRight: 18, top: 4 }}
            onPress={() => navigation.navigate("Settings")}
          >
            <Image
              style={{
                height: 28,
                width: 28,
                resizeMode: "contain",
                marginLeft: "auto",
                marginRight: 12,
              }}
              source={require("../assets/Setting.png")}
            />
          </Pressable>
        </View>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View>
            {/* Carousel */}

            <View style={{ paddingBottom: 50 }}>
              <Text
                style={{
                  fontWeight: "600",
                  left: 18,
                  marginBottom: 30,
                  fontSize: 22,
                  top: 30,
                }}
              >
                What service are you looking for?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  paddingHorizontal: 10,
                  left: 5,
                  top: 50,
                }}
              >
                {professions.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      flexBasis: "33.33%",
                      marginBottom: 20,
                      paddingRight: 10,
                    }}
                  >
                    <Animated.View style={{ opacity: fadeAnim }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Category", { item })
                        }
                        style={{
                          backgroundColor: "white",
                          alignItems: "center",
                          height: 100,
                          justifyContent: "center",
                          borderRadius: 9,
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: "black",
                          }}
                        >
                          {item.profession}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
