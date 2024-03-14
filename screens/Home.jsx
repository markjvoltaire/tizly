import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList,
  ScrollView,
  Pressable, // Import ScrollView
} from "react-native";
import { useScrollToTop } from "@react-navigation/native"; // Import useScrollToTop
import { supabase } from "../services/supabase";
import { getRandomUser } from "../services/user";

export default function Home({ navigation }) {
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  const [loading, setLoading] = useState(true);
  const [trendingUsers, setTrendingUsers] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(); // Ref for ScrollView

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getRandomUser();
        setTrendingUsers(resp);
        const timeout = setTimeout(() => {
          setLoading(false);
          fadeIn();
        }, 1000);

        return () => {
          clearTimeout(timeout);
          fadeAnim.setValue(0); // Reset the fade animation when component unmounts
        };
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  };

  useScrollToTop(scrollViewRef); // Hook up useScrollToTop to ScrollView

  // Mock data for carousel items

  const classes = [
    {
      id: "1",
      title: "Personal Training",
      name: "Fit Wit Jess",
      type: "fitness",
      price: "$40",
      image: require("../assets/trainer.jpg"),
    },
    {
      id: "2",
      title: "Photo Shoot",
      name: "Voltaire Views",
      type: "fitness",
      price: "$250",

      image: require("../assets/cameraMan.jpg"),
    },
    {
      id: "3",
      title: "Make Session",
      name: "Ashley Beauty",
      type: "Beauty",
      price: "$175",

      image: require("../assets/makeUp.jpg"),
    },
  ];

  const professions = [
    { id: 1, profession: "catering" },
    { id: 2, profession: "barbers" },
    { id: 3, profession: "visual media" },
    { id: 4, profession: "fitness" },
    { id: 5, profession: "beauty" },
    { id: 6, profession: "entertainment" },
  ];

  if (loading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Animated.View
      style={{
        // opacity: fadeAnim,
        flex: 1,
        backgroundColor: "white",
        paddingBottom: 10,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", paddingBottom: 10 }}>
          <Image
            style={{
              height: 30,
              width: 30,
              left: 15,
              resizeMode: "contain",
              marginRight: 20,
            }}
            source={require("../assets/Location.png")}
          />
          <Text style={{ top: 6, fontFamily: "alata" }}>Miami</Text>

          <Pressable
            style={{ marginLeft: "auto", marginRight: 18, top: 4 }}
            onPress={() => console.log("Setting")}
          >
            <Image
              style={{
                height: 28,
                width: 28,
                resizeMode: "contain",
                marginLeft: "auto",
                marginRight: 12,
              }}
              source={require("../assets/Setting.png")}
            />
          </Pressable>
        </View>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Search")}
                style={{ bottom: 17, alignSelf: "center" }}
              >
                <Image
                  style={{ height: 100, width: 360, resizeMode: "contain" }}
                  source={require("../assets/searchIn.png")}
                />
              </TouchableOpacity>
            </View>
            {/* Carousel */}
            <View style={{ paddingBottom: 50 }}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 22,
                  left: 18,
                  bottom: 25,
                }}
              >
                Trending In Miami
              </Text>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={trendingUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <Animated.View style={{ opacity: fadeAnim }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ProfileDetail", { item })
                      }
                    >
                      <Image
                        style={{
                          height: 100,
                          width: 100,
                          resizeMode: "cover",
                          marginHorizontal: 15,
                          borderRadius: 160,
                          backgroundColor: "grey",
                        }} // Add marginHorizontal for spacing
                        source={{ uri: item.profileimage }}
                      />
                      <Text
                        style={{ alignSelf: "center", fontFamily: "alata" }}
                      >
                        {item.username}
                      </Text>
                      <Text
                        style={{
                          alignSelf: "center",
                          fontFamily: "alata",
                          fontSize: 12,
                          color: "grey",
                        }}
                      >
                        {item.type}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              />
            </View>

            <View style={{ paddingBottom: 50 }}>
              <Text
                style={{
                  fontWeight: "600",
                  left: 18,
                  bottom: 25,
                  fontSize: 22,
                }}
              >
                Services
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  paddingHorizontal: 10,
                  left: 5,
                  top: 1,
                }}
              >
                {professions.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      flexBasis: "33.33%",
                      marginBottom: 20,
                      paddingRight: 10,
                    }}
                  >
                    <Animated.View style={{ opacity: fadeAnim }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "white",
                          alignItems: "center",
                          height: 30,
                          justifyContent: "center",
                          borderRadius: 9,
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: "alata",
                            color: "black",
                          }}
                        >
                          {item.profession}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                ))}
              </View>
            </View>

            <View>
              <Text
                style={{
                  fontWeight: "600",
                  left: 18,
                  bottom: 25,
                  fontSize: 22,
                }}
              >
                New Experiences
              </Text>
              <FlatList
                style={{ marginBottom: 50 }}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={classes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View>
                    <Animated.View style={{ opacity: fadeAnim }}>
                      <TouchableOpacity>
                        <Image
                          style={{
                            height: 150,
                            width: 260,
                            resizeMode: "cover",
                            marginHorizontal: 10,
                            borderRadius: 16,
                            backgroundColor: "grey",
                          }} // Add marginHorizontal for spacing
                          source={item.image}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                    <View
                      style={{
                        width: width * 0.65,
                        left: 12,
                      }}
                    >
                      <Text style={{}}>{item.title}</Text>
                      <Text style={{ color: "grey", fontFamily: "alata" }}>
                        {item.name}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
