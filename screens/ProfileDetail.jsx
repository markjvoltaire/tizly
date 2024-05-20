import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import ServiceCard from "../component/ServiceCard";
import BioCard from "../component/BioCard";
import ReviewCards from "../component/ReviewCards";

export default function ProfileDetail({ route, navigation }) {
  const profile = route.params.item;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust duration as needed
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.profileContainer}>
          {/* Profile Image */}
          <Animated.Image
            source={{ uri: profile.profileimage }}
            style={[
              {
                width: screenWidth,
                height: screenHeight * 0.55,
                resizeMode: "cover",
                backgroundColor: "black",
              },
              { opacity: fadeAnim },
            ]}
          />
          <View
            style={{
              width: screenWidth,
              height: screenHeight * 0.55,
              backgroundColor: "black",
              position: "absolute",
              opacity: 0.65,
            }}
          ></View>
          <Text
            style={{
              position: "absolute",
              color: "white",
              top: screenHeight * 0.5,
              left: screenWidth * 0.04,
              fontFamily: "gilroy",
              fontSize: 25,
            }}
          >
            {profile.displayName}
          </Text>
        </View>

        <ServiceCard
          navigation={navigation}
          profile={profile}
          screenWidth={screenWidth}
        />
        <ServiceCard profile={profile} screenWidth={screenWidth} />
        <ServiceCard profile={profile} screenWidth={screenWidth} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    backgroundColor: "white",
  },
  profileContainer: {
    marginBottom: 7,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginBottom: 2,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 1,
  },
  username: {
    fontSize: 15,
    color: "#666",
  },
  // Other styles remain unchanged
});
