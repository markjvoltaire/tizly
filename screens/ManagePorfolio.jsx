import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";

const { width: screenWidth } = Dimensions.get("window");
const ITEM_WIDTH = screenWidth / 3 - 10;

const ManagePortfolio = ({ navigation }) => {
  const { user } = useUser();
  const [portfolioList, setPortfolioList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchImages(); // Initial fetch of services when component mounts
  }, [user.user_id]); // Re-fetch when user_id changes

  // Function to fetch services from Supabase
  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .eq("userId", user.user_id)
        .order("id", { ascending: false });

      if (error) throw error;
      setPortfolioList(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      Alert.alert("Error", "Failed to fetch Services");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a service
  const deleteImage = async (image) => {
    try {
      const { error } = await supabase
        .from("portfolio")
        .delete()
        .eq("userId", user.user_id)
        .eq("id", image.id);

      if (error) throw error;
      Alert.alert("Image Deleted");
      setModalVisible(false);
      // Update local state to remove the deleted service
      setPortfolioList((prevList) =>
        prevList.filter((item) => item.id !== image.id)
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete service");
    }
  };

  // Function to show delete confirmation alert
  const showDeleteAlert = (image) => {
    Alert.alert(
      "Warning!",
      "This action cannot be undone. Are you sure you want to delete?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          style: "destructive",
          text: "Delete",
          onPress: () => deleteImage(image),
        },
      ]
    );
  };

  // Function to open modal and set selected item
  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Function to handle refresh of services
  const refreshServices = () => {
    fetchImages();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Manage Portfolio</Text>
      </View>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshServices} />
        }
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="grey" />
            <Text>Loading images...</Text>
          </View>
        )}
        {!isLoading && portfolioList.length === 0 && (
          <View style={styles.noServicesContainer}>
            <Text style={styles.noServicesText}>You have no images.</Text>
          </View>
        )}
        <View style={styles.gridContainer}>
          {!isLoading &&
            portfolioList.map((item, index) => (
              <Pressable
                key={index}
                style={[
                  styles.gridItem,
                  index % 3 !== 2 && { marginRight: 10 },
                ]}
                onPress={() => openModal(item)}
              >
                <Image source={{ uri: item.uri }} style={styles.image} />
              </Pressable>
            ))}
        </View>
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Manage Image</Text>
              {selectedItem && (
                <TouchableOpacity
                  onPress={() => showDeleteAlert(selectedItem)}
                  style={[styles.modalButton, styles.deleteButton]}
                >
                  <Text style={styles.buttonText}>Delete Image</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  headerText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
    backgroundColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 350,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "white",
    height: 50,
    width: 200,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 0.4,
  },
  deleteButton: {
    backgroundColor: "red",
    marginBottom: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  cancelButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
  noServicesContainer: {
    flex: 1,
    top: 200,
    alignItems: "center",
    height: 200,
  },
  noServicesText: {
    fontSize: 18,
    color: "gray",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ManagePortfolio;
