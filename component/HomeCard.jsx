import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";
import LottieView from "lottie-react-native";
import UserCars from "./UserCars";

const HomeCard = ({ navigation, city, state }) => {
  const height = Dimensions.get("window").height;
  const slideUpAnim = useRef(new Animated.Value(height)).current;
  const { setUser } = useUser();
  const [addCarModal, setAddCarModal] = useState(false);
  const [licensePlate, setLicensePlate] = useState("");
  const [description, setDescription] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const [addingCarModal, setAddingCarModal] = useState(false);
  const [searching, setSearching] = useState(false);

  const uploadNewCar = async () => {
    setUploadComplete(false);
    const userId = supabase.auth.currentUser.id;
    try {
      setAddingCarModal(true);
      const newCar = { user_id: userId, licensePlate, description };
      const resp = await supabase.from("cars").insert([newCar]);

      await new Promise((resolve) =>
        setTimeout(() => {
          setUploadComplete(true);
          resolve();
        }, 2000)
      );

      await new Promise((resolve) =>
        setTimeout(() => {
          setAddCarModal(false);
          setAddingCarModal(false);
          setLicensePlate("");
          setDescription("");
          resolve();
        }, 2000)
      );

      return resp;
    } catch (error) {
      console.error("Error submitting comment:", error);
      throw error;
    }
  };

  const noInput = () => {
    Alert.alert("Inputs were empty");
  };

  const signOutUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    Animated.timing(slideUpAnim, {
      toValue: height * 0.65,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideUpAnim }] }]}
    >
      <Text style={styles.title}>Good morning, Mark</Text>

      <UserCars city={city} state={state} navigation={navigation} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "white",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.57,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 1,
    elevation: 5,
    top: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1.25,
    shadowRadius: 9.84,
  },
  title: {
    fontSize: 20,
    left: Dimensions.get("window").width * 0.07,
    top: 22,
    fontFamily: "Helvetica Neue",
  },
  addButton: {
    alignSelf: "center",
    top: 35,
  },
  addCarImage: {
    resizeMode: "contain",
    height: Dimensions.get("window").height * 0.084,
    marginBottom: 30,
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
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
    height: 50,
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
  },
  descriptionInput: {
    height: 140,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
    fontFamily: "alata",
    borderWidth: 1,
    borderColor: "#BBBBBB",
    backgroundColor: "#F3F3F9",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "stretch",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",

    textAlign: "center",
  },
  lottieView: {
    width: 530,
    alignSelf: "center",
  },
});

export default HomeCard;
