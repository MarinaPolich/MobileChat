import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import SvgMap from "../assets/icon/map.svg";
import SvgMessage from "../assets/icon/message.svg";
import SvgMessageCount from "../assets/icon/message-circle.svg";

export const PostCard = ({ item }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.photo }} style={styles.postImage} />
      <Text style={styles.postName}>{item.namePost}</Text>

      <View
        style={{
          height: 24,
          flexDirection: "row",
          marginTop: 8,
        }}
      >
        <TouchableOpacity
          style={{ ...styles.infoBtn, flex: 0.2 }}
          onPress={() =>
            navigation.navigate("Комментарии", { postId: item.id })
          }
        >
          <Text style={{ ...styles.infoText, textAlign: "left" }}>
            {item.count === 0 ? (
              <SvgMessage width={24} height={24} style={styles.icon} />
            ) : (
              <SvgMessageCount width={24} height={24} style={styles.icon} />
            )}{" "}
            {item.count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.infoBtn, flex: 0.8 }}
          onPress={() =>
            navigation.navigate("Карта", {
              location: item.location,
            })
          }
        >
          <Text
            style={{
              ...styles.infoText,
              textAlign: "right",
              textDecorationLine: "underline",
            }}
          >
            <SvgMap width={24} height={24} style={{ ...styles.icon }} />
            {item.location.title}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    marginBottom: 32,
  },
  postImage: {
    width: "100%",
    aspectRatio: 343 / 240,
    marginBottom: 8,
    borderRadius: 8,
  },
  postName: {
    marginBottom: 8,
    color: "#212121",
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 19,
  },
  infoBtn: {
    height: 24,
    textAlign: "left",
  },
  icon: {
    marginRight: 6,
  },

  infoText: {
    verticalAlign: "middle",
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
});
