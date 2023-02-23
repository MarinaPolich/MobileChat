import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

export default function App() {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("./assets/image/photoBG.png")}
      >
        <View style={styles.form}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
              ...styles.showKeyboard,
              marginBottom: isShowKeyboard ? 32 : 43,
            }}
          >
            <Text style={styles.title}>Регистрация</Text>
            <TextInput
              style={{ ...styles.input, marginBottom: 16 }}
              textAlign={"left"}
              placeholder={"Логин"}
              placeholderTextColor={"#BDBDBD"}
              onFocus={() => setIsShowKeyboard(true)}
            />
            <TextInput
              style={{ ...styles.input, marginBottom: 16 }}
              textAlign={"left"}
              placeholder={"Адрес электронной почты"}
              placeholderTextColor={"#BDBDBD"}
              onFocus={() => setIsShowKeyboard(true)}
            />
            <TextInput
              // style={{ ...styles.input, marginBottom: 32 }}
              style={styles.input}
              textAlign={"left"}
              placeholder={"Пароль"}
              placeholderTextColor={"#BDBDBD"}
              secureTextEntry={true}
              onFocus={() => setIsShowKeyboard(true)}
            />
          </KeyboardAvoidingView>
          <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
            <Text style={styles.btnText}>Войти</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    // alignItems: "center",
  },
  input: {
    height: 50,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    color: "#212121",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
  form: {
    paddingHorizontal: 16,
    paddingVertical: 45,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  title: {
    marginBottom: 33,
    textAlign: "center",
    color: "#212121",
    fontWeight: "500",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.01,
  },
  btn: {
    // marginTop: 11,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    textAlign: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
  },
  showKeyboard: {
    marginBottom: 43,
  },
});
