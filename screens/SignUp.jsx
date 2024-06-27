import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";

export default function SignUp({ route, navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState(false);

  const { user, setUser } = useUser();

  const signUpWithEmail = async () => {
    setModal(true);
    // Input validation
    if (password.length < 8) {
      Alert.alert("Password should be 8 or more characters");
      setModal(false);
      return;
    }

    if (!email) {
      Alert.alert("Please fill in all field inputs");
      setModal(false);

      return;
    }

    try {
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (!error) {
        const userId = supabase.auth.currentUser.id;
        const resp = await supabase.from("profiles").insert([
          {
            username: username,
            user_id: userId,
            email: email,
          },
        ]);

        // Delay setting modal to false by 3 seconds
        setTimeout(() => {
          setModal(false);
        }, 6000);

        navigation.goBack();
        setUser(resp.body[0]);
        Alert.alert("Sign Up Successful");
        return resp;
      } else {
        setModal(false);
        Alert.alert(error.message);
        console.error("Error during sign-up:", error);
      }
      setModal(false);

      return { user, error };
    } catch (error) {
      setModal(false);
      console.error("An error occurred during sign-up:", error);
      Alert.alert("An error occurred. Please try again later.");

      return { user: null, error };
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#A0A0A0"
          placeholder="Name"
          value={username}
          onChangeText={(text) => setUserName(text)}
        />

        <TextInput
          style={styles.input}
          placeholderTextColor="#A0A0A0"
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholderTextColor="#A0A0A0"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity
          onPress={() => signUpWithEmail()}
          style={styles.signupButton}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType={"slide"} visible={modal}>
        <View style={{ top: 200 }}>
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "700",
              fontSize: 23,
              marginBottom: 20,
            }}
          >
            Creating Your Profile
          </Text>
          <LottieView
            autoPlay
            style={{ height: 200, width: 200, alignSelf: "center" }}
            source={require("../assets/lottie/blueCircle.json")}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FAFAFA",
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
