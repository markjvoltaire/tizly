import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Category({ route, navigation }) {
  const [listOfPros, setListOfPros] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Loading state
  const {
    item: { description, id },
  } = route.params;

  async function getProfessionals() {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .eq("niche", description);

    return resp.body;
  }

  useEffect(() => {
    const getPros = async () => {
      setLoading(true); // Start loading
      const res = await getProfessionals();
      setListOfPros(res); // Set the response to the state
      setLoading(false); // End loading
    };
    getPros();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <ActivityIndicator size="large" color="grey" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (listOfPros.length === 0) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "white",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, color: "#888" }}>No results found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={listOfPros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            {/* Thumbnail */}
            <Pressable
              onPress={() =>
                navigation.navigate("ProfileDetail", {
                  item: item,
                })
              }
            >
              <Image
                source={{ uri: item.profileimage }}
                style={styles.cardThumbnail}
              />
            </Pressable>

            {/* Card Content */}
            <View style={styles.cardContent}>
              <Pressable
                onPress={() =>
                  navigation.navigate("ProfileDetail", {
                    item: item,
                  })
                }
              >
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>
                    {item.username || "No Username Provided"}
                  </Text>
                  <Text style={styles.cardModerator}>
                    {item.niche}
                    {/* Replace with your item.price if available */}
                  </Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardStats}>
                    {item.city}, {item.state}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "grey",
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitleContainer: {
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardModerator: {
    fontSize: 14,
    color: "#888",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  cardStats: {
    fontSize: 14,
    color: "#888",
  },
});
