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
for (let hour = 7; hour < 24; hour++) {
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  hoursOfDay.push(`${displayHour}:00 ${period}`);
  hoursOfDay.push(`${displayHour}:30 ${period}`);
}

export default function SelectTime({ route, navigation }) {
  const [selectedTime, setSelectedTime] = useState(null);

  const service = route.params.serviceBlob;

  const timestamp = route.params.selectedDate;
  const selectedDate = new Date(timestamp);

  const currentDateTime = new Date();
  const isSameDay =
    selectedDate.toDateString() === currentDateTime.toDateString();

  const handleTimeSelect = (time) => {
    if (isTimeInThePast(time)) {
      return; // Do nothing if the time is in the past
    }
    setSelectedTime(time);

    // Pass selectedTime back to the previous screen via navigation
    navigation.navigate("ConfirmBooking", {
      selectedDate: selectedDate.toISOString(),
      selectedTime: time,
      timestamp,
      service,
    });
  };

  const isTimeInThePast = (time) => {
    if (!isSameDay) {
      return false; // If not the same day, none of the times are in the past
    }

    const [timeString, period] = time.split(" ");
    const [hour, minute] = timeString.split(":").map(Number);

    let hour24 = hour;
    if (period === "PM" && hour !== 12) {
      hour24 += 12;
    } else if (period === "AM" && hour === 12) {
      hour24 = 0;
    }

    const timeDate = new Date(selectedDate);
    timeDate.setHours(hour24, minute, 0, 0);

    return timeDate < currentDateTime;
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
              isTimeInThePast(time) && styles.disabledTimeItem,
            ]}
            onPress={() => handleTimeSelect(time)}
            disabled={isTimeInThePast(time)}
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
  disabledTimeItem: {
    backgroundColor: "#ccc",
  },
  timeText: {
    fontSize: 18,
    color: "#333",
  },
});
