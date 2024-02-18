import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import React, { useEffect } from "react";
import { supabase } from "../services/supabase";

export default function Reactions({ route }) {
  const scheme = useColorScheme();

  const list = route.params.listOfReactions; // Assuming listOfReactions is an array of objects

  const userIDS = list.map((reaction) => reaction.userId);

  async function getUsers() {
    const userId = supabase.auth.currentUser.id;
    const resp = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", [userIDS]);

    return resp.body;
  }

  useEffect(() => {
    const getProfiles = async () => {
      const res = getUsers();
      console.log("res", res);
    };
    getProfiles();
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: scheme === "light" ? "white" : "#080A0B",
        flex: 1,
      }}
    >
      <Text
        style={{
          color: scheme === "dark" ? "white" : "black",
          fontFamily: "Poppins-Black",
          fontSize: 22,
          marginBottom: 10,
          left: 15,
        }}
      >
        Reactions
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
