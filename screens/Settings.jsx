import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
  Switch,
} from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";

export default function Settings({ navigation }) {
  const { user, setUser } = useUser();
  const [modal, setModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function getUser(userid) {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userid)
      .single()
      .limit(1);

    return resp;
  }

  async function editAccountType() {
    const userId = supabase.auth.currentUser.id;

    const res = await supabase
      .from("profiles")
      .update({
        type: user.type === "business" ? "personal" : "business",
      })
      .eq("user_id", userId);

    if (res.error === null) {
      setUser(res.body[0]);
    } else {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    }

    return res;
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
      console.log("resp", resp);
      setUser(resp.body);
    }
  }

  const handleLoginModal = () => {
    setModalVisible(true);
    // Add your login logic here
  };

  const logUserIn = () => {
    loginWithEmail();
    // Add your login logic here
  };

  async function signOutUser() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // Function to handle log out action
  const handleLogOut = async () => {
    // Your log out logic here
    setModal(true);
    await signOutUser();
    setUser(null);
    console.log("Logging out...");
    navigation.navigate("HomeScreen");
    setModal(false);
  };

  const handleLogIn = async () => {
    // Your log out logic here
    handleLoginModal();
  };

  const handleAuth = () => {
    user ? handleLogOut() : handleLogIn();
  };

  return (
    <View style={styles.container}>
      {/* Example settings options */}
      {user && (
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
          style={styles.optionContainer}
        >
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
      {user && (
        <TouchableOpacity
          onPress={() => editAccountType()}
          style={styles.optionContainer}
        >
          <Text style={styles.optionText}>
            {user.type === "personal"
              ? "Switch To Business Account"
              : "Switch To Personal Account"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Log out button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleAuth}>
        <Text style={styles.logoutButtonText}>
          {user ? "log out" : "login"}
        </Text>
      </TouchableOpacity>
      <Modal visible={modal} animationType="slide">
        <LottieView
          style={{
            height: 130,
            width: 130,
            top: 290,
            alignSelf: "center",
          }}
          source={require("../assets/lottie/grey-loader.json")}
          autoPlay
        />
      </Modal>
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
              marginBottom: 20,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingVertical: 25,
  },
  optionText: {
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
