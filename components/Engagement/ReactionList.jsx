import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ProfileCard from "../notifications/ProfileCard";
import ReactionProfile from "./ReactionProfile";

export default function ReactionList({ listOfReactions }) {
  const [loading, setLoading] = useState(false);
  const list = listOfReactions;

  const renderItem = ({ item }) => {
    return (
      <View>
        <ReactionProfile item={item} />
      </View>
    );
  };

  return (
    <View>
      <FlatList renderItem={renderItem} data={listOfReactions} />
    </View>
  );
}

const styles = StyleSheet.create({});
