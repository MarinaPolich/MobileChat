import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import SvgMap from "../../assets/icon/map.svg";
import SvgMessage from "../../assets/icon/message.svg";

const PostsScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Image
              source={{ uri: item.state.photo }}
              style={styles.postImage}
            />
            <Text style={styles.postName}>{item.state.name}</Text>

            <View
              style={{
                height: 24,
                flexDirection: "row",
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                style={{ ...styles.infoBtn, flex: 0.2 }}
                onPress={() => navigation.navigate("Комментарии")}
              >
                <Text style={{ ...styles.infoText, textAlign: "left" }}>
                  <SvgMessage width={24} height={24} style={styles.icon} /> 0
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.infoBtn, flex: 0.7 }}
                onPress={() =>
                  navigation.navigate("Карта", {
                    location: item.state.location,
                  })
                }
              >
                <Text
                  style={{
                    ...styles.infoText,
                    textAlign: "right",
                    marginTop: -2,
                    textDecorationLine: "underline",
                  }}
                >
                  <SvgMap width={24} height={24} style={{ ...styles.icon }} />
                  {item.state.location.title}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  postContainer: {
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
    color: "#BDBDBD",
  },
  infoText: {
    verticalAlign: "middle",
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
});

export default PostsScreen;
