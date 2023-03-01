import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
} from "react-native";

import { app } from "../../firebase/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

import SvgCamera from "../../assets/icon/camera.svg";
import SvgMap from "../../assets/icon/map.svg";

const initialState = {
  namePost: "",
  location: { latitude: 0, longitude: 0 },
  photo: null,
  // timestamp: null,
};

const CreatePostsScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  Camera.requestCameraPermissionsAsync();

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const { userId, name } = useSelector((state) => state.auth);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const takePhoto = async () => {
    try {
      const photo = await camera.takePictureAsync();

      const [position] = await Location.reverseGeocodeAsync(location);
      setState((prevState) => ({
        ...prevState,
        photo: photo.uri,
        location: {
          ...location,
          title: `${position.city}, ${position.region}`,
        },
      }));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const sendPhoto = async () => {
    await uploadPostToServer();
    navigation.navigate("Публикации", { newPost: Date.now().toString() });
    setState(initialState);
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(state.photo);
    const file = await response.blob();

    const uniquePostId = Date.now().toString();

    const storage = getStorage();
    const storageRef = ref(storage, `postImage/${uniquePostId}`);

    await uploadBytes(storageRef, file);

    const processedPhoto = await getDownloadURL(
      ref(storage, `postImage/${uniquePostId}`)
    );

    return processedPhoto;
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    try {
      const db = getFirestore(app);
      const obj = {
        ...state,
        photo,
        userId,
        name,
        timestamp: Date.now(),
      };
      const createPost = await addDoc(collection(db, "posts"), obj);
      console.log("Document written with ID: ", createPost.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });
    })();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <View style={styles.cameraBox}>
          {state.photo ? (
            <>
              <View style={styles.camera}>
                <Image source={{ uri: state.photo }} style={styles.photo} />
              </View>
            </>
          ) : (
            <Camera style={styles.camera} ref={setCamera}>
              <TouchableOpacity onPress={takePhoto}>
                <SvgCamera width={60} height={60} />
              </TouchableOpacity>
            </Camera>
          )}
        </View>

        {state.photo ? (
          <Text style={styles.titleCamera}>Редактировать фото</Text>
        ) : (
          <Text style={styles.titleCamera}>Загрузите фото</Text>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <View
            style={{
              ...styles.form,
              marginBottom: isShowKeyboard ? -144 : 0,
            }}
          >
            <TextInput
              style={{ ...styles.input, marginBottom: 16 }}
              textAlign={"left"}
              placeholder={"Название..."}
              placeholderTextColor={"#BDBDBD"}
              onFocus={() => setIsShowKeyboard(true)}
              value={state.namePost}
              onChangeText={(value) =>
                setState((prevState) => ({ ...prevState, namePost: value }))
              }
            />
            <View style={{ position: "relative", marginBottom: 32 }}>
              <SvgMap width={24} height={24} style={styles.icon} />
              <TextInput
                style={{ ...styles.input, paddingLeft: 32 }}
                textAlign={"left"}
                placeholder={"Местность..."}
                placeholderTextColor={"#BDBDBD"}
                readOnly={true}
                onFocus={() => setIsShowKeyboard(true)}
                value={state.location.title}
              />
            </View>
            <TouchableOpacity
              disabled={!state.photo}
              style={
                !state.photo
                  ? { ...styles.addBtn, ...styles.disabledAddBtn }
                  : styles.addBtn
              }
              onPress={sendPhoto}
            >
              <Text
                style={
                  !state.photo
                    ? { ...styles.titleAddBtn, ...styles.disabledTitleAddBtn }
                    : styles.titleAddBtn
                }
              >
                Опубликовать
              </Text>
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
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  form: {
    // flex: 1,
  },
  cameraBox: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    aspectRatio: 343 / 240,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  titleCamera: {
    marginBottom: 32,
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  input: {
    height: 50,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  icon: {
    position: "absolute",
    left: 0,
    top: 9,
  },
  addBtn: {
    height: 51,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
  },
  disabledAddBtn: {
    backgroundColor: "#F6F6F6",
  },
  titleAddBtn: {
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  disabledTitleAddBtn: {
    color: "#BDBDBD",
  },
});

export default CreatePostsScreen;
