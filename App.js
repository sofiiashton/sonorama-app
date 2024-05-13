import React, { createContext, useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./StackNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "./StackNavigator";
import { EventRegister } from "react-native-event-listeners";
import theme from "./theme/theme";
import themeContext from "./theme/themeContext";
import lang from "./lang/lang";
import langContext from "./lang/langContext";

const handleErrorResponse = async (error) => {
  if (error.response && error.response.status === 401) {
    // Token expired, navigate to login screen
    await AsyncStorage.removeItem("token"); // Clear token from storage
    await AsyncStorage.removeItem("expirationDate"); // Clear expiration date
    navigate("Login"); // Navigate to the login screen
  }
};

export default function App() {
  const [fontsLoaded] = useFonts({
    ProximaNovaRegular: require("./assets/fonts/ProximaNovaRegular.otf"),
    ProximaNovaSemibold: require("./assets/fonts/ProximaNovaSemibold.otf"),
  });

  const [darkMode, setDarkMode] = useState(false);
  const [eng, setEng] = useState(false);

  useEffect(() => {
    const themeListener = EventRegister.addEventListener("Change Theme", (data) => {
      setDarkMode(data);
    });
    const langListener = EventRegister.addEventListener("Change Language", (data) => {
      setEng(data);
    });
    return () => {
      EventRegister.removeEventListener(themeListener);
      EventRegister.removeEventListener(langListener);
    };
  }, []);
  

  return (
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
      <langContext.Provider value={eng === true ? lang.en : lang.uk}>
        <>
          <Navigation />
        </>
      </langContext.Provider>
    </themeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

  // useEffect(() => {
  //   const listenerDarkMode = EventRegister.addEventListener("Change Theme", (data) => {
  //     setDarkMode(data);
  //   });
  //   return () => {
  //     EventRegister.removeAllListeners(listenerDarkMode);
  //   };
  // }, [darkMode]);

  // useEffect(() => {
  //   const listenerLang = EventRegister.addEventListener("Change Language", (data) => {
  //       setEng(data);
  //     }
  //   );
  //   return () => {
  //     EventRegister.removeAllListeners(listenerLang);
  //   };
  // }, [eng]);