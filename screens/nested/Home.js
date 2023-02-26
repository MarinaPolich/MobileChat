import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CommentsScreen from "./CommentsScreen";
import MapScreen from "./MapScreen";
import TabNavigation from "../../components/TabNavigation";

const NestedScreen = createStackNavigator();

const Home = () => {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        options={{
          headerShown: false,
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
        name="Home"
        component={TabNavigation}
      />
      <NestedScreen.Screen
        options={{
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
        name="Комментарии"
        component={CommentsScreen}
      />
      <NestedScreen.Screen
        options={{
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
        name="Карта"
        component={MapScreen}
      />
    </NestedScreen.Navigator>
  );
};

export default Home;
