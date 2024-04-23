import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { supabase } from "../services/supabase";
import UserCard from "../component/UserCard";

export default function Category({ route, navigation }) {
  const [loading, setLoading] = useState(true); // State for loading
  const [profileData, setProfileData] = useState([]); // State for profile data
  const [data, setData] = useState([]);
  const screenWidth = Dimensions.get("window").width;

  async function getUsers(route) {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .eq("type", "business")
      .eq("profession", route.params.item.profession);

    return resp.body;
  }

  useEffect(() => {
    // Simulate fetching data from API
    const fetchData = async () => {
      try {
        const resp = await getUsers(route);
        setProfileData(resp);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginLeft: 10 }}>
        {route.params.item.profession}
      </Text>
      {loading ? (
        <View style={{ alignSelf: "center", top: 100 }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          style={{ top: 10, marginBottom: 10 }}
          data={profileData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{}}>
              <UserCard navigation={navigation} item={item} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
