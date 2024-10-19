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
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("category", name)
      .eq("deactivated", false);

    if (error) {
      console.error("Error fetching professionals:", error);
      return [];
    }
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
  }, [user, name]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
        <Text style={{ marginTop: 10, color: "#555" }}>
          Loading services...
        </Text>
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
      <View style={styles.cardTextContainer}>
        <Text numberOfLines={1} style={styles.cardPrice}>
          ${item.price}
        </Text>
        <Text numberOfLines={1} style={styles.cardTitle}>
          • {item.title}
        </Text>
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
        numColumns={2} // Grid with two columns
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
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
    flex: 1,
    margin: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: "49.5%",
  },
  cardThumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    backgroundColor: "#EEEFF2",
  },
  cardTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    padding: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    marginRight: 5,
  },
  cardPrice: {
    fontSize: 14,
    color: "#555",
    marginRight: 2,
  },
  flatListContent: {
    paddingBottom: 30,
    paddingHorizontal: 1,
    marginTop: 10,
  },
});
