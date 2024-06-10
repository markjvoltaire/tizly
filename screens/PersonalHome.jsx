import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import React from "react";

export default function PersonalHome() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
        <Image source={require("../assets/dj.jpg")} style={styles.adBoard} />
        <Text style={styles.sectionTitle}>New to City</Text>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <View style={styles.scrollItem}>
            <Text style={styles.scrollItemText}>Item 1</Text>
          </View>
          <View style={styles.scrollItem}>
            <Text style={styles.scrollItemText}>Item 2</Text>
          </View>
          <View style={styles.scrollItem}>
            <Text style={styles.scrollItemText}>Item 3</Text>
          </View>
        </ScrollView>

        <Text style={styles.sectionTitle}>New to City</Text>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <View style={styles.profileImage}>
            <Text style={styles.scrollItemText}>Item 1</Text>
          </View>
          <View style={styles.profileImage}>
            <Text style={styles.scrollItemText}>Item 2</Text>
          </View>
          <View style={styles.profileImage}>
            <Text style={styles.scrollItemText}>Item 3</Text>
          </View>
        </ScrollView>

        <Text style={[styles.sectionTitle, styles.secondSectionTitle]}>
          Trending Near You
        </Text>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <View style={styles.scrollItem}>
            <Text style={styles.scrollItemText}>Item 1</Text>
          </View>
          <View style={styles.scrollItem}>
            <Text style={styles.scrollItemText}>Item 2</Text>
          </View>
          <View style={styles.scrollItem}>
            <Text style={styles.scrollItemText}>Item 3</Text>
          </View>
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
    height: 150,
    width: "100%",
    resizeMode: "cover",
    marginBottom: 16,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  secondSectionTitle: {
    marginTop: 4, // Reduce margin top to lower the space between sections
  },
  horizontalScroll: {
    marginBottom: 28, // Reduce bottom margin of the first scroll view
  },
  scrollItem: {
    width: 200,
    height: 180,
    marginBottom: 15,
    backgroundColor: "#ccc", // Changed to a lighter color for better visibility
    marginRight: 10,
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
    fontWeight: "bold",
  },
});
