import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";

const Inbox = ({ navigation }) => {
  const inboxMessages = [
    {
      id: 1,
      sender: "John Doe",
      subject: "Meeting Tomorrow",
      profileImage: require("../assets/dj.jpg"),
    },
    {
      id: 2,
      sender: "Jane Smith",
      subject: "Project Update",
      profileImage: require("../assets/chef.jpg"),
    },
    {
      id: 3,
      sender: "Alice Johnson",
      subject: "Regarding Budget",
      profileImage: require("../assets/cameraMan.jpg"),
    },
    // Add more messages as needed
  ];

  const renderInboxItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("InboxDetails")}
      style={styles.itemContainer}
    >
      <Image source={item.profileImage} style={styles.profileImage} />
      <View style={styles.messageContainer}>
        <View style={styles.messageHeader}>
          <Text style={styles.sender}>{item.sender}</Text>
          <Text style={styles.date}>1h</Text>
        </View>
        <Text style={styles.subject}>{item.subject}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={inboxMessages}
        renderItem={renderInboxItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "grey",
  },
  messageContainer: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  sender: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  date: {
    fontSize: 12,
    color: "#6b7c93",
  },
  subject: {
    fontSize: 16,
    color: "#14171a",
  },
});

export default Inbox;
