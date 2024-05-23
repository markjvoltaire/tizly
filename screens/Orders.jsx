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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { supabase } from "../services/supabase";
import OrderCard from "../component/OrderCard";
import { useUser } from "../context/UserContext";

export default function Orders({ navigation }) {
  const { user, setUser } = useUser();
  const [orderList, setOrderList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!user ? false : true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const services = [
    {
      id: 1,
      title: "Wedding Photography",
      category: "Photographers",
      rating: 4.8,
      price: "$200",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 2,
      title: "Car Detailing",
      category: "Auto Detailers",
      rating: 4.5,
      price: "$100",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 3,
      title: "House Cleaning",
      category: "Home Cleaning",
      rating: 4.7,
      price: "$150",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 4,
      title: "Lawn Mowing",
      category: "Lawn Services",
      rating: 4.6,
      price: "$50",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 5,
      title: "Event Photography",
      category: "Photographers",
      rating: 4.9,
      price: "$300",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 6,
      title: "Deep House Cleaning",
      category: "Home Cleaning",
      rating: 4.8,
      price: "$200",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 7,
      title: "Gardening Service",
      category: "Lawn Services",
      rating: 4.5,
      price: "$80",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 8,
      title: "Pet Grooming",
      category: "Pet Services",
      rating: 4.7,
      price: "$60",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
  ];

  async function getOrders() {
    if (!user) {
      return;
    } else {
      const userId = supabase.auth.currentUser.id;
      const resp = await supabase
        .from("orders")
        .select("*")
        .eq("purchaserId", userId);

      return resp.body;
    }
  }

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
      console.log("user", user);
      console.log("resp", resp);
      setEmail("");
      setPassword("");
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

  const ServiceItem = ({ service }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const onImageScroll = (event) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const viewSize = event.nativeEvent.layoutMeasurement.width;
      const currentIndex = Math.floor(contentOffsetX / viewSize);
      setCurrentImageIndex(currentIndex);
    };

    return (
      <View style={styles.serviceItem}>
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={service.images}
          renderItem={({ item }) => (
            <Image source={item} style={styles.serviceImage} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onScroll={onImageScroll}
          scrollEventThrottle={16}
        />
        <View style={styles.paginationDots}>
          {service.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentImageIndex ? "#C52A66" : "#ccc",
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.serviceCategory}>{service.category}</Text>
          <Text style={styles.serviceRating}>Rating: {service.rating}</Text>
          <Text style={styles.servicePrice}>{service.price}</Text>
          <View style={styles.deliveryInfo}>
            <Image
              source={require("../assets/photo3.jpg")}
              style={styles.profileImage}
            />
            <Text style={styles.deliveryPersonName}>John Doe</Text>
          </View>
        </View>
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchOrders = async () => {
        if (!user) {
          setLoading(false);
          return;
        } else {
          const resp = await getOrders();
          setOrderList(resp);
          setLoading(false);
        }
      };

      fetchOrders();
    }, [])
  );

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // IF NO USER IS LOGGED IN
  if (!user) {
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
            Orders
          </Text>
          <Text
            style={{
              fontSize: 15,
              marginBottom: 10,
              color: "#717171",
            }}
          >
            Log in to see your orders
          </Text>
          <Text
            style={{
              fontSize: 20,

              marginBottom: 20,
              color: "#717171",
            }}
          >
            Once you login, you'll find your orders here
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.servicesContainer}>
        {services.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  searchBar: {
    backgroundColor: "white",
    padding: 10,
    margin: 20,
    borderRadius: 5,
    elevation: 2, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 0.2,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    bottom: 10,
    marginBottom: 25,
  },
  categoryItem: {
    backgroundColor: "#C52A66",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 1, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 60, // Adjust the height as needed
  },
  categoryText: {
    fontSize: 16,
    color: "white",
    fontFamily: "gilroy",
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  serviceItem: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 1, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderWidth: 3,
    borderColor: "#f5f5f5",
  },
  serviceImage: {
    width: Dimensions.get("window").width * 0.89,
    height: 200,
    resizeMode: "cover",
    backgroundColor: "grey",
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  serviceInfo: {
    padding: 10,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceCategory: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  serviceRating: {
    fontSize: 14,
    color: "#666",
  },
  servicePrice: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  deliveryPersonName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
