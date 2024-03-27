import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

export default function SelectGig({ navigation }) {
  const professions = [
    { id: 1, profession: "Catering" },
    { id: 2, profession: "Barber" },
    { id: 3, profession: "Photographer" },
    { id: 4, profession: "Fitness" },
    { id: 5, profession: "Make Up Artist" },
    { id: 6, profession: "Home Improvement" },
    { id: 7, profession: "Visual Media" },
    { id: 8, profession: "Hair Stylist" },
    { id: 9, profession: "DJ" },
    { id: 10, profession: "Mechanic" },
    { id: 11, profession: "Bartender" },
    { id: 12, profession: "Videographer" },
  ];

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ top: 50 }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 10,
            left: 5,
            top: 1,
          }}
        >
          {professions.map((item) => (
            <View
              key={item.id}
              style={{
                flexBasis: "33.33%",
                marginBottom: 50,
                paddingRight: 10,
              }}
            >
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PostGig", item.profession)
                  }
                  style={{
                    backgroundColor: "white",
                    alignItems: "center",
                    height: 50,
                    justifyContent: "center",
                    borderRadius: 9,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "black",
                    }}
                  >
                    {item.profession}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
