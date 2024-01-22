import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  Image,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import LottieView from "lottie-react-native";
import ResetPassword from "../../screens/ResetPassword";

export default function LoginForm({ navigation }) {
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [otp, setOTP] = useState();
  const [state, setState] = useState();
  const [modal, setModal] = useState(false);

  async function sendEmail() {
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(
      forgotEmail
    );

    if (error) {
      Alert.alert(error.message);
    } else {
      setState("awaitOTP");
      Alert.alert(`A 6 Digit Code Has Been Sent To ${forgotEmail}`);
    }
  }

  async function setUser(data) {
    setModal(true);
    supabase.auth.setAuth(data.access_token);
  }

  async function verifyOTP() {
    const { data, error } = await supabase.auth.api.verifyOTP({
      email: forgotEmail,
      token: otp,
      type: "recovery",
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      setUser(data);
      setState("changePassword");
      Alert.alert("OTP Verified! You Can Now Change Your Password");
      console.log("state", state);
    }
  }

  async function changePassword() {
    const { error, data } = await supabase.auth.update({
      password: forgotPassword,
    });

    if (error) {
      Alert.alert(error.message);
    }
    {
      setModal(false);
      Alert.alert("Your Password Has Been Changed");
    }

    console.log("error", error);
    console.log("data", data);
  }

  useEffect(() => {
    setState("start");
  }, []);

  //////////

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalLoader, setModalLoader] = useState(false);

  async function loginWithEmail() {
    // setModalLoader(true);
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
      setModalLoader(false);
    } else {
      setModalLoader(false);
    }
  }

  return (
    <View style={{ bottom: height * 0.19 }}>
      <View style={{ alignSelf: "center" }}>
        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            top: height * 0.06,

            fontSize: 18,
          }}
        >
          Email
        </Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="Enter Your Email"
          placeholderTextColor="black"
          onChangeText={(text) => setEmail(text)}
          value={email}
          style={{
            top: height * 0.07,
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
        />
      </View>

      <View
        style={{
          alignSelf: "center",

          top: height * 0.05,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            top: height * 0.06,

            fontSize: 18,
          }}
        >
          Password
        </Text>
        <TextInput
          style={{
            top: height * 0.07,
            width: width * 0.9,
            height: height * 0.05,
            color: "black",
            borderRadius: 13,
            borderColor: "grey",
            borderWidth: 1,
            paddingLeft: width * 0.03,
            backgroundColor: "white",
            fontWeight: "bold",
          }}
          placeholder="Enter Your Password"
          placeholderTextColor="black"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <View>
        <TouchableOpacity onPress={() => setModal(true)}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              color: "white",
              top: height * 0.155,

              alignSelf: "center",
            }}
          >
            Forgot Password ?
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ top: height * 0.25, alignSelf: "center" }}>
        <TouchableOpacity
          onPress={() => loginWithEmail()}
          style={{
            backgroundColor: "black",
            borderWidth: 1,
            borderColor: "black",
            width: width * 0.8,
            height: height * 0.06,
            padding: 12,
            alignSelf: "center",
            borderRadius: 13,
            bottom: height * 0.03,
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
            Login
          </Text>
        </TouchableOpacity>
      </View>
      {/* <Modal animationType="slide" visible={modalLoader}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#6C00F5" }}>
          <LottieView
            style={{
              height: 130,
              width: 130,
              position: "absolute",
              top: height * 0.08,
              alignSelf: "center",
            }}
            source={require("../../assets/lottie/white-bouncing-dots-loader.json")}
            autoPlay
          />
        </SafeAreaView>
      </Modal> */}

      {/* FORGOT PASSWORD MODAL ===============================================*/}
      <Modal animationType="slide" visible={modal}>
        <SafeAreaView style={{ backgroundColor: "#00A3FF", flex: 1 }}>
          <View>
            <TouchableOpacity
              style={{ width: width * 0.0 }}
              onPress={() => setModal(false)}
            >
              <Image
                style={{
                  left: width * 0.05,
                  aspectRatio: 1,
                  width: width * 0.06,
                  height: height * 0.028,
                }}
                source={require("../../assets/WhiteBack.png")}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: "white",
                position: "absolute",
                alignSelf: "center",
                fontSize: 20,
                fontFamily: "Poppins-SemiBold",
              }}
            >
              Reset Password
            </Text>
          </View>

          <View>
            {state === "start" ? (
              <View>
                <Text
                  style={{
                    fontFamily: "Poppins-SemiBold",
                    color: "white",
                    position: "absolute",
                    alignSelf: "center",
                    top: height * 0.07,
                  }}
                >
                  Enter Your Email
                </Text>
                <TextInput
                  style={{
                    alignSelf: "center",
                    position: "absolute",
                    top: height * 0.1,
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
                  placeholderTextColor="black"
                  autoCapitalize="none"
                  placeholder="Enter Email"
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                />

                <TouchableOpacity
                  onPress={() => sendEmail()}
                  style={{
                    backgroundColor: "black",
                    borderWidth: 1,
                    borderColor: "black",
                    width: width * 0.8,
                    height: height * 0.06,
                    padding: 12,
                    alignSelf: "center",
                    borderRadius: 13,
                    top: height * 0.2,
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
                    Send Code To Email
                  </Text>
                </TouchableOpacity>
              </View>
            ) : state === "awaitOTP" ? (
              <>
                <Text
                  style={{
                    color: "white",
                    position: "absolute",
                    fontWeight: "900",
                    alignSelf: "center",
                    top: height * 0.07,
                  }}
                >
                  Enter The 6 Digit OTP Code
                </Text>
                <TextInput
                  style={{
                    alignSelf: "center",
                    position: "absolute",
                    top: height * 0.1,
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
                  keyboardType="number-pad"
                  placeholderTextColor="black"
                  placeholder="6 Digit OTP Code"
                  value={otp}
                  onChangeText={setOTP}
                />

                <TouchableOpacity
                  onPress={() => verifyOTP()}
                  style={{
                    backgroundColor: "black",
                    borderWidth: 1,
                    borderColor: "black",
                    width: width * 0.8,
                    height: height * 0.06,
                    padding: 12,
                    alignSelf: "center",
                    borderRadius: 13,
                    top: height * 0.2,
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
                    Verify OTP Code
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View>
                <Text
                  style={{
                    color: "white",
                    position: "absolute",
                    fontWeight: "900",
                    alignSelf: "center",
                    top: height * 0.07,
                  }}
                >
                  Enter Your New Password
                </Text>
                <TextInput
                  style={{
                    alignSelf: "center",
                    position: "absolute",
                    top: height * 0.1,
                    width: width * 0.9,
                    height: height * 0.05,
                    color: "white",
                    backgroundColor: "white",
                    borderRadius: 13,
                    borderColor: "grey",
                    borderWidth: 1,
                    paddingLeft: width * 0.03,
                    backgroundColor: "white",
                    fontWeight: "bold",
                  }}
                  autoCapitalize="none"
                  placeholder="Enter New Password"
                  value={forgotPassword}
                  onChangeText={setForgotPassword}
                />

                <TouchableOpacity
                  onPress={() => changePassword()}
                  style={{
                    backgroundColor: "black",
                    borderWidth: 1,
                    borderColor: "black",
                    width: width * 0.8,
                    height: height * 0.06,
                    padding: 12,
                    alignSelf: "center",
                    borderRadius: 13,
                    top: height * 0.2,
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
                    Reset Password
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({});
