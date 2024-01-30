import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { getRandomUser } from "../../services/user";
import ExploreCard from "./ExploreCard";
import { useScrollToTop } from "@react-navigation/native";

export default function ExplorePlaceHolder({}) {
  const [userList, setUserList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const ref = useRef(null);
  useScrollToTop(ref);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getRandomUser();
      setUserList(response);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRandomUser();
        setUserList(response);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderExploreCard = ({ item }) => <ExploreCard item={item} />;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="grey" />
      ) : (
        <View style={{ marginBottom: screenHeight * 0.03 }}>
          <FlatList
            ref={ref}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
            renderItem={renderExploreCard}
            data={userList}
            keyExtractor={(item) => item.id.toString()} // Adjust with your item ID
            numColumns={2}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatListContainer: {
    alignItems: "center",
  },
});
