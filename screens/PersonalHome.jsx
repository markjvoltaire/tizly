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
} from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";

export default function PersonalHome({ navigation }) {
  const [ntcList, setNtcList] = useState([]);
  const [forYouList, setForYouList] = useState([]);
  const { user } = useUser();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  async function getNewToCity() {
    const resp = await supabase
      .from("services")
      .select("*")
      .order("id", { ascending: false })
      .limit(3);

    setNtcList(resp.body);
    return resp;
  }

  async function getForYou() {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .eq("type", "business")
      .limit(3);

    setForYouList(resp.body);
    return resp;
  }

  const BusinessInfo = (item) => {
    const [loading, setLoading] = useState(true);
    const [businessProfile, setBusinessProfile] = useState({});
    const businessId = item.item.user_id;

    const getUser = async (businessId) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", businessId)
          .single();

        setBusinessProfile(data);
        setLoading(false);
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching user data: ", error);
        Alert.alert("Error", "Failed to fetch user data");
      }
    };

    useEffect(() => {
      getUser(businessId);
    }, []);

    if (loading) {
      return (
        <View>
          <ActivityIndicator size="small" />
        </View>
      );
    }

    return (
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{
            width: 24,
            height: 24,
            marginRight: 10,
            borderRadius: 20,
            backgroundColor: "grey",
            borderWidth: 1,
            borderColor: "green",
            marginBottom: 4,
          }}
          source={{ uri: businessProfile.profileimage }}
        />
        <Text style={{ top: 4 }}>{businessProfile.username}</Text>
      </View>
    );
  };

  useEffect(() => {
    getNewToCity();
    getForYou();
  }, []);

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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        />

        <Text style={styles.sectionTitle}>{user.city}</Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={styles.horizontalScroll}
        >
          {ntcList.map((item, index) => (
            <Pressable
              onPress={() => navigation.navigate("ServiceDetails", { item })}
              key={index}
            >
              <View style={{ marginRight: 5, elevation: 5 }}>
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.scrollItem}
                />
                <Text style={styles.scrollItemText}>{item.title}</Text>
                <Text
                  style={{ fontWeight: "600", fontSize: 13, marginBottom: 6 }}
                >
                  From ${item.price}
                </Text>
                <BusinessInfo item={item} />
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View
          style={{
            height: 0.8,
            backgroundColor: "#e0e0e0",
            marginBottom: 20,
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
            marginBottom: 30, // Reduce bottom margin of the first scroll view
            alignSelf: "center",
          }}
        >
          {ntcList.map((item, index) => (
            <View style={{ elevation: 5, marginBottom: 30 }} key={index}>
              <Image
                source={{ uri: item.thumbnail }}
                style={{
                  width: screenWidth * 0.96,
                  height: screenHeight * 0.25,
                  marginBottom: 5,
                  backgroundColor: "#ccc", // Changed to a lighter color for better visibility

                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3, // Added border radius for better visual appeal
                  resizeMode: "cover",
                }}
              />
              <Text style={styles.scrollItemText}>{item.title}</Text>
              <Text
                style={{ fontWeight: "600", fontSize: 13, marginBottom: 6 }}
              >
                From ${item.price}
              </Text>
              <BusinessInfo item={item} />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10, // Added padding for better spacing
  },
  separator: { height: 1, backgroundColor: "#e0e0e0", marginBottom: 1 },

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
    backgroundColor: "#F3F3F9",
    alignSelf: "center",
  },
  adBoard: {
    height: 170,
    width: "100%",
    resizeMode: "cover",
    marginBottom: 16,
    borderRadius: 5,

    backgroundColor: "#46A05F",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 4,
  },
  secondSectionTitle: {
    marginTop: 4, // Reduce margin top to lower the space between sections
  },
  horizontalScroll: {
    marginBottom: 20,
    marginLeft: 1, // Reduce bottom margin of the first scroll view
  },
  scrollItem: {
    width: 200,
    height: 130,
    marginBottom: 5,
    backgroundColor: "#ccc", // Changed to a lighter color for better visibility
    marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5, // Added border radius for better visual appeal
  },

  profileImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
    backgroundColor: "#ccc", // Changed to a lighter color for better visibility
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100, // Added border radius for better visual appeal
  },
  scrollItemText: {
    color: "#000", // Added text color for scroll items
  },
});
