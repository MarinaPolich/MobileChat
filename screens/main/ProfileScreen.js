import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  ImageBackground,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  authSingOutUser,
  authUpdatePhotoUser,
} from "../../redux/auth/authOperations";
import { PhotoAvatar } from "../../components/PhotoAvatar";
import { PostCard } from "../../components/PostCard";
import { updatePosts } from "../../redux/posts/postsReducer";

import { app } from "../../firebase/config";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";

import SvgLogout from "../../assets/icon/log-out.svg";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { userId, name, photo } = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);

  const getUserPosts = async () => {
    const db = getFirestore(app);

    const querySnapshot = await getDocs(
      query(collection(db, "posts"), where("userId", "==", userId))
    );

    const result = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const snap = await getCountFromServer(
          collection(db, "posts", doc.id, "comments")
        );
        return { ...doc.data(), id: doc.id, count: snap.data().count };
      })
    );
    setUserPosts(result);
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  const singOut = () => {
    dispatch(authSingOutUser());
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBg}
        source={require("../../assets/image/photoBG.png")}
      >
        <View style={styles.contentBox}>
          <View style={styles.photoContainer}>
            <PhotoAvatar
              photo={photo}
              updatePhoto={(photo) => dispatch(authUpdatePhotoUser({ photo }))}
            />
          </View>

          <TouchableOpacity onPress={singOut} style={styles.logoutBtn}>
            <SvgLogout width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.title}>{name}</Text>

          <View
            style={{
              height: "100%",
              paddingBottom: Platform.OS === "ios" ? 0 : 90,
            }}
          >
            <SafeAreaView style={{ flex: Platform.OS === "ios" ? 0.68 : 0.65 }}>
              <FlatList
                data={userPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard item={item} />}
              />
            </SafeAreaView>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "flex-end",
  },
  imageBg: {
    flex: 1,
    resizeMode: "cover",
  },
  contentBox: {
    position: "relative",
    alignItems: "center",
    marginTop: 147,
    marginBottom: 0,
    paddingHorizontal: 16,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  photoContainer: {
    width: 130,
    height: 120,
    marginTop: -60,
    marginBottom: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  logoutBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 22,
  },
  title: {
    marginBottom: 33,
    textAlign: "center",
    color: "#212121",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.01,
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

export default ProfileScreen;
