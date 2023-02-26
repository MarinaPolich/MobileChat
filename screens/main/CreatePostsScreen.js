import React, { useState, useEffect } from "react";
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

import SvgCamera from "../../assets/icon/camera.svg";
import SvgMap from "../../assets/icon/map.svg";

const initialState = {
  name: "",
  location: { latitude: 0, longitude: 0 },
  photo: "",
};

const CreatePostsScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);

  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  Camera.requestCameraPermissionsAsync();

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const takePhoto = async () => {
    try {
      const photo = await camera.takePictureAsync();
      setPhoto(photo.uri);
      setState((prevState) => ({ ...prevState, photo: photo.uri }));

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const [position] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      console.log("position :>> ", position);

      setLocation({ latitude, longitude });
      setState((prevState) => ({
        ...prevState,
        location: {
          latitude,
          longitude,
          title: `${position.city}, ${position.region}`,
        },
      }));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const sendPhoto = () => {
    navigation.navigate("Публикации", { state });
    setState(initialState);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <View style={styles.cameraBox}>
            <Camera style={styles.camera} ref={setCamera}>
              {photo && (
                <>
                  <View style={styles.photoBox}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                  </View>
                </>
              )}
              <TouchableOpacity onPress={takePhoto}>
                <SvgCamera width={60} height={60} />
              </TouchableOpacity>
            </Camera>
          </View>

          {photo ? (
            <Text style={styles.titleCamera}>Редактировать фото</Text>
          ) : (
            <Text style={styles.titleCamera}>Загрузите фото</Text>
          )}

          <View
            style={{
              ...styles.form,
              marginBottom: isShowKeyboard ? -174 : 0,
            }}
          >
            <TextInput
              style={{ ...styles.input, marginBottom: 16 }}
              textAlign={"left"}
              placeholder={"Название..."}
              placeholderTextColor={"#BDBDBD"}
              onFocus={() => setIsShowKeyboard(true)}
              value={state.name}
              onChangeText={(value) =>
                setState((prevState) => ({ ...prevState, name: value }))
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
              disabled={state.photo.length === 0}
              style={
                state.photo.length === 0
                  ? { ...styles.addBtn, ...styles.disabledAddBtn }
                  : styles.addBtn
              }
              onPress={sendPhoto}
            >
              <Text
                style={
                  state.photo.length === 0
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
  photoBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
