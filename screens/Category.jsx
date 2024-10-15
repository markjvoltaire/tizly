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
import { useUser } from "../context/UserContext";

export default function Category({ route, navigation }) {
  const [listOfPros, setListOfPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const {
    item: { name },
  } = route.params;

  const getProfessionals = async () => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("category", name);
    return data;
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const getPros = async () => {
      setLoading(true);
      const professionals = await getProfessionals();

      const filteredPros = professionals.filter((pro) => {
        const distance = getDistance(
          user.latitude,
          user.longitude,
          pro.latitude,
          pro.longitude
        );
        return distance <= 50;
      });

      setListOfPros(filteredPros);
      setLoading(false);
    };

    getPros();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </SafeAreaView>
    );
  }

  if (listOfPros.length === 0) {
    return (
      <SafeAreaView style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>No results found</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("ServiceDetails", { item: item })}
      style={styles.cardContainer}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.cardThumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardStats}> Starting at: ${item.price}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listOfPros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  loadingContainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsContainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    color: "#888",
  },
  cardContainer: {
    flexDirection: "row",
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 12,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardThumbnail: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  cardContent: {
    flex: 1,
    marginLeft: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardStats: {
    fontSize: 16,
    color: "#555",
  },
  flatListContent: {
    paddingBottom: 30,
  },
});
