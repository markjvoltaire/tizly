import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";
import StarRating from "../component/StarRating";
import ServiceCard from "../component/ServiceCard";
import SearchServiceCard from "../component/SearchServiceCard";

export default function PersonalHome({ navigation }) {
  const [ntcList, setNtcList] = useState([]);
  const [forYouList, setForYouList] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ratingModal, setRatingModal] = useState(false);
  const { user } = useUser();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  async function getForYou() {
    try {
      let query = supabase
        .from("services")
        .select("*")
        .eq("deactivated", false)
        .neq("user_id", user.user_id);

      // Check if the user object exists and has both "city" and "state" properties.
      if (user && user.city && user.state) {
        // If the user object is defined, add additional filters for "city" and "state".
        query = query.eq("city", user.city).eq("state", user.state);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned");
      }

      // Shuffle and limit the data to 5 items
      const shuffledData = data.sort(() => 0.5 - Math.random());
      const limitedData = shuffledData.slice(0, 5);

      setForYouList(limitedData);
    } catch (error) {
      console.error("Error fetching For You data:", error.message);
      Alert.alert("Error", "Failed to fetch For You data");
    }
  }

  async function searchServices() {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .ilike("description", `%${query}%`)
        .eq("deactivated", false);

      if (error) {
        throw error;
      }

      setSearchResults(data); // Assuming setSearchResults is correctly defined elsewhere
    } catch (error) {
      console.error("Error searching services:", error.message);
      Alert.alert("Error", "Failed to search services");
    }
  }

  useEffect(() => {
    getForYou();
  }, []);

  useEffect(() => {
    if (query.trim() !== "") {
      searchServices();
    } else {
      setSearchResults([]);
    }
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text
        style={{
          alignSelf: "center",
          fontFamily: "Poppins-Black",
          color: "green",
          fontSize: 25,
          marginBottom: 10,
        }}
      >
        tizly
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="What are you looking for?"
        placeholderTextColor="#888"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      {query.length === 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <Image
            resizeMode="contain"
            style={{
              height: screenHeight * 0.16,
              alignSelf: "center",
              marginBottom: 15,
            }}
            source={require("../assets/homeBanner.png")}
          />

          <View>{/* ADD CATEGORIES HERE */}</View>

          <View
            style={{
              height: 0.8,
              backgroundColor: "#e0e0e0",
              marginBottom: 10,
              width: screenWidth * 0.95,
              alignSelf: "center",
            }}
          />

          <Text style={[styles.sectionTitle, styles.secondSectionTitle]}>
            Services For You
          </Text>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{
              marginBottom: 200,
              alignSelf: "center",
            }}
          >
            {forYouList.map((item, index) => (
              <ServiceCard
                key={index} // Use a unique identifier here, like item.id if available
                navigation={navigation}
                item={item}
                index={index}
              />
            ))}
          </ScrollView>
        </ScrollView>
      ) : (
        <>
          <Text style={[styles.sectionTitle, {}]}>Search Results</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}
          >
            {searchResults.length === 0 ? (
              <View>
                <Text
                  style={[
                    styles.sectionTitle,
                    { marginTop: 20, alignSelf: "center" },
                  ]}
                >
                  No Results Found
                </Text>
              </View>
            ) : (
              <View style={{ alignSelf: "center", marginBottom: 200 }}>
                {searchResults.map((item, index) => (
                  <View key={index.id} index={index.id}>
                    <SearchServiceCard
                      navigation={navigation}
                      item={item}
                      index={index}
                    />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 2,
    backgroundColor: "#fff",
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 0.3,
    borderRadius: 12,
    marginBottom: 20,

    paddingHorizontal: 10,

    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 10,
  },
  secondSectionTitle: {
    marginTop: 4,
  },
  horizontalScroll: {
    marginBottom: 20,
    marginLeft: 1,
  },
  scrollItem: {
    width: 200,
    height: 150,
    marginBottom: 5,
    backgroundColor: "#ccc",
    marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  scrollItemText: {
    color: "#2C3624",
    fontFamily: "interSemiBold",
    fontSize: 16,
    marginBottom: 5,
  },
});
