import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import Buttons from "../Engagement/Buttons";
import AccessTab from "../AccessType/AccessTab";

export default function StatusPost({ post }) {
  let height = Dimensions.get("window").height;
  let width = Dimensions.get("window").width;

  const date = new Date(post.date);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  let formattedDate;

  if (daysDifference > 7) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = date.getMonth();
    const monthName = monthNames[month];
    formattedDate = `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
  } else if (daysDifference > 0) {
    formattedDate =
      daysDifference === 1 ? "1 day ago" : `${daysDifference} days ago`;
  } else if (hoursDifference > 0) {
    formattedDate =
      hoursDifference === 1 ? "1 hour ago" : `${hoursDifference} hours ago`;
  } else if (minutesDifference > 0) {
    formattedDate =
      minutesDifference === 1
        ? "1 minute ago"
        : `${minutesDifference} minutes ago`;
  } else {
    formattedDate = "Just now";
  }

  return (
    <View style={{ left: 10, width: width * 0.96 }}>
      <Text
        style={{
          width: width * 0.9,
          top: 5,
        }}
      >
        {post.description}
      </Text>

      <Text
        style={{
          paddingBottom: 35,
          top: 12,
          color: "#979797",
          fontFamily: "Poppins-SemiBold",
          fontSize: 12,
        }}
      >
        {formattedDate}
      </Text>

      <Buttons post={post} />
    </View>
  );
}

const styles = StyleSheet.create({});
