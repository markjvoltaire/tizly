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
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("deactivated", false)
      .neq("user_id", user.user_id);

    if (error) {
      console.error("Error fetching For You data:", error.message);
      Alert.alert("Error", "Failed to fetch For You data");
      return;
    }

    console.log("data", data);

    const shuffledData = data.sort(() => 0.5 - Math.random());
    const limitedData = shuffledData.slice(0, 5);

    setForYouList(limitedData);
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
            Trending Near You
          </Text>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{
              marginBottom: 30,
              alignSelf: "center",
            }}
          >
            {forYouList.map((item, index) => (
              <Pressable
                onPress={() => navigation.navigate("ServiceDetails", { item })}
                key={index}
              >
                <View style={{ elevation: 5, marginBottom: 30 }}>
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={{
                      width: screenWidth * 0.96,
                      height: screenHeight * 0.25,
                      marginBottom: 5,
                      backgroundColor: "#ccc",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      resizeMode: "cover",
                    }}
                  />

                  <Text
                    style={{
                      color: "#2C3624",
                      fontFamily: "interSemiBold",
                      fontSize: 16,
                      marginBottom: 5,
                      width: screenWidth * 0.75,
                      marginRight: 15,
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      fontFamily: "interRegular",
                      fontSize: 13,
                      marginBottom: 5,
                    }}
                  >
                    From ${item.price}
                  </Text>

                  <Text
                    style={{
                      fontFamily: "interRegular",
                      fontSize: 13,
                      color: "#676C5E",
                      marginBottom: 5,
                      marginRight: 19,
                    }}
                  >
                    {item.city}, {item.state}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      style={{ height: 15, width: 15 }}
                      source={require("../assets/greenStar.png")}
                    />
                    <Image
                      style={{ height: 15, width: 15 }}
                      source={require("../assets/greenStar.png")}
                    />
                    <Image
                      style={{ height: 15, width: 15 }}
                      source={require("../assets/greenStar.png")}
                    />
                    <Image
                      style={{ height: 15, width: 15 }}
                      source={require("../assets/greenStar.png")}
                    />
                    <Image
                      style={{ height: 15, width: 15, marginRight: 5 }}
                      source={require("../assets/greenStar.png")}
                    />
                    <Text
                      style={{
                        fontFamily: "interRegular",
                        fontSize: 13,
                        color: "#676C5E",
                      }}
                    >
                      (10)
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </ScrollView>
      ) : (
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
            <View>
              <Text style={[styles.sectionTitle, { marginTop: 9 }]}>
                Search Results
              </Text>
              {searchResults.map((item, index) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate("ServiceDetails", { item })
                  }
                  key={index}
                >
                  <View style={{ elevation: 5, marginBottom: 30 }}>
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={{
                        width: screenWidth * 0.96,
                        height: screenHeight * 0.25,
                        marginBottom: 5,
                        backgroundColor: "#ccc",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 3,
                        resizeMode: "cover",
                      }}
                    />
                    <Text style={styles.scrollItemText}>{item.title}</Text>
                    <Text
                      style={{
                        fontSize: 13,
                        marginBottom: 6,
                      }}
                    >
                      From ${item.price}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
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
    marginLeft: 4,
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
