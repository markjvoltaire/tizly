import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { supabase } from "../services/supabase";
import { useUser } from "../context/UserContext";

export default function OrderDetails({ route, navigation }) {
  const { user } = useUser();
  const order = route.params.service;
  const {
    created_at,
    id,
    orderId,
    orderStatus,
    purchaserId,
    serviceId,
    user_id,
    date,
    time,
    seller_id,
  } = order;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reportText, setReportText] = useState("");

  const formattedCreatedAt = new Date(created_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function reportTask() {
    try {
      const { data, error } = await supabase.from("orderReports").insert([
        {
          customerId: user.user_id,
          description: reportText,
          serviceId: order.serviceId,
        },
      ]);

      console.log("data", data);

      console.log("error", error);

      return data;
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleReportPress = () => {
    setIsModalVisible(true);
  };

  const handleReportSubmit = () => {
    // Handle the report submission (e.g., send the reportText to a server)
    console.log("Reported issue:", reportText);
    setIsModalVisible(false);
    setReportText("");
    reportTask();
    Alert.alert("Your report was sent");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setReportText("");
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Order ID:</Text>
          <Text style={styles.value}>{orderId}</Text>

          <Text style={styles.label}>Payment Date:</Text>
          <Text style={styles.value}>{formattedCreatedAt}</Text>

          <Text style={styles.label}>Purchaser ID:</Text>
          <Text style={styles.value}>{purchaserId}</Text>

          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{time}</Text>

          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formattedDate}</Text>

          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{seller_id}</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleReportPress}>
          <Text style={styles.buttonText}>Report Order</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Report Issue</Text>
            <TextInput
              style={styles.input}
              placeholder="Describe the issue"
              value={reportText}
              multiline
              onChangeText={setReportText}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleReportSubmit}
            >
              <Text style={styles.buttonText}>Submit Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#46A05F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    width: "100%",
    height: 200,
  },
  modalButton: {
    backgroundColor: "#46A05F",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
});
