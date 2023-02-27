import React from "react";
import { useDispatch } from "react-redux";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { authSingOutUser } from "../../redux/auth/authOperations";

import SvgLogout from "../../assets/icon/log-out.svg";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(authSingOutUser());
  };

  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
      <TouchableOpacity onPress={handleLogout}>
        <SvgLogout width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
