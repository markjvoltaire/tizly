import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Pressable,
  Dimensions,
  ScrollView,
  Switch,
} from "react-native";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";

const ProfileDetail = ({ route, navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [bookingCount, setBookingCount] = useState(0);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const [listOfServices, setListOfServices] = useState([]);

  const profile = route.params.item;

  async function getProfileService() {
    const resp = await supabase
      .from("services")
      .select("*")
      .eq("user_id", profile.user_id)
      .eq("deactivated", false);

    return resp;
  }

  async function getBookingCount() {
    const res = await supabase
      .from("orders")
      .select("*")
      .eq("orderStatus", "complete")
      .eq("seller_id", profile.user_id);

    setBookingCount(res.body.length);

    return res.body;
  }

  async function getRatings() {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("rating")
        .eq("orderStatus", "complete")
        .eq("seller_id", profile.user_id);

      if (error) {
        console.error("Error fetching ratings:", error.message);
        return null; // or handle the error as needed
      }

      if (!data || data.length === 0) {
        console.log("No ratings found.");
        return null; // or handle the case where no ratings are found
      }

      // Calculate the average rating
      const totalRatings = data.reduce((sum, record) => sum + record.rating, 0);
      const averageRating = totalRatings / data.length;

      setRatingAverage(averageRating);

      return { averageRating };
    } catch (err) {
      console.error("Unexpected error:", err.message);
      return null; // or handle the error as needed
    }
  }

  useEffect(() => {
    const getUserInfo = async () => {
      if (!user) return;

      const resp = await getProfileService(user.user_id);
      const res = await getBookingCount();
      const average = await getRatings();

      console.log("average", average);
      setListOfServices(resp.body);
      setLoading(false);
    };
    getUserInfo();
  }, [user]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: profile.profileimage }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{profile.username}</Text>
            <Text style={styles.profileProfession}>{profile.profession}</Text>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ratingAverage}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{bookingCount}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("InboxDetails", { profileDetails: profile })
          }
          style={styles.messageButton}
        >
          <Text style={styles.messageButtonText}>Send Message</Text>
        </TouchableOpacity>

        <View style={styles.separator} />
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Services</Text>
          {listOfServices.map((item, index) => (
            <Pressable
              onPress={() => navigation.navigate("ServiceDetails", { item })}
              key={index}
              style={{ marginBottom: 20 }}
            >
              <View style={styles.serviceContainer}>
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.scrollItem}
                />
                <Text style={styles.scrollItemText}>{item.title}</Text>
                <Text style={styles.scrollItemPrice}>From ${item.price}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main containers
  container: { flex: 1, backgroundColor: "white" },
  scrollView: { padding: 16 },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  profileInfo: { alignItems: "center" },
  profileStats: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
    width: "100%",
  },
  contentContainer: { marginBottom: 50 },
  separator: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 16 },

  // Profile info
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    backgroundColor: "grey",
  },
  profileName: { fontSize: 24, fontWeight: "bold" },
  profileProfession: { fontSize: 16, color: "#636363" },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 14, color: "#636363" },

  // Sections
  sectionTitle: { fontSize: 20, fontFamily: "gilroy", marginBottom: 8 },

  // Message button
  messageButton: {
    width: 300,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "#46A05F",
    alignSelf: "center",
  },
  messageButtonText: {
    alignSelf: "center",
    color: "white",
    fontFamily: "gilroy",
    fontSize: 16,
  },

  // Services
  serviceContainer: { marginRight: 5, elevation: 5 },
  scrollItem: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    backgroundColor: "grey",
  },
  scrollItemText: { fontSize: 16, marginTop: 8 },
  scrollItemPrice: { fontWeight: "600", fontSize: 13, marginBottom: 6 },
});

export default ProfileDetail;
