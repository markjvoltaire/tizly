import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  useColorScheme,
  Dimensions,
} from "react-native";
import { supabase } from "../../services/supabase";
import { useUser } from "../../context/UserContext";

export default function PaginationComponent({
  textInput,
  height,
  width,
  navigation,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const scheme = useColorScheme();
  const defaultImageAnimated = new Animated.Value(0);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    fetchUsers();
  }, [textInput]);

  const handleDefaultImageLoad = () => {
    Animated.timing(defaultImageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", `%${textInput}%`) // Replace "columnName" with the actual column name you want to filter
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

  const renderNoUsersFound = () => (
    <View style={styles.emptyUsersContainer}>
      <Text style={styles.emptyUsersText}>No users found</Text>
    </View>
  );

  const renderFlatList = () => (
    <View style={{ bottom: 10 }}>
      <View>
        {loading ? (
          scheme === "dark" ? (
            <View style={{ top: screenHeight * 0.13 }}></View>
          ) : (
            <View style={{ top: screenHeight * 0.13 }}>
              {/* <LottieView
                style={{
                  width: 225,
                  height: 225,
                  borderRadius: 100,
                  marginRight: 10,
                  position: "absolute",
                  alignSelf: "center",
                }}
                source={require("../../assets/lottie/grey-loader.json")}
                autoPlay
              /> */}
            </View>
          )
        ) : users.length === 0 ? (
          <View style={styles.emptyUsersContainer}>
            <Text style={styles.emptyUsersText}>No users found</Text>
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
                    user.user_id === item.user_id
                      ? navigation.navigate("UserProfile")
                      : navigation.push("ProfileDetail", {
                          userDetails: item,
                        });
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
                      }}
                      source={{ uri: item.profileimage }}
                      onLoad={handleDefaultImageLoad}
                    />

                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          marginTop: 10,
                          fontFamily: "Poppins-Bold",
                          color: scheme === "dark" ? "white" : "black",
                        }}
                      >
                        {item.displayName}
                      </Text>
                      <Text style={{ fontSize: 11, color: "#73738B" }}>
                        @{item.username}
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
    <View
      style={{
        width: screenWidth,
        height: screenHeight * 0.5,
        top: screenHeight * 0.007,
      }}
    >
      {loading
        ? renderLoadingIndicator()
        : // : users.length === 0
          // ? renderNoUsersFound()
          renderFlatList()}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyUsersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyUsersText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
});
