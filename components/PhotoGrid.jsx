import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function PhotoGrid() {
  return (
    <View>
      <Text>PhotoGrid</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

// Bio Component

// Photo Grid Component
// const PhotoGrid = ({ photos, loadingGrid, profilePost, fadeAnim, loading }) => {
//   const renderItem = ({ item }) => (
//     <Pressable style={styles.photoItem}>
//       <Animated.Image
//         source={{ uri: item.media }}
//         style={{
//           flex: 1,
//           borderRadius: 8,
//           backgroundColor: "grey",
//           opacity: fadeAnim,
//         }}
//       />
//     </Pressable>
//   );

//   if (loadingGrid) {
//     return (
//       <View>
//         <LottieView
//           style={{
//             height: 130,
//             width: 130,

//             alignSelf: "center",
//           }}
//           source={require("../assets/lottie/grey-loader.json")}
//           autoPlay
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.sectionContainer}>
//       {!profilePost.length ? (
//         <Text
//           style={{
//             alignSelf: "center",
//             color: "grey",
//             fontFamily: "alata",
//             fontSize: 23,
//             bottom: 10,
//           }}
//         >
//           No Images Uploaded
//         </Text>
//       ) : (
//         <FlatList
//           data={profilePost}
//           renderItem={renderItem}
//           keyExtractor={(item, index) => index.toString()}
//           numColumns={3}
//           contentContainerStyle={styles.photoGridContainer}
//         />
//       )}
//     </View>
//   );
// };
