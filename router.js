import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "./screens/auth/LoginScreen";
import RegistrationScreen from "./screens/auth/RegistrationScreen";

import PostsScreen from "./screens/main/PostsScreen";
import CreatePostsScreen from "./screens/main/CreatePostsScreen";
import ProfileScreen from "./screens/main/ProfileScreen";

import SvgGrid from "./assets/icon/grid.svg";
import SvgNew from "./assets/icon/new.svg";
import SvgUser from "./assets/icon/user.svg";
import SvgLogout from "./assets/icon/log-out.svg";

import { TouchableOpacity } from "react-native";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Register"
          component={RegistrationScreen}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <MainTab.Navigator
      screenOptions={{
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
            <TouchableOpacity style={{ marginHorizontal: 16 }}>
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
          tabBarIcon: ({ color }) => (
            <SvgUser width={40} height={40} style={{ color }} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};
