import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import React, { useEffect } from "react";
import { supabase } from "../services/supabase";
import ReactionProfile from "../components/Engagement/ReactionProfile";

export default function Reactions({ route }) {
  const scheme = useColorScheme();

  const list = route.params.listOfReactions; // Assuming listOfReactions is an array of objects

  const renderItem = (item) => {
    return (
      <View>
        <ReactionProfile item={item.item} />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: scheme === "light" ? "white" : "#080A0B",
        flex: 1,
      }}
    >
      <Text
        style={{
          color: scheme === "dark" ? "white" : "black",
          fontFamily: "Poppins-Black",
          fontSize: 22,
          marginBottom: 10,
          left: 15,
        }}
      >
        Reactions
      </Text>
      {list.length === 0 ? (
        <View style={{ alignItems: "center", top: 200 }}>
          <Text
            style={{
              color: scheme === "dark" ? "white" : "black",
              fontFamily: "Poppins-Bold",
            }}
          >
            No one reacted to this post yet
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          data={list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
