import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Camera } from "expo-camera";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import SvgAdd from "../assets/icon/add.svg";

export const PhotoAvatar = ({ photo, updatePhoto }) => {
  const { userId } = useSelector((state) => state.auth);
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = useState(null); //Camera.useCameraPermissions();

  const takePhoto = async () => {
    try {
      const photo = await camera.takePictureAsync();
      const avatarUrl = await uploadPhotoToServer(photo.uri);
      console.log("updatePhoto :>> ", updatePhoto);
      updatePhoto(avatarUrl);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const uploadPhotoToServer = async (photo) => {
    const response = await fetch(photo);
    const file = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, `avatarImage/${userId}`);

    await uploadBytes(storageRef, file);

    const processedPhoto = await getDownloadURL(
      ref(storage, `avatarImage/${userId}`)
    );

    return processedPhoto;
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      requestPermission(status === "granted");
    })();
  }, []);

  if (permission === null) {
    return <View />;
  }
  if (permission === false) {
    return <Text style={styles.textLink}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.photoWrapper}>
        <Camera style={styles.cameraBox} ref={setCamera}>
          {photo && (
            <View style={styles.photoBox}>
              <Image source={{ uri: photo }} style={styles.photo} />
            </View>
          )}
        </Camera>
      </View>
      <TouchableOpacity
        onPress={takePhoto}
        style={styles.photoBtn}
        activeOpacity={0.8}
      >
        <SvgAdd
          width={32}
          height={32}
          style={photo ? styles.imageBtnDelete : styles.imageBtn}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  photoWrapper: {
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    overflow: "hidden",
  },
  cameraBox: {
    width: "100%",
    height: "100%",
  },
  photoBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoBtn: {
    position: "absolute",
    bottom: 10,
    right: -7,
    width: 40,
    height: 40,
    color: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBtn: {
    transform: [{ rotate: "45deg" }],
    color: "#FF6C00",
  },
  imageBtnDelete: {
    transform: [{ rotate: "0deg" }],
    color: "#BDBDBD",
  },
  textLink: {
    textAlign: "center",
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
});
