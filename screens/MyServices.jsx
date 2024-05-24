import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
} from "react-native";

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState("");

  const addService = () => {
    if (newServiceName.trim() !== "") {
      setServices([...services, { id: Date.now(), name: newServiceName }]);
      setNewServiceName("");
    }
  };

  const deleteService = (id) => {
    setServices(services.filter((service) => service.id !== id));
  };

  return (
    <View style={styles.container}>
      <Button title="Add Service" onPress={addService} />
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <View style={styles.serviceItem}>
            <Text>{item.name}</Text>
            <Button title="Delete" onPress={() => deleteService(item.id)} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
});
