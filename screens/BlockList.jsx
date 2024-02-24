import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";
import BlockProfile from "../components/Engagement/BlockProfile";
import { useFocusEffect } from "@react-navigation/native";

export default function BlockList() {
  const scheme = useColorScheme();
  const { user } = useUser();
  const [idList, setIdList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const renderItem = ({ item }) => {
    return (
      <View>
        <BlockProfile item={item} />
      </View>
    );
  };

  async function didUserBlockProfile() {
    const userId = supabase.auth.currentUser.id;
    const resp = await supabase.from("blocks").select("*").eq("userId", userId);
    return resp.body;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const res = await didUserBlockProfile();
        setIdList(res);
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching blocked profiles:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchData();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const res = await didUserBlockProfile();
      setIdList(res);
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching blocked profiles:", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchList();
      return () => {
        null;
      };
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: scheme === "light" ? "white" : "#111111",
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
        Blocked Users
      </Text>

      {loading ? ( // Render loading indicator if loading state is true
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      ) : idList.length === 0 ? (
        <View style={{ alignItems: "center", top: 200 }}>
          <Text
            style={{
              color: scheme === "dark" ? "white" : "black",
              fontFamily: "Poppins-Bold",
            }}
          >
            No one is on your blocked list
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          data={idList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
