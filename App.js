import React, { createContext, useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./StackNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "./StackNavigator";
import { EventRegister } from "react-native-event-listeners";
import theme from "./theme/theme";
import themeContext from "./theme/themeContext";


const handleErrorResponse = async (error) => {
  if (error.response && error.response.status === 401) {
    // Token expired, navigate to login screen
    await AsyncStorage.removeItem("token"); // Clear token from storage
    await AsyncStorage.removeItem("expirationDate"); // Clear expiration date
    navigate("Login"); // Navigate to the login screen
  }
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const listener = EventRegister.addEventListener("Change Theme", (data) => {
      setDarkMode(data);
    });
    return () => {
      EventRegister.removeAllListeners(listener);
    };
  }, [darkMode]);

  return (
    // <>
    //   <Navigation/>
    // </>
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
      <>
        <Navigation />
      </>
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
