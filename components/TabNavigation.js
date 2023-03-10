import React from "react";
import { useDispatch } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CreatePostsScreen from "../screens/main/CreatePostsScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import { TouchableOpacity } from "react-native";
import PostsScreen from "../screens/main/PostsScreen";
import { authSingOutUser } from "../redux/auth/authOperations";

import SvgGrid from "../assets/icon/grid.svg";
import SvgNew from "../assets/icon/new.svg";
import SvgUser from "../assets/icon/user.svg";
import SvgLogout from "../assets/icon/log-out.svg";

const MainTab = createBottomTabNavigator();

const TabNavigation = () => {
  const dispatch = useDispatch();
  const singOut = () => {
    dispatch(authSingOutUser());
  };
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        sceneContainerStyle: {
          flex: 1,
        },
        tabBarStyle: {
          height: 83,
          paddingBottom: 34,
          paddingTop: 9,
          paddingHorizontal: "15%",
        },
        headerStyle: {
          height: 88,
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Roboto-Medium",
          fontSize: 17,
          lineHeight: 22,
        },
      }}
    >
      <MainTab.Screen
        name="Публикации"
        component={PostsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <SvgGrid width={40} height={40} style={{ color }} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={singOut}
              style={{ marginHorizontal: 16 }}
            >
              <SvgLogout width={24} height={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <MainTab.Screen
        name="Создать публикацию"
        component={CreatePostsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <SvgNew width={70} height={40} style={{ color }} />
          ),
        }}
      />

      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SvgUser width={40} height={40} style={{ color }} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

export default TabNavigation;
