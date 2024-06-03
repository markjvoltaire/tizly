import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../services/supabase";

const AddTime = ({ route, navigation }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  const uploadToSupabase = async () => {
    try {
      const user = supabase.auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userId = user.id;

      // Combine date and time into a single datetime object
      const selectedDateTime = new Date(date);
      selectedDateTime.setHours(time.getHours());
      selectedDateTime.setMinutes(time.getMinutes());

      const { data, error } = await supabase.from("tasks").insert([
        {
          taskCreator: userId,
          taskDescription: route.params.taskDescription,
          dateNeeded: selectedDateTime.toISOString(),
        },
      ]);

      if (error) throw error;

      Alert.alert("Task Posted");
      navigation.goBack();
      console.log("Insert result:", data);
    } catch (error) {
      console.error("Error uploading to Supabase:", error.message);
      Alert.alert("Error", "There was an issue posting the task.");
    }
  };

  const handleNext = () => {
    navigation.navigate("AddLocation", {
      taskDescription: route.params.taskDescription,
      time: time.toISOString(),
      date: date.toISOString(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose a date and time</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Date:</Text>
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          style={styles.dateTimePicker}
        />
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Time:</Text>
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
          is24Hour={true}
          style={styles.dateTimePicker}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Next" onPress={handleNext} />
        <Button
          title="Skip"
          onPress={() => {
            navigation.navigate("AddLocation", {
              taskDescription: route.params.taskDescription,
              time: null,
              date: null,
            });
          }}
          color="gray"
        />
      </View>
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
  pickerContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateTimePicker: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
  },
});

export default AddTime;
