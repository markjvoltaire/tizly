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

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const screenName = "UserProfile";

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ alignItems: "center", marginTop: 20, marginBottom: 30 }}>
        <Image
          source={{ uri: user.profileimage }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ marginTop: 10, fontSize: 18 }}>{user.username}</Text>
      </View>

      <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Account Settings</Text>
        <TouchableOpacity style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, color: "#1DA1F2" }}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16, color: "#1DA1F2" }}>
            Push Notifications
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Support</Text>
        <TouchableOpacity style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, color: "#1DA1F2" }}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16, color: "#1DA1F2" }}>About</Text>
        </TouchableOpacity>
      </View>

      {/* Signout Button */}

      <Pressable onPress={signOutUser}>
        <View
          style={{
            top: 40,
            flexDirection: "row",
            alignItems: "center",
            width: 328,
            height: 72,
            backgroundColor: "white",
            alignSelf: "center",
            borderRadius: 16,
            marginBottom: 20,
            elevation: 5, // Add elevation for drop shadow
            shadowColor: "#000", // Shadow color
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Sign Out
            </Text>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
