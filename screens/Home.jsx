import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Linking,
  TouchableOpacity,
  Animated,
  Button, // Import ScrollView
} from "react-native";
import { Appearance, useColorScheme } from "react-native";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native"; // Import useScrollToTop

import { getRandomUser } from "../services/user";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import { useUser } from "../context/UserContext";
import MapView from "react-native-maps";
import HomeCard from "../component/HomeCard";

export default function Home({ navigation }) {
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;
  const mapRef = useRef();

  const [loading, setLoading] = useState(true);
  const [trendingUsers, setTrendingUsers] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(); // Ref for ScrollView
  const [location, setLocation] = useState();
  const [city, setCity] = useState();
  const [isLoading, setIsLoading] = useState(true); // Introducing loading state
  const [allowLocation, setAllowLocation] = useState();
  let colorScheme = useColorScheme();
  const { user } = useUser();

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const focusMap = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const reverseGeocode = async (currentLocation) => {
    try {
      const { coords } = currentLocation;
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        longitude: coords.longitude,
        latitude: coords.latitude,
      });

      const { isoCountryCode, city, subregion, region } =
        reverseGeocodedAddress[0];

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
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <MapView
        style={{
          zIndex: -1, // Ensure the map is behind other components
          height: height * 0.6,
          borderRadius: 5,
        }}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.018, // Adjust the latitudeDelta for street level
          longitudeDelta: 0.018, // Adjust the longitudeDelta for street level
        }}
        ref={mapRef}
      ></MapView>
      <TouchableOpacity
        onPress={focusMap}
        style={{
          bottom: height * 0.09,
          left: width * 0.88,
          elevation: 5,

          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 6.25,
          shadowRadius: 3.84,
        }}
      >
        <Image
          style={{
            height: 40,
            width: 40,
          }}
          source={require("../assets/focus.png")}
        />
      </TouchableOpacity>
      <HomeCard location={location} city={city} navigation={navigation} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
