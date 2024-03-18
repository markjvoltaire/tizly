import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function BioSection({ bio }) {
  return (
    <View style={styles.sectionContainer}>
      {/* <Text style={styles.sectionHeader}>Bio</Text> */}
      <Text style={styles.bioText}>{bio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  bioText: {
    fontSize: 14,
    fontWeight: "400",
  },
});
