import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { supabase } from "../../services/supabase";
import { useUser } from "../../context/UserContext";

import { StackActions } from "@react-navigation/native";
export default function SignUpForm({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useUser();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [termsModal, setTermsModal] = useState(false);

  const signUpWithEmail = async () => {
    // Input validation
    if (password.length < 8) {
      Alert.alert("Password should be 8 or more characters");
      return;
    }

    if (!displayName) {
      Alert.alert("Please enter a display name");
      return;
    }

    if (!email) {
      Alert.alert("Please fill in all field inputs");
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
            displayName: displayName,
          },
        ]);
        console.log("User signed up successfully:", user.id);
        console.log("resp", resp.body[0]);
        setUser(resp.body[0]);
        return resp;
      } else {
        Alert.alert(error.message);
        console.error("Error during sign-up:", error);
      }

      return { user, error };
    } catch (error) {
      console.error("An error occurred during sign-up:", error);
      Alert.alert("An error occurred. Please try again later.");
      return { user: null, error };
    }
  };

  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  return (
    <>
      <View>
        <TextInput
          style={{
            alignSelf: "center",
            position: "absolute",
            width: width * 0.9,
            height: height * 0.05,
            color: "black",
            backgroundColor: "grey",
            borderRadius: 13,
            borderColor: "grey",
            borderWidth: 1,
            paddingLeft: width * 0.03,
            backgroundColor: "white",
            fontWeight: "bold",
          }}
          value={displayName}
          placeholderTextColor="black"
          autoCapitalize="none"
          placeholder="Enter Display Name"
          onChangeText={(text) => setDisplayName(text)}
        />

        <TextInput
          style={{
            alignSelf: "center",
            position: "absolute",
            width: width * 0.9,
            top: height * 0.08,
            height: height * 0.05,
            color: "black",
            backgroundColor: "grey",
            borderRadius: 13,
            borderColor: "grey",
            borderWidth: 1,
            paddingLeft: width * 0.03,
            backgroundColor: "white",
            fontWeight: "bold",
          }}
          value={username}
          autoCorrect={false} // Disable auto-correct
          placeholderTextColor="black"
          autoCapitalize="none"
          placeholder="Enter Username"
          onChangeText={(text) => {
            const modifiedText = text.replace(/ /g, "_"); // Replace spaces with underscores
            setUsername(modifiedText);
          }}
        />

        <TextInput
          style={{
            alignSelf: "center",
            position: "absolute",
            width: width * 0.9,
            top: height * 0.16,
            height: height * 0.05,
            color: "black",
            backgroundColor: "grey",
            borderRadius: 13,
            borderColor: "grey",
            borderWidth: 1,
            paddingLeft: width * 0.03,
            backgroundColor: "white",
            fontWeight: "bold",
          }}
          value={email}
          placeholderTextColor="black"
          autoCapitalize="none"
          placeholder="Enter Email"
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={{
            alignSelf: "center",
            position: "absolute",
            width: width * 0.9,
            top: height * 0.24,
            height: height * 0.05,
            color: "black",
            backgroundColor: "grey",
            borderRadius: 13,
            borderColor: "grey",
            borderWidth: 1,
            paddingLeft: width * 0.03,
            backgroundColor: "white",
            fontWeight: "bold",
          }}
          placeholderTextColor="black"
          autoCapitalize="none"
          placeholder="Enter Password"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          value={password}
        />
      </View>
      <TouchableOpacity
        onPress={() => signUpWithEmail()}
        style={{
          backgroundColor: "black",
          borderWidth: 1,
          borderColor: "black",
          width: width * 0.8,
          height: height * 0.06,
          padding: 12,
          alignSelf: "center",
          borderRadius: 13,
          top: height * 0.35,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins-SemiBold",
            alignSelf: "center",
            fontSize: 18,
            color: "white",
          }}
        >
          Sign Up
        </Text>
      </TouchableOpacity>

      <View style={{ alignSelf: "center", top: height * 0.4 }}>
        <Text style={{ color: "white", fontWeight: "800" }}>
          By signing up, you accept Tizly's
          <TouchableOpacity onPress={() => setTermsModal(true)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                top: 3,
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontWeight: "800",
                  color: "white",
                }}
              >
                {" "}
                terms
              </Text>
            </View>
          </TouchableOpacity>
        </Text>
      </View>
      <Modal animationType="slide" visible={termsModal}>
        <SafeAreaView>
          <Pressable onPress={() => setTermsModal(false)}>
            <Text style={{ left: width * 0.03 }}>Close</Text>
          </Pressable>
          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              top: height * 0.03,
            }}
          >
            End-User License Agreement (EULA) for Tizly
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              width: width * 0.9,
              alignSelf: "center",
              top: height * 0.05,
              marginBottom: height * 0.1,
            }}
          >
            <Text>
              This End-User License Agreement ("EULA") is a legally binding
              agreement between you (the "User" or "You") and Voltaire
              ("Company," "We," or "Us") regarding the use of the Tizly mobile
              application and associated services (collectively referred to as
              the "App").
              <Text style={{ fontWeight: "bold" }}>1. Acceptance of Terms</Text>
              - By downloading, installing, or using the App, you agree to be
              bound by the terms and conditions of this EULA. If you do not
              agree with these terms, do not use the App.
              <Text style={{ fontWeight: "bold" }}>2. License</Text>
              <Text style={{ fontWeight: "bold" }}>2.1. Grant of License:</Text>
              Company grants You a limited, non-exclusive, non-transferable,
              revocable license to use the App solely for personal,
              non-commercial purposes.
              <Text style={{ fontWeight: "bold" }}>2.2. Restrictions:</Text>
              You shall not: a. Reverse engineer, decompile, disassemble, or
              attempt to derive the source code of the App. b. Modify, adapt,
              translate, or create derivative works based on the App. c. Remove,
              alter, or obscure any copyright, trademark, or other proprietary
              notices within the App.
              <Text style={{ fontWeight: "bold" }}>3. User Content</Text>
              <Text style={{ fontWeight: "bold" }}>3.1. Content Sharing:</Text>
              The App may allow You to share content with other users. You are
              solely responsible for any content You share, and You represent
              that You have the necessary rights to share such content.
              <Text style={{ fontWeight: "bold" }}>4. Privacy</Text>
              <Text style={{ fontWeight: "bold" }}>4.1. Data Collection:</Text>
              We may collect and use certain information as described in our
              Privacy Policy, which is incorporated by reference into this EULA.
              <Text style={{ fontWeight: "bold" }}>5. Termination</Text>
              <Text style={{ fontWeight: "bold" }}>5.1. Termination:</Text>
              This EULA is effective until terminated by You or Company. You may
              terminate it by uninstalling the App. Company may terminate it at
              any time without notice.
              <Text style={{ fontWeight: "bold" }}>6. Warranty Disclaimer</Text>
              <Text style={{ fontWeight: "bold" }}>6.1. No Warranty:</Text>
              The App is provided "as is" without any warranties, express or
              implied. We do not guarantee that the App will be error-free or
              uninterrupted.
              <Text style={{ fontWeight: "bold" }}>
                7. Limitation of Liability
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                7.1. Limitation of Liability:
              </Text>
              To the extent permitted by law, Company shall not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages.
              <Text style={{ fontWeight: "bold" }}>8. Governing Law</Text>
              <Text style={{ fontWeight: "bold" }}>8.1. Governing Law:</Text>
              This EULA shall be governed by and construed in accordance with
              the laws of the State of Florida.
              <Text style={{ fontWeight: "bold" }}>9. Contact Information</Text>
              <Text style={{ fontWeight: "bold" }}>9.1. Contact Us:</Text>
              If You have any questions or concerns about this EULA, please
              contact us at markvoltairedev@gmail.com.
              <Text style={{ fontWeight: "bold" }}>10. Entire Agreement</Text>
              <Text style={{ fontWeight: "bold" }}>
                10.1. Entire Agreement:
              </Text>
              This EULA constitutes the entire agreement between You and Company
              regarding the use of the App. Remember to review the entire EULA
              carefully and, if possible, consult with a legal professional in
              Florida to ensure that it complies with local laws and
              regulations.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({});
