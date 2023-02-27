import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";

import { useDispatch } from "react-redux";
import { authSingInUser } from "../../redux/auth/authOperations";

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen({ navigation }) {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);

  const dispatch = useDispatch();

  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    dispatch(authSingInUser(state));
    setState(initialState);
  };

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      setDimensions(width);
    };
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../../assets/image/photoBG.png")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
          >
            <View
              style={{
                ...styles.form,
                marginBottom: isShowKeyboard ? -208 : 0,
              }}
            >
              <Text style={styles.title}>Войти</Text>
              <TextInput
                style={{ ...styles.input, marginBottom: 16, width: dimensions }}
                textAlign={"left"}
                placeholder={"Адрес электронной почты"}
                placeholderTextColor={"#BDBDBD"}
                onFocus={() => setIsShowKeyboard(true)}
                value={state.email}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, email: value }))
                }
              />
              <TextInput
                style={{ ...styles.input, marginBottom: 43, width: dimensions }}
                textAlign={"left"}
                placeholder={"Пароль"}
                placeholderTextColor={"#BDBDBD"}
                secureTextEntry={true}
                onFocus={() => setIsShowKeyboard(true)}
                value={state.password}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, password: value }))
                }
              />

              <TouchableOpacity
                style={{ ...styles.btn, width: dimensions }}
                activeOpacity={0.8}
                onPress={handleSubmit}
              >
                <Text style={styles.btnText}>Войти</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.8}
              >
                <Text style={styles.textLink}>
                  Нет аккаунта? Зарегистрироваться
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
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
  },
  input: {
    height: 50,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    color: "#212121",
    // fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
  form: {
    alignItems: "center",
    marginBottom: 0,
    paddingTop: 32,
    paddingBottom: 111,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  title: {
    marginBottom: 33,
    textAlign: "center",
    color: "#212121",
    // fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.01,
  },
  btn: {
    marginBottom: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    textAlign: "center",
  },
  btnText: {
    color: "#FFFFFF",
    // fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
  },
  textLink: {
    textAlign: "center",
    color: "#1B4371",
    // fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
});
