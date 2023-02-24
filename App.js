// import { useState, useEffect, useCallback } from "react";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";

import RegistrationScreen from "./screens/auth/RegistrationScreen";

// SplashScreen.preventAutoHideAsync();

export default function App() {
  // const [appIsReady, setAppIsReady] = useState(false);

  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       await Font.loadAsync({
  //         "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  //         "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  //         "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  //       });
  //       await new Promise((resolve) => setTimeout(resolve, 2000));
  //     } catch (e) {
  //       console.warn(e);
  //     } finally {
  //       setAppIsReady(true);
  //     }
  //   }
  //   prepare();
  // }, []);

  // const onLayoutRootView = useCallback(async () => {
  //   if (appIsReady) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [appIsReady]);

  // if (!appIsReady) {
  //   return null;
  // }

  // return <View style={styles.container} onLayout={onLayoutRootView}></View>;

  return (
    <>
      <RegistrationScreen />
    </>
  );
}
