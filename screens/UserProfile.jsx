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
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for icons
import { getPosts } from "../services/user";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";
import { supabase } from "../services/supabase";

export default function UserProfile({ route, navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loadingGrid, setLoadingGrid] = useState(true);
  const [profilePost, setProfilePost] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!user ? false : true);

  // 179 CHARCTER LIMIT FOR REVIEWS

  // IF NO USER IS LOGGED IN
  if (isLoggedIn === false) {
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
              marginBottom: 20,
            }}
          >
            Profile
          </Text>
          <Text
            style={{
              fontSize: 15,
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
                marginBottom: 20,
              }}
            >
              <Text style={{ marginRight: 5 }}>Don't have an account?</Text>
              <Button
                title="Sign Up"
                onPress={() => {
                  // Add your sign up functionality here
                  setModalVisible(false);
                  navigation.navigate("ProfileTypeSelect", { screenName });
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                marginBottom: 10,
                marginBottom: 20,
              }}
              onPress={() => {
                // Add your forgot password functionality here
                setModalVisible(false);
                navigation.navigate("ResetPassword");
              }}
            >
              <Text style={{ color: "#007AFF", fontSize: 16 }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
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
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const screenName = "UserProfile";

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

  const signOutUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{
          borderRadius: 10,

          elevation: 5, // Add elevation for drop shadow
          backgroundColor: "white",
          flex: 1,
        }}
      >
        {/* PROFILE CARD */}
        <View
          style={{
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            backgroundColor: "white",
            width: screenWidth * 0.9,
            height: screenHeight * 0.2,
            elevation: 5, // Add elevation for drop shadow
            shadowColor: "#000", // Shadow color
            top: screenHeight * 0.02,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            marginBottom: 40,
            paddingHorizontal: 15, // Padding for inner content
            paddingVertical: 10, // Padding for inner content
            flexDirection: "row",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingRight: 80,
            }}
          >
            <Image
              source={{ uri: user.profileimage }}
              style={{
                height: 90,
                width: 90,
                borderRadius: 100,
                marginBottom: 10,
              }}
            />
            <Text
              style={{
                alignSelf: "center",
                fontFamily: "gilroy",
                fontSize: 25,
              }}
            >
              {user.username}
            </Text>
            <Text style={{ alignSelf: "center", fontFamily: "", fontSize: 10 }}>
              {user.profession}
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={{ alignItems: "center", marginBottom: 15 }}>
              <Text style={{ fontFamily: "gilroy", fontSize: 20 }}>5.0</Text>
              <Text style={{ fontSize: 10 }}>Rating</Text>
            </View>
            <View style={{ alignItems: "center", marginBottom: 15 }}>
              <Text style={{ fontFamily: "gilroy", fontSize: 20 }}>15</Text>
              <Text style={{ fontSize: 10 }}>Reviews</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: "gilroy", fontSize: 20 }}>28</Text>
              <Text style={{ fontSize: 10 }}>Bookings</Text>
            </View>
          </View>
        </View>
        {/* PROFILE CARD */}

        <View
          style={{
            width: screenWidth * 0.88,
            alignSelf: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 19, fontFamily: "gilroy", marginBottom: 2 }}>
            Reviews
          </Text>

          <FlatList
            style={{ right: 10 }}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={classes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Animated.View style={{ opacity: fadeAnim, padding: 5 }}>
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: "white",
                    width: screenWidth * 0.59,
                    height: screenHeight * 0.22,
                    elevation: 5, // Add elevation for drop shadow
                    shadowColor: "#000", // Shadow color
                    top: 10,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    marginBottom: 15,
                    paddingHorizontal: 15, // Padding for inner content
                    paddingVertical: 10, // Padding for inner content
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <View
                      style={{
                        marginBottom: 10,
                        height: 120,
                        width: screenWidth * 0.53,
                      }}
                    >
                      <Text style={{ fontSize: 12, lineHeight: 20 }}>
                        "Mark's session was phenomenal! His talent and
                        professionalism truly shine. I'm delighted with the
                        stunning photos he captured. Highly recommend!"
                      </Text>
                    </View>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View>
                        <Image
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: 20,
                            marginRight: 10,
                          }}
                          source={require("../assets/photo2.jpg")}
                        />
                      </View>
                      <View>
                        <Text style={{ fontFamily: "gilroy" }}>stephanie</Text>
                        <Text style={{ fontSize: 10 }}>2 weeks ago</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Animated.View>
            )}
          />

          <View
            style={{
              height: 0.5,
              backgroundColor: "#E0E0E0",
              marginVertical: 10,
              marginBottom: 15,
            }}
          />

          <Text
            style={{ fontSize: 19, fontFamily: "gilroy", marginBottom: 15 }}
          >
            Portfolio
          </Text>

          <FlatList
            style={{
              marginBottom: 10,
              width: screenWidth * 0.97,
              alignSelf: "center",
            }}
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
                        height: 110,
                        width: 110,
                        resizeMode: "cover",
                        marginHorizontal: 10,
                        borderRadius: 10,
                        backgroundColor: "grey",
                        marginRight: 1,
                      }} // Add marginHorizontal for spacing
                      source={item.image}
                    />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          />
          <View
            style={{
              height: 0.5,
              backgroundColor: "#E0E0E0",
              marginVertical: 10,
              marginBottom: 20,
            }}
          />
          <Text
            style={{ fontSize: 19, fontFamily: "gilroy", marginBottom: 15 }}
          >
            Services
          </Text>

          <Pressable onPress={() => console.log("YERPP")}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{
                  height: 160,
                  width: 160,
                  resizeMode: "cover",
                  marginRight: 12,
                  borderRadius: 10,
                  backgroundColor: "grey",
                }} // Add marginHorizontal for spacing
                source={require("../assets/photo1.jpg")}
              />
              <View>
                <Text
                  style={{ fontSize: 15, marginBottom: 1, fontWeight: "600" }}
                >
                  Lifestyle Package
                </Text>
                <Text style={{ fontSize: 11, lineHeight: 20 }}>
                  1 hour photoshoot
                </Text>
                <Text
                  style={{ fontSize: 11, lineHeight: 20, fontFamily: "gilroy" }}
                >
                  from $200
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
});
