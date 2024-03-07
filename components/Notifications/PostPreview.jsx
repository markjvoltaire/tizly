import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  Modal,
  useColorScheme,
} from "react-native";
import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { Video } from "expo-av";

export default function PostPreview({ item }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [status, setStatus] = React.useState({});
  const video = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scheme = useColorScheme();

  const navigation = useNavigation();

  if (item.mediaType === "image") {
    return (
      <View>
        <Pressable onPress={() => setModalVisible(true)}>
          <View
            style={{
              width: screenWidth * 0.12,
              height: screenHeight * 0.07,
              top: screenHeight * 0.01,
              borderRadius: 5,
              backgroundColor: "grey",
              left: screenWidth * 0.07,
            }}
          >
            <Image
              style={{
                width: screenWidth * 0.17,
                height: screenHeight * 0.1,
                borderRadius: 5,
              }}
              source={{ uri: item.media }}
            />
          </View>
        </Pressable>
        <Modal transparent={true} animationType="slide" visible={modalVisible}>
          <Pressable onPress={() => setModalVisible(false)}>
            <View
              style={{
                width: screenWidth,
                height: screenHeight,
                backgroundColor: "black",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                opacity: 0.9,
                padding: 20,
                alignItems: "center",
              }}
            >
              {/* Your modal Background */}
            </View>

            <View
              style={{
                position: "absolute",
                bottom: screenHeight * 0.3,
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  aspectRatio: 1,
                  height: screenHeight * 0.4,
                  borderRadius: 10,
                  alignSelf: "center",
                  left: screenWidth * 0.062,
                }}
                source={{ uri: item.media }}
              />
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }

  if (item.mediaType === "status") {
    return (
      <>
        <Pressable onPress={() => setModalVisible(true)}>
          <View
            style={{
              width: screenWidth * 0.17,
              height: screenHeight * 0.1,
              top: screenHeight * 0.01,
              borderRadius: 5,
              borderWidth: 0.3,
              left: screenWidth * 0.07,
            }}
          >
            <View
              style={{
                width: screenWidth * 0.1,
                height: screenHeight * 0.07,
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 4,
                  fontWeight: "300",
                  color: scheme === "light" ? "black" : "white",
                }}
              >
                {item.description}
              </Text>
            </View>
          </View>
        </Pressable>
        <Modal transparent={true} animationType="slide" visible={modalVisible}>
          <Pressable onPress={() => setModalVisible(false)}>
            <View
              style={{
                width: screenWidth,
                height: screenHeight,
                backgroundColor: "black",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                opacity: 0.9,
                padding: 20,
                alignItems: "center",
              }}
            >
              {/* Your modal Background */}
            </View>

            <View
              style={{
                position: "absolute",
                bottom: screenHeight * 0.3,
                left: screenWidth * 0.09,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  bottom: screenHeight * 0.1,
                  height: screenHeight * 0.3,
                  width: screenWidth * 0.7,
                  justifyContent: "center",
                  borderRadius: 10,
                  left: screenWidth * 0.062,
                }}
              >
                <Text style={{ alignSelf: "center" }}>{item.description}</Text>
              </View>
            </View>
          </Pressable>
        </Modal>
      </>
    );
  }

  if (item.mediaType === "video") {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("AlertVideo", {
            item,
          })
        }
      >
        <View
          style={{
            width: screenWidth * 0.17,
            height: screenHeight * 0.1,
            top: screenHeight * 0.01,
            borderRadius: 5,
            left: screenWidth * 0.07,
          }}
        >
          <Video
            shouldPlay={false}
            ref={video}
            resizeMode="cover"
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            style={{
              width: screenWidth * 0.14,
              height: screenHeight * 0.09,
              borderRadius: 5,
              backgroundColor: "grey",
            }}
            source={{ uri: item.media }}
          />
        </View>
      </Pressable>
    );
  }

  {
    /* Modal */
  }
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
  >
    <Pressable
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
      onPress={() => closeModal()}
    >
      <View
        style={{
          width: screenWidth,
          height: screenHeight,
          backgroundColor: "black",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          opacity: 0.9,
          padding: 20,
          alignItems: "center",
        }}
      >
        {/* Your modal Background */}
      </View>
      <View
        style={{
          position: "absolute",
          bottom: screenHeight * 0.3,
          justifyContent: "center",
        }}
      >
        {item.mediaType === "image" ? (
          <Image
            resizeMode="contain"
            style={{
              aspectRatio: 1,
              height: screenHeight * 0.4,
              borderRadius: 10,
            }}
            source={{ uri: item.media }}
          />
        ) : item.mediaType === "status" ? (
          <View
            style={{
              backgroundColor: "white",
              bottom: screenHeight * 0.1,
              height: screenHeight * 0.3,
              width: screenWidth * 0.7,
              justifyContent: "center",
              borderRadius: 10,
            }}
          >
            <Text style={{ alignSelf: "center" }}>{item.description}</Text>
          </View>
        ) : (
          <Text>VIDEO</Text>
        )}
      </View>
    </Pressable>
  </Modal>;
}

const styles = StyleSheet.create({});
