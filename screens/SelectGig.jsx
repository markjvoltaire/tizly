import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Button,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";

export default function SelectGig({ navigation }) {
  const { user, setUser } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!user ? false : true);

  const screenName = "SelectGig";

  const professions = [
    { id: 1, profession: "Catering" },
    { id: 2, profession: "Barber" },
    { id: 3, profession: "Photographer" },
    { id: 4, profession: "Fitness" },
    { id: 5, profession: "Make Up Artist" },
    { id: 6, profession: "Home Improvement" },
    { id: 7, profession: "Visual Media" },
    { id: 8, profession: "Hair Stylist" },
    { id: 9, profession: "DJ" },
    { id: 10, profession: "Mechanic" },
    { id: 11, profession: "Bartender" },
    { id: 12, profession: "Videographer" },
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
              fontFamily: "AirbnbCereal-Bold",
              marginBottom: 20,
            }}
          >
            Post
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "AirbnbCereal-Medium",
              marginBottom: 10,
              color: "#717171",
            }}
          >
            Log in to access the post screen
          </Text>
          <Text
            style={{
              fontSize: 20,

              marginBottom: 20,
              color: "#717171",
            }}
          >
            Once you login, you'll find the post screen here
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
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ top: 50 }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 10,
            left: 5,
            top: 1,
          }}
        >
          {professions.map((item) => (
            <View
              key={item.id}
              style={{
                flexBasis: "33.33%",
                marginBottom: 50,
                paddingRight: 10,
              }}
            >
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PostGig", item.profession)
                  }
                  style={{
                    backgroundColor: "white",
                    alignItems: "center",
                    height: 50,
                    justifyContent: "center",
                    borderRadius: 9,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "black",
                    }}
                  >
                    {item.profession}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
