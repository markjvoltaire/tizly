import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";

export default function Login({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const [loading, setLoading] = useState(true);

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
      const { user, error } = await supabase.auth.signIn({ email, password });

      if (error) {
        Alert.alert(error.message);
      } else {
        const userData = await getUser(user.id);
        if (userData) {
          supabase.auth.setAuth(user.access_token);
          setUser(userData);
          setModalVisible(false);
        } else {
          Alert.alert("User not found.");
        }
      }
    } catch (error) {
      Alert.alert("Error during login:", error.message);
    }
  }

  const handleLoginModal = () => {
    setModalVisible(true);
  };

  const logUserIn = () => {
    loginWithEmail();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tizly</Text>
      <Text style={styles.subheading}>
        Connecting You to the Right Professionals
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginModal}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Login or Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="grey"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="grey"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity style={styles.submitButton} onPress={logUserIn}>
            <Text style={styles.submitButtonText}>Log In</Text>
          </TouchableOpacity>
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <Button
              color="green"
              title="Sign Up"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("SignUp");
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("ResetPassword");
            }}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#46A05F",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    color: "white",
    fontWeight: "900",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    color: "white",
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  loginButtonText: {
    color: "green",
    fontSize: 18,
    fontWeight: "600",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "green",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#F3F3F9",
    fontSize: 16,
    color: "black",
  },
  submitButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpText: {
    marginRight: 5,
    fontSize: 16,
    color: "green",
  },
  forgotPassword: {
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "green",
    fontSize: 16,
  },
});
