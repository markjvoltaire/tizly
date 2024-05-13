import React, { useEffect, useState } from "react";
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
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";
import { getUser } from "../services/user";
import InboxCard from "../component/InboxCard";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native"; // Import useScrollToTop

const Inbox = ({ navigation }) => {
  const { user, setUser } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inboxMessages, setInboxMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [state, setState] = useState("start");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOTP] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(!user ? false : true);
  const screenName = "Inbox";

  console.log("isLoggedIn", isLoggedIn);

  async function getUser(userid) {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userid)
      .single()
      .limit(1);

    return resp;
  }

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
    }
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

  const handleRefresh = async () => {
    const resp = await getLatestMessages();
    setInboxMessages(resp);
    console.log("REFRESHING");
  };

  async function getLatestMessages() {
    // Check if user is not logged in
    if (!supabase.auth.currentUser) {
      return [];
    }

    try {
      const userId = supabase.auth.currentUser.id;

      // Fetch all messages for the user
      const { data: allMessages, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .like("threadID", `%${userId}%`)
        .order("created_at", { ascending: false });

      // if (messagesError) {
      //   throw new Error(messagesError.message);
      // }

      // Create a map to store the latest message for each threadID
      const latestMessagesMap = new Map();

      // Iterate over all messages
      for (const message of allMessages) {
        // Check if threadID already exists in the map
        if (!latestMessagesMap.has(message.threadID)) {
          // If not, add the message
          latestMessagesMap.set(message.threadID, message);
        }
      }

      // Extract the latest messages from the map
      const latestMessages = Array.from(latestMessagesMap.values());

      return latestMessages;
    } catch (error) {
      console.error("Error fetching latest messages:", error);
      return [];
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log("FOCUSED");
      let isMounted = true;

      const fetchData = async () => {
        try {
          if (user === null || undefined) {
            return;
          }
          const resp = await getLatestMessages();
          if (isMounted) {
            setInboxMessages(resp);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchData();

      return () => {
        isMounted = false;
        console.log("NOT FOCUSED");
      };
    }, [])
  );
  useEffect(() => {
    const retrieveMessages = async () => {
      if (isLoggedIn === false) {
        return;
      }
      const resp = await getLatestMessages();
      setInboxMessages(resp);

      // setLoading(false);
    };
    retrieveMessages();
  }, []);

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
              marginBottom: 20,
            }}
          >
            Inbox
          </Text>
          <Text
            style={{
              fontSize: 15,
              marginBottom: 10,
              color: "#717171",
            }}
          >
            Log in to see your messages
          </Text>
          <Text
            style={{
              fontSize: 20,

              marginBottom: 20,
              color: "#717171",
            }}
          >
            Once you login, you'll find your messages here
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

  const renderInboxItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <InboxCard navigation={navigation} user={user} item={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {inboxMessages.length === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          style={{ alignContent: "center" }}
        >
          <Text style={{ top: 100, alignSelf: "center" }}>
            You currently have no messages
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          onRefresh={handleRefresh} // Pass refresh function to FlatList
          refreshing={refreshing}
          data={inboxMessages}
          renderItem={renderInboxItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "grey",
  },
  messageContainer: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  sender: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  date: {
    fontSize: 12,
    color: "#6b7c93",
  },
  subject: {
    fontSize: 16,
    color: "#14171a",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});

export default Inbox;
