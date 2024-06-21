import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// Generate array with both whole hours and half hours in 12-hour format (AM/PM)
const hoursOfDay = [];
for (let hour = 7; hour <= 12; hour++) {
  hoursOfDay.push(`${hour}:00 AM`);
  hoursOfDay.push(`${hour}:30 AM`);
}
for (let hour = 1; hour < 8; hour++) {
  hoursOfDay.push(`${hour}:00 PM`);
  hoursOfDay.push(`${hour}:30 PM`);
}
hoursOfDay.push(`8:00 PM`);

export default function SelectTime({ route, navigation }) {
  const [selectedTime, setSelectedTime] = useState(null);

  const service = route.params.serviceBlob;

  const timestamp = route.params.selectedDate;
  const selectedDate = new Date(timestamp);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);

    // Pass selectedTime back to the previous screen via navigation
    navigation.navigate("ConfirmBooking", {
      selectedDate: selectedDate.toISOString(),
      selectedTime: time,
      timestamp,
      service,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {hoursOfDay.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeItem,
              selectedTime === time && styles.selectedTimeItem,
            ]}
            onPress={() => handleTimeSelect(time)}
          >
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollView: {
    flexGrow: 1,
  },
  timeItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
  },
  selectedTimeItem: {
    backgroundColor: "#46A05F",
  },
  timeText: {
    fontSize: 18,
    color: "#333",
  },
});
