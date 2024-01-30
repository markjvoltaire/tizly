import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import Banner from "../components/ProfileDetails/Banner";
import { useFocusEffect } from "@react-navigation/native";
import Fader from "../components/ProfileDetails/Fader";
import ProfileInformation from "../components/ProfileDetails/ProfileInformation";
import UnlockedFeed from "../components/ProfileDetails/UnlockedFeed";
import UserProfileButtons from "../components/ProfileDetails/UserProfileButtons";
import { useScrollToTop } from "@react-navigation/native";

export default function UserProfile({ navigation }) {
  const { user } = useUser();
  const [scrollPosition, setScrollPosition] = useState(0);
  const flatListRef = useRef(null);

  const [focused, setFocused] = useState(false);

  useScrollToTop(flatListRef);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollPosition(offsetY);
  };

  useFocusEffect(
    React.useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
      };
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <FlatList
        ref={flatListRef}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <>
            <Banner
              scrollPosition={scrollPosition}
              userDetails={user}
              focused={focused}
            />
            <Fader />
            <ProfileInformation userDetails={user} />
            <View
              style={{ bottom: screenHeight * 0.15, left: screenWidth * 0.02 }}
            >
              <UserProfileButtons navigation={navigation} />
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{ bottom: screenHeight * 0.07 }}>
            <UnlockedFeed userDetails={user} navigation={navigation} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({});
