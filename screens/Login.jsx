import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { supabase } from "../services/supabase";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const loginWithEmail = async () => {
    try {
      setLoading(true);
      const { data: user, error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login Error", error.message);
      }
    } catch (error) {
      Alert.alert("Error during login", error.message);
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  const handleForgotPassword = async () => {
    navigation.navigate("ResetPassword");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ top: 50 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back 👋</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={handlePasswordChange}
            autoCapitalize="none"
            secureTextEntry={true}
          />
          <Pressable
            onPress={handleForgotPassword}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={loginWithEmail}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#f8f9fa",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  forgotPassword: {
    marginTop: 5,
    marginBottom: 20,
    alignSelf: "center",
  },
  forgotPasswordText: {
    color: "#007bff",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default Login;
