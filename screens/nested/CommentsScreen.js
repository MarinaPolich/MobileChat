import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { app } from "../../firebase/config";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import SvgSend from "../../assets/icon/send.svg";
import { updatePostById } from "../../redux/posts/postsReducer";

const CommentsScreen = ({ route }) => {
  const dispatch = useDispatch();
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const { postId } = route.params;
  const { name, userId } = useSelector((state) => state.auth);
  const { photo } = useSelector((state) =>
    state.posts.find((item) => item.id === postId)
  );
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [avatars, setAvatars] = useState({});

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const createPost = async () => {
    if (comment.trim().length > 0) {
      const db = getFirestore(app);
      const querySnapshot = await addDoc(
        collection(db, "posts", postId, "comments"),
        { comment, name, timestamp: Date.now(), userId }
      );
      getAllPost();
      setComment("");
    }
  };

  const getAllPost = async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(
      query(collection(db, "posts", postId, "comments"), orderBy("timestamp"))
    );
    const result = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setAllComments(result);
    dispatch(updatePostById({ id: postId, count: result.length }));

    const innerAvatars = { ...avatars };
    await Promise.all(
      result.map(async (item) => {
        if (!innerAvatars[item.userId]) {
          innerAvatars[item.userId] = await getAvatar(item);
        }
      })
    );
    console.log("innerAvatars :>> ", innerAvatars);
    setAvatars(innerAvatars);
  };
  const getImageWithoutAvatar = ({ name }) =>
    "https://www.gravatar.com/avatar/EMAIL_MD5?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/" +
    encodeURI(name);

  const getAvatar = async ({ userId, name }) => {
    const storage = getStorage();
    try {
      const processedPhoto = await getDownloadURL(
        ref(storage, `avatarImage/${userId}`)
      );
      console.log("processedPhoto :>> ", { processedPhoto, userId });
      return processedPhoto;
    } catch (error) {
      console.log("error :>> ", error);
      return getImageWithoutAvatar({ name });
    }
  };

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.postImage} />

        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={allComments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.boxComment}>
                <Image
                  source={{
                    uri: item.userId
                      ? avatars[item.userId]
                      : getImageWithoutAvatar(item),
                  }}
                  style={styles.photoComment}
                />
                <View style={styles.boxText}>
                  <Text style={styles.textComment}>{item.comment}</Text>
                  <Text style={styles.dataText}>
                    {format(
                      new Date(item.timestamp ?? 0),
                      "dd LLLL, yyyy | HH:mm",
                      { locale: ru }
                    )}
                  </Text>
                </View>
              </View>
            )}
          />
        </SafeAreaView>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <View
            style={{
              paddingBottom: isShowKeyboard ? 106 : 16,
            }}
          >
            <TextInput
              style={styles.input}
              textAlign={"left"}
              placeholder={"Комментировать..."}
              placeholderTextColor={"#BDBDBD"}
              onFocus={() => setIsShowKeyboard(true)}
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.addBtn} onPress={createPost}>
              <SvgSend width={34} height={34} style={styles.iconBtn} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    backgroundColor: "#ffffff",
  },
  postImage: {
    width: "100%",
    aspectRatio: 343 / 240,
    marginBottom: 32,
    borderRadius: 8,
  },
  boxComment: {
    flexDirection: "row",
    marginBottom: 24,
  },
  textComment: {
    marginBottom: 8,
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  photoComment: {
    // flex: 0.1,
    width: 28,
    height: 28,
    borderRadius: 14,
    marginEnd: 16,
  },
  boxText: {
    flex: 0.95,
    padding: 16,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  dataText: {
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    lineHeight: 12,
  },
  input: {
    height: 50,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 100,
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  icon: {},
  addBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 8,
  },
});

export default CommentsScreen;
