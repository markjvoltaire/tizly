import React, { useState } from "react";
import {
StyleSheet,
Text,
View,
Image,
FlatList,
SafeAreaView,
TouchableOpacity,
Pressable,
TextInput,
Modal,
Button,
} from "react-native";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabase";

// Sample data for gigs
const gigsData = [
{
id: "1",
profilePicture: require("../assets/photo.jpg"),
username: "user1",
description: "I need a personal trainer to help me with my fitness goals.",
date: "2024-03-14",
taskDescription:
"I'm looking for someone to create a personalized workout plan and provide guidance on nutrition.",
category: "Fitness",
},
{
id: "2",
profilePicture: require("../assets/photo6.jpg"),
username: "user2",
description: "I need a photographer for my upcoming event.",
date: "2024-03-15",
taskDescription:
"I need someone to capture photos and videos of the event, including candid shots and group photos.",
category: "Photography",
},
// Add more gigs as needed
];

// Component for rendering each gig card

const GigCard = ({ item }) => {
return (
<View style={styles.card}>
<Image source={item.profilePicture} style={styles.profilePicture} />
<View style={styles.cardContent}>
<Text style={styles.username}>{item.username}</Text>
<Text style={styles.category}>{item.category}</Text>
<Text style={styles.description}>{item.description}</Text>
<Text style={styles.taskDescription}>{item.taskDescription}</Text>
<Text style={styles.date}>{item.date}</Text>
</View>
</View>
);
};
export default function Bookings({ navigation }) {
const { user, setUser } = useUser(null);
const [modalVisible, setModalVisible] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

async function getUser(userid) {
const resp = await supabase
.from("profiles")
.select("\*")
.eq("user_id", userid)
.single()
.limit(1);

    return resp;

}

async function loginWithEmail() {
// setModalLoader(true);
const { user, error } = await supabase.auth.signIn({
email,
password,
});
if (error) {
Alert.alert(error.message);
} else {
const resp = await getUser(user.id);
supabase.auth.setAuth(user.access_token);
console.log("resp", resp);
setUser(resp.body);
}
}

const handleLoginModal = () => {
setModalVisible(true);
// Add your login logic here
};

const logUserIn = () => {
loginWithEmail();
// Add your login logic here
};

if (!user) {
return (
<SafeAreaView
style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }} >
<View style={{}}>
<Text
style={{
              fontSize: 30,
              fontFamily: "AirbnbCereal-Bold",
              marginBottom: 20,
            }} >
Bookings
</Text>
<Text
style={{
              fontSize: 15,
              fontFamily: "AirbnbCereal-Medium",
              marginBottom: 10,
              color: "#717171",
            }} >
Log in to see your bookings
</Text>
<Text
style={{
fontSize: 20,

              marginBottom: 20,
              color: "#717171",
            }}
          >
            Once you login, you'll find your bookings here
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 5,
              alignSelf: "stretch",
            }}
            onPress={handleLoginModal}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "600",
                fontFamily: "AirbnbCereal-Bold",
                textAlign: "center",
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "white",
              borderRadius: 10,
              top: 200,
              padding: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                marginBottom: 15,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Login or Sign Up
            </Text>
            <TextInput
              style={{
                height: 40,
                width: "100%",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 12,
                marginBottom: 10,
                paddingHorizontal: 10,
                fontFamily: "alata",
                borderWidth: 1,
                borderColor: "#BBBBBB",
                backgroundColor: "#F3F3F9",
              }}
              placeholderTextColor="grey"
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={{
                height: 40,
                width: "100%",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 10,
                paddingHorizontal: 10,
                fontFamily: "alata",
                borderWidth: 1,
                borderColor: "#BBBBBB",
                backgroundColor: "#F3F3F9",
              }}
              placeholderTextColor="grey"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#007AFF",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 5,
                alignSelf: "stretch",
              }}
              onPress={logUserIn}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: "600",
                  fontFamily: "AirbnbCereal-Bold",
                  textAlign: "center",
                }}
              >
                Log In
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ marginRight: 5 }}>Don't have an account?</Text>
              <Button
                title="Sign Up"
                onPress={() => {
                  // Add your sign up functionality here
                }}
              />
            </View>
            <Button
              title="Not Yet"
              onPress={() => setModalVisible(!modalVisible)}
              color="grey"
            />
          </View>
        </Modal>
      </SafeAreaView>
    );

}
return (
<SafeAreaView style={styles.container}>
<Text>HELLO</Text>
</SafeAreaView>
);
}

// return (
// <SafeAreaView style={styles.container}>
// <FlatList
// showsVerticalScrollIndicator={false}
// data={gigsData}
// renderItem={({ item }) => <GigCard item={item} />}
// keyExtractor={(item) => item.id}
// />
// </SafeAreaView>
// );

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: "white",
paddingHorizontal: 20,
paddingTop: 20,
},
card: {
backgroundColor: "white",
borderRadius: 10,
marginBottom: 20,
borderWidth: 1,
borderColor: "#ddd",
},
cardContent: {
padding: 15,
},
profilePicture: {
width: "100%",
height: 200,
borderTopLeftRadius: 10,
borderTopRightRadius: 10,
resizeMode: "cover",
backgroundColor: "grey",
},
username: {
fontSize: 16,
fontWeight: "bold",
marginBottom: 5,
},
category: {
fontSize: 14,
color: "#888",
marginBottom: 5,
},
description: {
fontSize: 14,
color: "#333",
marginBottom: 5,
},
taskDescription: {
fontSize: 14,
color: "#555",
marginBottom: 5,
},
date: {
fontSize: 12,
color: "#888",
},
});
