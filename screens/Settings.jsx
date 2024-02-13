import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  Alert,
  Linking,
  Pressable,
} from "react-native";
import react, { useRef, useEffect } from "react";
import { supabase } from "../services/supabase";

import { useUser } from "../context/UserContext";

import { Appearance, useColorScheme } from "react-native";

export default function Settings({ navigation }) {
  const { user, setUser } = useUser();

  async function signOutUser() {
    await supabase.auth.signOut();
  }

  const deleteAlert = () =>
    Alert.alert(" Delete This Account?", "This can not be undone", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => deleteUser(),
      },
    ]);

  async function deleteUserPosts() {
    const { data, error } = await supabase
      .from("post")
      .delete()
      .eq("user_id", user.user_id);

    console.log("error", error);

    return data;
  }

  async function deletePreviews() {
    const { data, error } = await supabase
      .from("previews")
      .delete()
      .eq("user_id", user.user_id);

    console.log("error", error);
    return data;
  }

  async function deleteProfileInfo() {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", user.user_id);

    console.log("error", error);
    return data;
  }

  async function deleteProfileRequests() {
    const { data, error } = await supabase
      .from("friendRequests")
      .delete()
      .or(`senderId.eq.${user.user_id},receiverId.eq.${user.user_id}`)
      .single();

    console.log("error", error);
    return data;
  }

  async function deleteProfileSchema() {
    const { data, error: deleteError } = await supabase.auth.api.deleteUser(
      user.user_id
    );

    if (deleteError) {
      console.log("ERROR DELETE", deleteError);
      throw deleteError;
    }

    console.log("DELETE SUCCESSFUL", data);
  }

  async function deleteUser() {
    // 1. delete posts
    await deleteUserPosts();
    // // 2. delete previews
    await deletePreviews();
    // // 3. delete profile info
    await deleteProfileInfo();
    // // 4. delete auth schema
    await deleteProfileSchema();

    await deleteProfileRequests();

    Alert.alert("Your account has been deleted.");
    signOutUser();
  }

  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  const scheme = useColorScheme();

  const FullSeperator = () => (
    <View
      style={{
        borderBottomColor: "grey",
        borderBottomWidth: StyleSheet.hairlineWidth,
        opacity: 0.5,
        width: width * 0.85,
        top: height * 0.15,
      }}
    />
  );

  const opacity = useRef(new Animated.Value(0.3));
  const defaultImageAnimated = new Animated.Value(0);

  const scrollY = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: true,
          duration: 800,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <ScrollView
      scrollEnabled={false}
      style={{
        flex: 1,
        backgroundColor: scheme === "light" ? "white" : "#080A0B",
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          style={{ height: 25, width: 25, top: height * 0.08, left: 23 }}
          source={
            scheme === "light"
              ? require("../assets/Back.png")
              : require("../assets/WhiteBack.png")
          }
        />
      </TouchableOpacity>

      <Text
        style={{
          alignSelf: "center",
          top: height * 0.06,
          fontWeight: "800",
          color: scheme === "dark" ? "white" : "black",
        }}
      >
        Settings
      </Text>

      <View style={{ bottom: height * 0.05 }}>
        <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 18,
              top: height * 0.182,
              position: "absolute",
              left: 100,
              color: scheme === "dark" ? "white" : "black",
            }}
          >
            {user.displayName}
          </Text>
          <Text
            style={{
              fontWeight: "700",

              top: height * 0.21,
              position: "absolute",
              left: 100,
              color: scheme === "dark" ? "#E5E6FF" : "grey",
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            @{user.username}
          </Text>
          <Animated.View
            style={{
              height: 60,
              width: 60,
              borderRadius: 100,
              top: height * 0.17,
              left: 10,
              position: "absolute",
              opacity: opacity.current,
              backgroundColor: "#CFCFCF",
            }}
          ></Animated.View>
          <Image
            style={{
              height: 60,
              width: 60,
              borderRadius: 100,
              top: height * 0.17,
              left: 10,
            }}
            source={{ uri: user.profileimage }}
          />
        </TouchableOpacity>
      </View>

      <FullSeperator />

      <View
        style={{
          position: "absolute",
          top: height * 0.3,
          left: width * 0.05,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            // Replace "yourLinkHere" with the actual link to the Tizly app
            const linkToTizly =
              "https://apps.apple.com/us/app/tizly/id1667706744";

            // Custom message inviting a friend to the Tizly app and requesting to be the first friend
            const customMessage = `Im on Tizly! My username is @${user.username}`;

            // Use the Linking module to open iMessage with the message and link
            Linking.openURL(`sms:&body=${customMessage} ${linkToTizly}`);
          }}
        >
          <Text
            style={{
              color: scheme === "dark" ? "white" : "black",
              fontWeight: "800",
            }}
          >
            Invite A Friend
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: "absolute",
          top: height * 0.4,
          left: width * 0.05,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("FriendRequests")}>
          <Text
            style={{
              color: scheme === "dark" ? "white" : "black",
              fontWeight: "800",
            }}
          >
            Friend Requests
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: "absolute",
          top: height * 0.5,
          left: width * 0.05,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("FriendList")}>
          <Text
            style={{
              color: scheme === "dark" ? "white" : "black",
              fontWeight: "800",
            }}
          >
            Friends List
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: "absolute",
          top: height * 0.6,
          left: width * 0.05,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("BlockList")}>
          <Text
            style={{
              color: scheme === "dark" ? "white" : "black",
              fontWeight: "800",
            }}
          >
            Block List
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: "absolute",
          top: height * 0.7,
          left: width * 0.05,
        }}
      >
        <TouchableOpacity onPress={() => deleteAlert()}>
          <Text
            style={{
              color: scheme === "dark" ? "white" : "black",
              fontWeight: "800",
            }}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: "absolute",
          alignSelf: "center",
          top: height * 0.53,
        }}
      >
        {/* <TouchableOpacity onPress={() => signOutUser()}>
          <Image
            style={{
              position: "absolute",
              height: 54,
              width: 315,
              right: -160,
              top: height * 0.28,
            }}
            source={require("../assets/signOut.png")}
          />
        </TouchableOpacity> */}

        <Pressable
          style={{
            backgroundColor: scheme === "light" ? "black" : "white",
            width: width * 0.8,
            height: height * 0.05,
            justifyContent: "center",
            borderRadius: 10,
            top: height * 0.28,

            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color: scheme === "light" ? "white" : "black",
              fontFamily: "Poppins-Bold",
              alignSelf: "center",
              fontSize: 16,
            }}
          >
            Sign Out
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileimage: {
    height: 30,
    width: 30,
    borderRadius: 100,
    left: 296,
    top: 12,
  },

  logo: {
    position: "absolute",
    resizeMode: "contain",
    width: 52,
    height: 26,
    backgroundColor: "white",
    alignSelf: "center",
    top: 60,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    resizeMode: "contain",
    width: 25,
    height: 30,
  },

  signoutButton: {
    position: "absolute",
    height: 54,
    width: 315,
    right: -160,
    top: 250,
  },
  usernameInput: {
    position: "absolute",
    left: 55,
    top: 370,
    borderColor: "grey",
    borderWidth: 0.5,
    height: 50,
    width: 311,
    borderRadius: 10,
    paddingLeft: 30,
  },
  button: {
    position: "absolute",
    resizeMode: "contain",
    width: 300,
    left: -150,
  },
  accountSettingsText: {
    left: 39,
    bottom: 20,
    fontWeight: "400",
  },
  arrow: {
    position: "absolute",
    height: 13,
    width: 13,
    left: 350,
    top: 7,
  },
  accountSettings: {
    position: "absolute",
    right: 280,
    bottom: 500,
  },
  img: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  username: {
    fontSize: 23,
    right: 15,
    bottom: 145,
    position: "absolute",
  },
});
