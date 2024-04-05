import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  Alert,
  RefreshControl,
  Dimensions,
  Modal,
  TextInput,
  Button,
} from "react-native";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { supabase } from "../services/supabase";
import { reportPostById } from "../services/user";
import { useUser } from "../context/UserContext";
import GigCard from "../component/GigCard";

export default function GigList({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [allowLocation, setAllowLocation] = useState();
  const [location, setLocation] = useState();
  const [gigList, setGigList] = useState([]);
  const { user, setUser } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userDetails, setUserDetails] = useState();

  async function getUser(userid) {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userid)
      .single()
      .limit(1);

    return resp;
  }

  async function deleteGig(item) {
    const userId = supabase.auth.currentUser.id;
    const resp = await supabase
      .from("gigs")
      .delete()
      .eq("user_id", userId)
      .eq("id", item.id);
    console.log("resp", resp);

    return resp;
  }

  async function loginWithEmail() {
    console.log("RUNNING");
    // setModalLoader(true);
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    console.log("email", email);
    console.log("password", password);
    if (error) {
      Alert.alert(error.message);
    } else {
      console.log("user", user.id);

      const resp = await getUser(user.id);
      console.log("resp", resp);
      supabase.auth.setAuth(user.access_token);
      console.log("resp", resp);
      setUser(resp.body);
    }
  }

  const logUserIn = () => {
    loginWithEmail();
    // Add your login logic here
  };

  const handleRefresh = async () => {
    setRefreshing(true); // Set refreshing to true when refreshing starts
    await getGigs(city); // Fetch gigs again
  };

  const handleLoginModal = () => {
    setModalVisible(true);
    // Add your login logic here
  };

  const handleOptionPress = (item) => {
    item.user_id === user.user_id
      ? handleCommentDelete(item)
      : reportPost(item);
  };

  const handleCommentDelete = (item) => {
    Alert.alert(
      "Delete Gig",
      "Are you sure you want to delete this gig?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Your code to delete the post from the backend goes here
              // For example, you might want to call an API endpoint to delete the post
              await deleteGig(item);
              // Assuming the comment is deleted successfully, update the postList
              setGigList((prevPost) =>
                prevPost.filter((postItem) => postItem.id !== item.id)
              );

              Alert.alert(
                "Gig Deleted",
                "Your gig post listing has been has been deleted."
              );

              // Show a success message or perform any other actions after deletion
            } catch (error) {
              console.error("Error deleting comment:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const reportPost = (item) => {
    Alert.alert(
      "Report Post",
      "Are you sure you want to report this Post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Report",
          onPress: async () => {
            try {
              // Your code to report the Post goes here
              // For example, you might want to call an API endpoint to report the post
              await reportPostById(item);
              // Show a success message
              Alert.alert(
                "Report Sent",
                "Your report has been sent. Thank you for your feedback."
              );

              // Perform any other actions after reporting
            } catch (error) {
              console.error("Error reporting post:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const GigCard2 = ({ item, navigation }) => {
    return (
      <>
        <TouchableOpacity onPress={() => handleOptionPress(item)}>
          <Image
            style={{ width: 50, height: 50, left: screenWidth * 0.8 }}
            source={require("../assets/More.png")}
          />
        </TouchableOpacity>
        <Pressable onPress={() => navigation.navigate("GigDetails", item)}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{item.category}</Text>
            <Text style={styles.location}>Location: Miami, Fl</Text>
            <View style={styles.separator}></View>
            <Text style={styles.title}>Description:</Text>
            <Text style={styles.description}>{item.taskDescription}</Text>
            <View style={styles.separator}></View>
            <Text style={styles.title}>Date:</Text>
            <Text style={styles.date}>{item.taskDate}</Text>
          </View>
        </Pressable>
      </>
    );
  };

  const reverseGeocode = async (currentLocation) => {
    try {
      const { coords } = currentLocation;
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        longitude: coords.longitude,
        latitude: coords.latitude,
      });

      const { isoCountryCode, city, region } = reverseGeocodedAddress[0];
      console.log("region", region);
      console.log("Reverse Geocoded:", isoCountryCode);
      setCity(city);
      console.log("city", city);
      setIsLoading(false);
      await getGigs(city); // Call getGigs after setting the city
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAllowLocation(false);
        setIsLoading(false);
        return;
      } else {
        setAllowLocation(true);
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      await reverseGeocode(currentLocation);
    };

    getPermissions();
  }, []);

  const getGigs = async (city) => {
    try {
      const { body: resp } = await supabase
        .from("gigs")
        .select("*")
        .order("created_at", { ascending: false });
      //   console.log("city FROM FUNCTION", city);
      setGigList(resp);
      setLoading(false);
      setRefreshing(false);
      //   console.log("resp", resp);
      return resp;
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

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
        <ActivityIndicator color="grey" />
      </View>
    );
  }

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
            Gigs
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "AirbnbCereal-Medium",
              marginBottom: 10,
              color: "#717171",
            }}
          >
            Log in to see gigs near you
          </Text>
          <Text
            style={{
              fontSize: 20,

              marginBottom: 20,
              color: "#717171",
            }}
          >
            Once you login, you'll be able to see gigs in your area
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

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {gigList.length === 0 ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            alignItems: "center",
            alignContent: "center",
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <Text style={{ top: 100, fontFamily: "alata" }}>
            Currently, there are no gigs available in your area.
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={gigList}
          refreshing={refreshing} // Pass refreshing state to FlatList
          onRefresh={handleRefresh} // Pass refresh function to FlatList
          renderItem={({ item }) => (
            <View
              style={{
                paddingBottom: 60,
                width: 360,
                alignSelf: "center",
                top: 20,
              }}
            >
              <GigCard item={item} navigation={navigation} />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // Instagram typically uses a white background
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60, // Added padding to accommodate button
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginBottom: 20,
    backgroundColor: "grey",

    marginRight: 10,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333", // Instagram typically uses a dark gray for text color
  },
  location: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  separator: {
    height: 0.4,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  requirement: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  date: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF", // Instagram typically uses blue for buttons
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
