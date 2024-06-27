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
import MapView from "react-native-maps";
import Login from "./Login";

const UserProfile = ({ route, navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loadingGrid, setLoadingGrid] = useState(true);
  const [profilePost, setProfilePost] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [userID, setUserID] = useState(user?.user_id);

  if (!user) {
    return <Login />;
  }

  const handleLoginModal = () => setModalVisible(true);

  const getUser = async (userid) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userid)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user data: ", error);
      Alert.alert("Error", "Failed to fetch user data");
    }
  };

  const loginWithEmail = async () => {
    try {
      const { user, error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) throw error;

      const userProfile = await getUser(user.id);
      supabase.auth.setAuth(user.access_token);
      setUser(userProfile);
      setIsLoggedIn(true);
      setModalVisible(false);
    } catch (error) {
      console.error("Login error: ", error);
      Alert.alert("Login Error", error.message);
    }
  };

  const handleDeactiveAccount = async () => {
    await deleteUserTasks();
    await deleteMessages();
    await deleteAccount(userID);
    await deleteProfileSchema();
  };
  async function deleteProfileSchema() {
    console.log("user", user);
    const { data, error: deleteError } = await supabase.auth.api.deleteUser(
      user.user_id
    );

    console.log("data", data);

    console.log("DELETE SUCCESSFUL", data);
    signOutUser();

    if (deleteError) {
      console.log("ERROR DELETE", deleteError);
      throw deleteError;
    }
  }
  const deleteUserTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("taskCreator", user.user_id);

    console.log("TASK DELETED");
  };

  const deleteMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .delete()
      .like("threadID", `%${user.user_id}%`);

    console.log("Messages DELETED");

    return data;
  };

  const deleteAccount = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", userID);

    console.log("DELETE FROM PROFILE");

    console.log("error", error);
    return data;
  };

  const createAlert = async (service) =>
    Alert.alert(
      "Deactive Account",
      "This action cannot be undone. Are you sure you want to delete?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            await handleDeactiveAccount();

            // Add your delete logic here
          },
        },
      ]
    );

  const logUserIn = () => loginWithEmail();

  const signOutUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
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
  }, [user]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  if (isLoggedIn === false) {
    return (
      <View>
        <Text>NO USER</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: user.profileimage }}
              style={{
                height: 70,
                width: 70,
                borderRadius: 40,
                marginBottom: 15,
                backgroundColor: "grey",
                borderWidth: 1,
                borderColor: "green",
              }}
            />
            <Text style={styles.profileName}>{user.username}</Text>
            <Text
              style={{
                fontSize: 20,
                color: "grey",
                marginBottom: 1,
                alignSelf: "center",
              }}
            >
              {user.type}
            </Text>
          </View>
          {/* <View style={styles.profileStats}>
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
          </View> */}
        </View>
        <View style={styles.separator} />

        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
          style={styles.optionContainer}
        >
          <Image
            source={require("../assets/profileNotActive.png")}
            style={styles.icon}
          />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("OffersScreen")}
          style={styles.optionContainer}
        >
          <Image
            source={require("../assets/CalendarNotActive.png")}
            style={styles.icon}
          />
          <Text style={styles.optionText}>My Orders</Text>
        </TouchableOpacity>

        {user.type === "business" ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("MyOffers")}
            style={styles.optionContainer}
          >
            <Image
              source={require("../assets/Document.png")}
              style={styles.icon}
            />
            <Text style={styles.optionText}>My Services</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => navigation.navigate("MyServices")}
          style={styles.optionContainer}
        >
          <Image source={require("../assets/Wallet.png")} style={styles.icon} />
          <Text style={styles.optionText}>My Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("EditLocation")}
          style={styles.optionContainer}
        >
          <Image
            source={require("../assets/Location.png")}
            style={styles.icon}
          />
          <Text style={styles.optionText}>My Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => createAlert()}
          style={styles.optionContainer}
        >
          <Image source={require("../assets/Hide.png")} style={styles.icon} />
          <Text style={styles.optionText}>Deactivate Account</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => signOutUser()} style={styles.button}>
            <Text style={styles.buttonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main containers
  container: { flex: 1, backgroundColor: "white" },
  scrollView: { padding: 16 },
  separator: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 16 },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 14, color: "#636363" },
  serviceInfo: {
    padding: 10,
  },

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
  profileName: { fontSize: 22, marginBottom: 1 },

  profileInfo: { alignItems: "center" },
  profileStats: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },

  serviceCategory: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  serviceRating: {
    fontSize: 14,
    color: "grey",
    marginBottom: 2,
  },
  servicePrice: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 1,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  map: {
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "green",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default UserProfile;
