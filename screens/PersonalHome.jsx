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
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
        <Image source={require("../assets/dj.jpg")} style={styles.adBoard} />
        <Text style={styles.sectionTitle}>New to City</Text>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <View style={styles.scrollItem} />
          <View style={styles.scrollItem} />
          <View style={styles.scrollItem} />
        </ScrollView>
        <Text style={styles.sectionTitle}>Trending Near You</Text>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <View style={styles.scrollItem} />
          <View style={styles.scrollItem} />
          <View style={styles.scrollItem} />
        </ScrollView>
      </View>
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
  horizontalScroll: {
    marginBottom: 16,
  },
  scrollItem: {
    width: 100,
    height: 100,
    backgroundColor: "#000",
    marginRight: 10,
  },
});
