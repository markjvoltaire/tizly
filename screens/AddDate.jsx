import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "../services/supabase";

const AddDate = ({ route, navigation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const serviceBlob = route.params.serviceInfo;

  const getDaysInMonth = useMemo(
    () => (year, month) => {
      const date = new Date(year, month, 1);
      const days = [];
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return days;
    },
    []
  );

  const uploadToSupabase = async () => {
    setLoading(true);
    try {
      const user = supabase.auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userId = user.id;

      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(selectedTime.getHours());
      selectedDateTime.setMinutes(selectedTime.getMinutes());

      const { data, error } = await supabase.from("tasks").insert([
        {
          taskCreator: userId,
          taskDescription: route.params.taskDescription,
          dateNeeded: selectedDateTime.toISOString(),
        },
      ]);

      if (error) throw error;

      Alert.alert("Task Posted");
      console.log("Selected Date:", selectedDate); // Log selected date
    } catch (error) {
      console.error("Error uploading to Supabase:", error.message);
      Alert.alert(
        "Error",
        `There was an issue posting the task: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedDate) {
      uploadToSupabase(); // Call upload function directly to log and upload
    }
  };

  const renderDateItem = ({ item }) => {
    const isPastDate = item < new Date().setHours(0, 0, 0, 0); // Set to start of current day

    const handleDateSelection = () => {
      if (!isPastDate) {
        setSelectedDate(item);
        setSelectedTime(null);
        navigation.navigate("SelectTime", {
          selectedDate: item.getTime(),
          serviceDetails: route.params.item,
          serviceBlob,
        }); // Pass timestamp instead of Date object
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          selectedDate &&
            selectedDate.toDateString() === item.toDateString() &&
            styles.selectedItem,
          isPastDate && styles.disabledItem,
        ]}
        onPress={handleDateSelection}
        disabled={isPastDate}
      >
        <Text style={styles.itemText}>{item.getDate()}</Text>
      </TouchableOpacity>
    );
  };

  const renderTimeItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.timeItem,
        selectedTime &&
          selectedTime.getHours() === item.getHours() &&
          styles.selectedItem,
      ]}
      onPress={() => setSelectedTime(item)}
    >
      <Text style={styles.itemText}>
        {item.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>
    </TouchableOpacity>
  );

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthContainer}>
        <Button title="Prev" onPress={() => changeMonth(-1)} />
        <Text style={styles.monthText}>
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </Text>
        <Button title="Next" onPress={() => changeMonth(1)} />
      </View>

      <FlatList
        key={"dates"}
        data={getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())}
        renderItem={renderDateItem}
        keyExtractor={(item) => item.toISOString()}
        numColumns={7}
        columnWrapperStyle={styles.row}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "300",
    paddingHorizontal: 10,
  },
  monthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "500",
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
  },
  dateItem: {
    flex: 1,
    paddingVertical: 10,
    margin: 3,
    backgroundColor: "#f9f9f9",
    borderRadius: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    minWidth: 44, // Ensures double-digit numbers fit
  },
  timeItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#cce5ff",
    padding: 5,
  },
  disabledItem: {
    backgroundColor: "#e0e0e0",
  },
  itemText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});

export default AddDate;
