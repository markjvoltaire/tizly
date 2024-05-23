import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useState, useRef } from "react";
import { useUser } from "../context/UserContext";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native";

export default function Home({ navigation }) {
  const { user, setUser } = useUser();

  const services = [
    {
      id: 1,
      title: "Wedding Photography",
      category: "Photographers",
      rating: 4.8,
      price: "$200",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 2,
      title: "Car Detailing",
      category: "Auto Detailers",
      rating: 4.5,
      price: "$100",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 3,
      title: "House Cleaning",
      category: "Home Cleaning",
      rating: 4.7,
      price: "$150",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 4,
      title: "Lawn Mowing",
      category: "Lawn Services",
      rating: 4.6,
      price: "$50",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 5,
      title: "Event Photography",
      category: "Photographers",
      rating: 4.9,
      price: "$300",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 6,
      title: "Deep House Cleaning",
      category: "Home Cleaning",
      rating: 4.8,
      price: "$200",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 7,
      title: "Gardening Service",
      category: "Lawn Services",
      rating: 4.5,
      price: "$80",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
    {
      id: 8,
      title: "Pet Grooming",
      category: "Pet Services",
      rating: 4.7,
      price: "$60",
      images: [
        require("../assets/cameraMan.jpg"),
        require("../assets/photo1.jpg"),
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>ServiceFinder</Text>
      </View>

      {/* Search Bar */}
      <Text style={{ left: 23, fontSize: 20, fontFamily: "gilroy" }}>
        Hello {user?.username}
      </Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for services..."
      />

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        <CategoryItem title="Photographers" />
        <CategoryItem title="Auto Detailers" />
        <CategoryItem title="Home Cleaning" />
        <CategoryItem title="Lawn Services" />
        <CategoryItem title="Pet Services" />
        {/* Add more categories as needed */}
      </ScrollView>

      {/* Services Feed */}
      <ScrollView contentContainerStyle={styles.servicesContainer}>
        {services.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </ScrollView>
    </View>
  );
}

const CategoryItem = ({ title }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <Text style={styles.categoryText}>{title}</Text>
  </TouchableOpacity>
);

const ServiceItem = ({ service }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const onImageScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const currentIndex = Math.floor(contentOffsetX / viewSize);
    setCurrentImageIndex(currentIndex);
  };

  return (
    <View style={styles.serviceItem}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={service.images}
        renderItem={({ item }) => (
          <Image source={item} style={styles.serviceImage} />
        )}
        keyExtractor={(item, index) => index.toString()}
        onScroll={onImageScroll}
        scrollEventThrottle={16}
      />
      <View style={styles.paginationDots}>
        {service.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentImageIndex ? "#C52A66" : "#ccc",
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text style={styles.serviceCategory}>{service.category}</Text>
        <Text style={styles.serviceRating}>Rating: {service.rating}</Text>
        <Text style={styles.servicePrice}>{service.price}</Text>
        <View style={styles.deliveryInfo}>
          <Image
            source={require("../assets/photo3.jpg")}
            style={styles.profileImage}
          />
          <Text style={styles.deliveryPersonName}>John Doe</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  searchBar: {
    backgroundColor: "white",
    padding: 10,
    margin: 20,
    borderRadius: 5,
    elevation: 2, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 0.2,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    bottom: 10,
    marginBottom: 25,
  },
  categoryItem: {
    backgroundColor: "#C52A66",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 12,
    elevation: 1, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50, // Adjust the height as needed
  },
  categoryText: {
    fontSize: 16,
    color: "white",
    fontFamily: "gilroy",
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  serviceItem: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 1, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderWidth: 3,
    borderColor: "#f5f5f5",
  },
  serviceImage: {
    width: Dimensions.get("window").width * 0.89,
    height: 200,
    resizeMode: "cover",
    backgroundColor: "grey",
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  serviceInfo: {
    padding: 10,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceCategory: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  serviceRating: {
    fontSize: 14,
    color: "#666",
  },
  servicePrice: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  deliveryPersonName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
