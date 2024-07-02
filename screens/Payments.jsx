import React, { useState } from "react";
import { View, Text, Button, Linking, TextInput, Alert } from "react-native";
import { useUser } from "../context/UserContext";
import { useStripe } from "@stripe/stripe-react-native";

export default function BillingScreen() {
  const { user } = useUser();
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState(
    user.stripeAccountId
  );
  const [email, setEmail] = useState("");
  const [onBoard, setOnBoard] = useState(user.businessOnBoardComplete);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const createAccount = async () => {
    if (!email || !validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setAccountCreatePending(true);
    setError(false);

    try {
      const response = await fetch("http://localhost:8080/account", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          userId: user.user_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const json = await response.json();

        if (json.account) {
          setConnectedAccountId(json.account);
        }

        if (json.error) {
          setError(true);
        }
      } else {
        const text = await response.text();
        console.warn("Received non-JSON response:", text);
        setError(true);
      }

      setAccountCreatePending(false);
    } catch (error) {
      console.error("Error creating account:", error);
      setError(true);
      setAccountCreatePending(false);
    }
  };

  const addInformation = async () => {
    setAccountLinkCreatePending(true);
    setError(false);

    try {
      const response = await fetch("http://localhost:8080/accountLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: connectedAccountId,
          userId: user.user_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();

      if (json.url) {
        Linking.openURL(json.url);
      }

      if (json.error) {
        setError(true);
      }

      setAccountLinkCreatePending(false);
    } catch (error) {
      console.error("Error creating account link:", error);
      setError(true);
      setAccountLinkCreatePending(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#333" }}>
          Tizly
        </Text>
      </View>
      <View style={{ paddingHorizontal: 20, width: "100%" }}>
        {!connectedAccountId && (
          <>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Enter your email to get started
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
                marginBottom: 20,
                backgroundColor: "#fff",
              }}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Button
              title="Create an account!"
              onPress={createAccount}
              disabled={accountCreatePending || connectedAccountId}
              color="#5cb85c"
            />
          </>
        )}
        {connectedAccountId && (
          <>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Add information to start accepting money
            </Text>
            <Text style={{ marginBottom: 20, color: "#666" }}>
              Matt's Mats partners with Stripe to help you receive payments and
              keep your personal bank and details secure.
            </Text>
            <Button
              title="Add information"
              onPress={addInformation}
              disabled={accountLinkCreatePending}
              color="#5cb85c"
            />
          </>
        )}
        {error && (
          <Text style={{ color: "red", marginTop: 10 }}>
            Something went wrong!
          </Text>
        )}
        {(connectedAccountId ||
          accountCreatePending ||
          accountLinkCreatePending) && (
          <View style={{ marginTop: 20 }}>
            {connectedAccountId && (
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Your connected account ID is:{" "}
                <Text style={{ fontWeight: "bold", color: "#333" }}>
                  {connectedAccountId}
                </Text>
              </Text>
            )}
            {accountCreatePending && (
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Creating a connected account...
              </Text>
            )}
            {accountLinkCreatePending && (
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Creating a new Account Link...
              </Text>
            )}
          </View>
        )}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 14, color: "#666" }}>
            This is a sample app for Stripe-hosted Connect onboarding.{" "}
            <Text
              style={{ color: "#007bff" }}
              onPress={() =>
                Linking.openURL(
                  "https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=hosted"
                )
              }
            >
              View docs
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
