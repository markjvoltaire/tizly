import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "../services/supabase";
import OrderCard from "../component/OrderCard";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";

export default function Offers({ navigation }) {
  const { user, setUser } = useUser();
  const [orderList, setOrderList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  async function getOffers() {
    if (!user) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .or(`taskPoster.eq.${user.user_id},offerSender.eq.${user.user_id}`)
        .order("id", { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error fetching offers:", error);
      return [];
    }
  }

  async function getUser(userid) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userid)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  async function loginWithEmail() {
    try {
      const { user, error } = await supabase.auth.signIn({
        email,
        password,
      });
      if (error) throw error;

      const userData = await getUser(user.id);
      supabase.auth.setAuth(user.access_token);
      setEmail("");
      setPassword("");
      setUser(userData);
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  const logUserIn = () => {
    loginWithEmail();
  };

  const handleLoginModal = () => {
    setModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        if (!user) {
          setLoading(false);
          return;
        }
        const orders = await getOffers();
        setOrderList(orders);
        setLoading(false);
      };

      fetchOrders();
    }, [user])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <View>
          <Text style={styles.loginTitle}>Orders</Text>
          <Text style={styles.loginSubtitle}>Log in to see your orders</Text>
          <Text style={styles.loginDescription}>
            Once you login, you'll find your orders here
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLoginModal}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
        <LoginModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          logUserIn={logUserIn}
          navigation={navigation}
        />
      </SafeAreaView>
    );
  }

  const ServiceItem = ({ service }) => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    let serviceInfo;

    if (service.offerSender !== user.user_id) {
      serviceInfo = service.offerSender;
    } else if (service.taskPoster !== user.user_id) {
      serviceInfo = service.taskPoster;
    }

    useEffect(() => {
      const getUserInfo = async () => {
        const resp = await getUser(serviceInfo);
        setUserInfo(resp);
        setLoading(false);
      };
      getUserInfo();
    }, []);

    if (loading) {
      return (
        <View
          style={[
            styles.serviceItem,
            {
              width: screenWidth * 0.98,
              height: screenHeight * 0.13,
              justifyContent: "center",
            },
          ]}
        >
          <LottieView
            style={{
              height: 50,
              width: 50,
              alignSelf: "center",
            }}
            source={require("../assets/lottie/greyCircle.json")}
            autoPlay
          />
        </View>
      );
    }

    return (
      <Pressable>
        <View
          style={[
            styles.serviceItem,
            { width: screenWidth * 0.98, height: screenHeight * 0.13 },
          ]}
        ></View>
      </Pressable>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.servicesContainer}>
      {orderList.map((service) => (
        <ServiceItem key={service.id} service={service} />
      ))}
    </ScrollView>
  );
}

const LoginModal = ({
  modalVisible,
  setModalVisible,
  email,
  setEmail,
  password,
  setPassword,
  logUserIn,
  navigation,
}) => (
  <Modal
    animationType="slide"
    visible={modalVisible}
    onRequestClose={() => setModalVisible(!modalVisible)}
  >
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Login or Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="grey"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="grey"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.modalButton} onPress={logUserIn}>
        <Text style={styles.modalButtonText}>Log In</Text>
      </TouchableOpacity>
      <View style={styles.modalOptionContainer}>
        <Text style={styles.modalOptionText}>Don't have an account?</Text>
        <Button
          title="Sign Up"
          onPress={() => {
            setModalVisible(false);
            navigation.navigate("ProfileTypeSelect");
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.modalOptionButton}
        onPress={() => {
          setModalVisible(false);
          navigation.navigate("ResetPassword");
        }}
      >
        <Text style={styles.modalOptionButtonText}>Forgot Password?</Text>
      </TouchableOpacity>
      <Button
        title="Not Yet"
        onPress={() => setModalVisible(!modalVisible)}
        color="grey"
      />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loginTitle: {
    fontSize: 30,
    marginBottom: 20,
  },
  loginSubtitle: {
    fontSize: 15,
    marginBottom: 10,
    color: "#717171",
  },
  loginDescription: {
    fontSize: 20,
    marginBottom: 20,
    color: "#717171",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "stretch",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  modalContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    top: 200,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F3F3F9",
  },
  modalButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "stretch",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  modalOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  modalOptionText: {
    marginRight: 5,
  },
  modalOptionButton: {
    marginBottom: 10,
    marginBottom: 20,
  },
  modalOptionButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  serviceItem: {
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 1,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderWidth: 3,
    borderColor: "#f5f5f5",
    padding: 10,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#313131",
  },
  servicePay: {
    fontSize: 16,
    marginBottom: 15,
    color: "#313131",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  serviceText: {
    fontSize: 14,
    color: "#313131",
  },
});
