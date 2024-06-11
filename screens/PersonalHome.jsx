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
} from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";

export default function PersonalHome() {
  const [ntcList, setNtcList] = useState([]);
  const [forYouList, setForYouList] = useState([]);
  const { user } = useUser();

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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
        <View style={styles.adBoard}>
          <Text
            style={{
              alignSelf: "center",
              fontFamily: "Poppins-Black",
              color: "white",
              fontSize: 50,
            }}
          >
            tizly
          </Text>
          <Text
            style={{ alignSelf: "center", color: "white", fontWeight: "500" }}
          >
            marketplace
          </Text>
        </View>
        <Text style={styles.sectionTitle}>New to {user.city}</Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={styles.horizontalScroll}
        >
          {ntcList.map((item, index) => (
            <View style={{ marginRight: 5, elevation: 5 }} key={index}>
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
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Near You</Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={styles.horizontalScroll}
        >
          {forYouList.map((item, index) => (
            <View style={{ marginRight: 40 }} key={index}>
              <Image
                source={{ uri: item.profileimage }}
                style={styles.profileImage}
              />
              <Text style={{ alignSelf: "center", fontWeight: "400" }}>
                {item.displayName}
              </Text>
            </View>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, styles.secondSectionTitle]}>
          Trending Near You
        </Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={styles.horizontalScroll}
        >
          {ntcList.map((item, index) => (
            <View style={{ marginRight: 5, elevation: 5 }} key={index}>
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  textInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  adBoard: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#46A05F",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  secondSectionTitle: {
    marginTop: 4, // Reduce margin top to lower the space between sections
  },
  horizontalScroll: {
    marginBottom: 30, // Reduce bottom margin of the first scroll view
  },
  scrollItem: {
    width: 200,
    height: 130,
    marginBottom: 5,
    backgroundColor: "#ccc", // Changed to a lighter color for better visibility
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10, // Added border radius for better visual appeal
  },

  profileImage: {
    width: 110,
    height: 110,
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
