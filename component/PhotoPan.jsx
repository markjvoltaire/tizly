import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { getPosts, getUnlockedUserPost } from "../services/user";

const screenWidth = Dimensions.get("window").width;

const PhotoPan = ({ user, navigation }) => {
  const profile = user;
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getInfo = async () => {
      console.log("profile", profile);
      const resp = await getPosts(profile.user_id);
      console.log("resp", resp);
      setImages(resp); // assuming getPosts returns an array of images
      setLoading(false);
    };
    getInfo();
  }, []);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentPage(currentIndex);
  };

  if (loading) {
    return (
      <View
        style={{
          height: 410,
          width: 410,
          resizeMode: "cover",
          backgroundColor: "grey",
        }}
      ></View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.length === 0 ? (
          <View
            style={{
              height: 400,
              width: 400,
              backgroundColor: "grey",
            }}
          >
            <Text style={{ top: 100, alignSelf: "center" }}>No Images</Text>
          </View>
        ) : (
          images.map((image, index) => (
            <Pressable
              onPress={() =>
                navigation.navigate("ProfileDetail", { item: profile })
              }
              key={index}
            >
              <View style={styles.slide} key={index}>
                <Image style={styles.image} source={{ uri: image.media }} />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorText}>
          {currentPage + 1}/{images.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: screenWidth * 0.89,
    height: "100%",
  },
  image: {
    height: 410,
    width: 410,
    resizeMode: "cover",
    backgroundColor: "grey",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  indicatorText: {
    color: "white",
  },
});

export default PhotoPan;
