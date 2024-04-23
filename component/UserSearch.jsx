import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";

export default function UserSearch({ searchValue, navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    fetchUsers();
  }, [searchValue]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("displayName", `%${searchValue}%`) // Replace "columnName" with the actual column name you want to filter
        .limit(6);

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderLoadingIndicator = () => {
    return (
      <View style={{ top: screenHeight * (scheme === "dark" ? 0.13 : 0.06) }}>
        {/* Use your loading component here */}
      </View>
    );
  };

  const renderFlatList = () => (
    <View style={{ bottom: 10 }}>
      <View>
        {loading ? null : users.length === 0 ? (
          <View style={{ top: 100, alignSelf: "center" }}>
            <Text style={{ fontSize: 20 }}>No users found</Text>
          </View>
        ) : (
          <View style={{ top: 20 }}>
            <FlatList
              data={users}
              keyboardShouldPersistTaps="handled" // Dismiss keyboard and handle taps
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ marginBottom: screenHeight * 0.03 }}
                  onPress={() => {
                    console.log(item);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      left: screenWidth * 0.02,
                    }}
                  >
                    <Animated.Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                        marginRight: 10,
                        top: screenHeight * 0.008,
                        backgroundColor: "grey",
                      }}
                      source={{ uri: item.profileimage }}
                      //   onLoad={handleDefaultImageLoad}
                    />

                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          marginTop: 10,
                          fontFamily: "Poppins-Bold",
                          color: "black",
                        }}
                      >
                        {item.displayName}
                      </Text>
                      <Text style={{ fontSize: 11, color: "#73738B" }}>
                        {item.profession}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              initialNumToRender={6} // Render only 6 items initially
              windowSize={7} // Increase the window size to improve scrolling performance
              maxToRenderPerBatch={6} // Render 6 items per batch
            />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View>
      {loading ? (
        <View style={{ top: 100 }}>
          {/* <ActivityIndicator size="large" /> */}
        </View>
      ) : (
        renderFlatList()
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
