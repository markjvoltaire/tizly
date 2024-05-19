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

      const { isoCountryCode, city } = reverseGeocodedAddress[0];
      console.log("reverseGeocodedAddress", reverseGeocodedAddress[0]);
      // console.log("Reverse Geocoded:", isoCountryCode);
      setCity(city); // Assuming `setCity` is defined elsewhere
      setIsLoading(false); // Set loading state to false when done
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      setIsLoading(false); // Set loading state to false when done
    }
  };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const getPermissions = async () => {
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         console.log("Please grant location permissions");
  //         setAllowLocation(false);
  //         setIsLoading(false); // Set loading state to false when done
  //         return;
  //       } else {
  //         setAllowLocation(true);
  //       }

  //       let currentLocation = await Location.getCurrentPositionAsync({});
  //       setLocation(currentLocation);
  //       // console.log("Location:", currentLocation);
  //       reverseGeocode(currentLocation);
  //     };

  //     getPermissions(); // Call getPermissions when screen is focused
  //   }, [])
  // );

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
      console.log("Location:", currentLocation);
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
    {
      id: 1,
      profession: "Photographer",
      image: require("../assets/Camera.png"),
    },
    {
      id: 2,
      profession: "Videographer",
      image: require("../assets/Video.png"),
    },
    { id: 3, profession: "Auto", image: require("../assets/Password.png") },
    { id: 4, profession: "DJ", image: require("../assets/Password.png") },
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
              source={require("../assets/moreCircleBlack.png")}
            />
          </Pressable>
        </View>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: "white" }}
        >
          <View>
            <View
              style={{
                alignItems: "center",
                backgroundColor: "white",
                height: 50,
                paddingBottom: 80,
              }}
            >
              <TouchableOpacity style={{ bottom: 17, alignSelf: "center" }}>
                <Image
                  style={{ height: 100, width: 360, resizeMode: "contain" }}
                  source={require("../assets/searchIn.png")}
                />
              </TouchableOpacity>
            </View>
            {/* Carousel */}
            <View style={{ paddingBottom: 20, backgroundColor: "white" }}>
              <Text
                style={{
                  left: 18,
                  paddingBottom: 20,
                  fontWeight: "500",
                  fontSize: 20,
                }}
              >
                In {city}
              </Text>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={trendingUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <Animated.View style={{ opacity: fadeAnim }}>
                    <TouchableOpacity onPress={() => goToProfile(item)}>
                      <Image
                        style={{
                          height: 90,
                          width: 90,
                          resizeMode: "cover",
                          marginHorizontal: 15,
                          borderRadius: 160,
                          backgroundColor: "grey",
                          marginBottom: 5,
                        }} // Add marginHorizontal for spacing
                        source={{ uri: item.profileimage }}
                      />
                      <Text
                        style={{
                          alignSelf: "center",
                        }}
                      >
                        {item.username}
                      </Text>
                      <Text
                        style={{
                          alignSelf: "center",
                          marginBottom: 5,
                          fontSize: 12,
                          color: "grey",
                        }}
                      >
                        {item.profession}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              />
            </View>

            <View style={{ paddingBottom: 1, backgroundColor: "white" }}>
              <Text
                style={{
                  left: 18,
                  fontWeight: "500",
                  fontSize: 20,
                  paddingBottom: 20,
                }}
              >
                Trending Services
              </Text>
              <FlatList
                style={{ marginBottom: 25 }}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={classes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View>
                    <Animated.View style={{ opacity: fadeAnim }}>
                      <TouchableOpacity>
                        <Image
                          style={{
                            height: 150,
                            width: 260,
                            resizeMode: "cover",
                            marginHorizontal: 10,
                            borderRadius: 16,
                            backgroundColor: "grey",
                          }} // Add marginHorizontal for spacing
                          source={item.image}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                    <View
                      style={{
                        width: width * 0.65,
                        left: 12,
                      }}
                    >
                      <Text style={{}}>{item.title}</Text>
                      <Text style={{ color: "grey" }}>{item.name}</Text>
                    </View>
                  </View>
                )}
              />
            </View>

            <View style={{ backgroundColor: "white" }}>
              <Text
                style={{
                  left: 18,
                  paddingBottom: 20,
                  fontWeight: "500",
                  fontSize: 20,
                }}
              >
                Gigs Near You
              </Text>
              <FlatList
                style={{ marginBottom: 50 }}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={classes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View>
                    <Animated.View style={{ opacity: fadeAnim }}>
                      <TouchableOpacity>
                        <Image
                          style={{
                            height: 150,
                            width: 260,
                            resizeMode: "cover",
                            marginHorizontal: 10,
                            borderRadius: 16,
                            backgroundColor: "grey",
                          }} // Add marginHorizontal for spacing
                          source={item.image}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                    <View
                      style={{
                        width: width * 0.65,
                        left: 12,
                      }}
                    >
                      <Text style={{}}>{item.title}</Text>
                      <Text style={{ color: "grey" }}>{item.name}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
