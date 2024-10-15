import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BusinessSignUp({ route, navigation }) {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState(false);

  const accountNumber = route.params.accountNumber;
  const routingNumber = route.params.routingNumber;
  const ssn = route.params.ssn;
  const dob = route.params.route.params.route.params.dob;
  const mcc = route.params.route.params.route.params.mcc.code;
  const mccDescription = route.params.route.params.route.params.mcc.description;
  const address = route.params.route.params.route.params.userInfo.address;
  const city = route.params.route.params.route.params.userInfo.city;
  const state = route.params.route.params.route.params.userInfo.state;
  const zipCode = route.params.route.params.route.params.userInfo.zipCode;
  const firstName =
    route.params.route.params.route.params.userInfo.details.firstName;
  const lastName =
    route.params.route.params.route.params.userInfo.details.lastName;
  const type = route.params.route.params.route.params.userInfo.details.type;
  const longitude = route.params.route.params.route.params.userInfo.longitude;
  const latitude = route.params.route.params.route.params.userInfo.latitude;

  const month = route.params.route.params.route.params.month;
  const day = route.params.route.params.route.params.day;
  const year = route.params.route.params.route.params.year;

  const signUpWithEmail = async (json) => {
    setModal(true);
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
            type: type,
            city: city,
            state: state,
            latitude: latitude,
            longitude: longitude,
            stripeAccountId: json.account,
            niche: mccDescription,
          },
        ]);
        setUser(resp.body[0]);
        setModal(false);
        return resp;
      } else {
        setModal(false);
        Alert.alert(error.message);
        console.error("Error during sign-up:", error);
        setUser(null);
        return;
      }
    } catch (error) {
      setModal(false);
      console.error("An error occurred during sign-up:", error);
      Alert.alert("An error occurred. Please try again later.");
      return;
    }
  };

  const createAccount = async (resp) => {
    setModal(true);
    try {
      const response = await fetch(
        "https://tizlyexpress.onrender.com/account",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            username: username,
            mcc: 7333,
            ssn: ssn,
            address: address,
            city: city,
            state: state,
            firstName: firstName,
            lastName: lastName,
            zipCode: zipCode,
            accountNumber: accountNumber,
            routingNumber: routingNumber,
            phoneNumber: phoneNumber,
            month: month,
            day: day,
            year: year,
          }),
        }
      );
      if (!response.ok) {
        console.log("mcc", mcc);
        console.log("response", response);
        setModal(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const json = await response.json();
          await signUpWithEmail(json);
          if (json.error) {
            Alert.alert(json.error);
            setModal(false);
          }
        } else {
          setModal(false);
          const text = await response.text();
          console.warn("Received non-JSON response:", text);
          setError("Unexpected response format.");
        }
      }
    } catch (error) {
      console.log("resp", resp);
      setModal(false);
      console.error("Error creating account:", error);
    }
  };

  const handleSignUp = async () => {
    await createAccount();
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>
          Complete your registration and start exploring!
        </Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Business Name"
            value={username}
            onChangeText={(text) => setUserName(text)}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Phone Number"
            keyboardType="number-pad"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
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
        </View>

        <TouchableOpacity
          onPress={() => handleSignUp()}
          style={styles.signupButton}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>Login Here</Text>
        </TouchableOpacity>

        <Modal animationType="fade" visible={modal}>
          <View style={styles.modalContainer}>
            <LottieView
              autoPlay
              style={styles.lottieAnimation}
              source={require("../assets/lottie/3Dots.json")}
            />
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFF",
    padding: 15,
  },
  backButton: {
    aspectRatio: 1,
    height: 30,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  heading: {
    fontSize: 25,
    color: "#000",
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 15,
    backgroundColor: "#F7F7F7",
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    alignSelf: "center",
  },
  loginText: {
    color: "black",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  lottieAnimation: {
    height: 300,
    width: 300,
  },
});
