import { StyleSheet, Text, SafeAreaView, View, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useContext, useState } from "react";
import { useFonts } from "expo-font";
import { Fonts } from "../config/index.js";
import * as AppAuth from "expo-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import themeContext from "../theme/themeContext.js";
import langContext from "../lang/langContext.js";

const LoginScreen = () => {
  const theme = useContext(themeContext);
  const lang = useContext(langContext)
  const navigation = useNavigation();
  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const expirationDate = await AsyncStorage.getItem("expirationDate");
      console.log("access token: ", accessToken);
      console.log("exp date:", expirationDate);

      if (accessToken && expirationDate) {
        const currentTime = Date.now();
        if (currentTime < parseInt(expirationDate)) {
          navigation.replace("Main");
        } else {
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("expirationDate");
          navigation.replace('Login');
        }
      }
    };

    checkTokenValidity();
  }, []);
  async function authenticate() {
    try {
      const config = {
        issuer: "https://accounts.spotify.com",
        clientId: "d066443124f9494da844adfb2b3516c3",
        scopes: [
          "user-read-email",
          "user-library-read",
          "user-read-recently-played",
          "user-top-read",
          "playlist-read-private",
          "playlist-read-collaborative",
          "playlist-modify-public",
          "playlist-modify-private",
        ],
        redirectUrl: "exp://localhost:19002/--/spotify-auth-callback",
      };
      const result = await AppAuth.authAsync(config);
      console.log(result);
  
      if (result.accessToken) {
        const expirationDate = new Date(
          result.accessTokenExpirationDate
        ).getTime();
        AsyncStorage.setItem("token", result.accessToken);
        AsyncStorage.setItem("expirationDate", expirationDate.toString());
        navigation.navigate("Main");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }

  const [fontsLoaded] = useFonts({
    ProximaNovaRegular: require("../assets/fonts/ProximaNovaRegular.otf"),
    ProximaNovaSemibold: require("../assets/fonts/ProximaNovaSemibold.otf"),
  });

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.background,
        flex: 1,
      }}
    >
      <View style={{ justifyContent: "center", marginTop: 124, height: 200 }}>
        <Image
          source={require("../assets/img/sonorama-logo.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        />
      </View>

      <Text
        style={{
          color: theme.textDefault,
          fontSize: Fonts.screenTitle.fontSize,
          fontWeight: Fonts.screenTitle.fontWeight,
          fontFamily: Fonts.screenTitle.fontFamily,
          marginTop: 56,
          textAlign: "center",
        }}
      >
        {lang.loginTitle}
      </Text>

      <Text
        style={{
          color: theme.textSecondary,
          fontSize: Fonts.cardParagraph.fontSize,
          textAlign: "center",
          marginTop: 16,
          marginLeft: 36,
          marginRight: 36,
        }}
      >
        {lang.loginParagraph}
      </Text>

      <View style={{ marginTop: 178 }} />
      <Pressable
        onPress={authenticate}
        style={{
          backgroundColor: theme.spotifyButtonFill,
          borderColor: theme.spotifyButtonStroke,
          borderWidth: 1,
          textAlign: "center",
          fontFamily: Fonts.spotifyButton.fontFamily,
          fontSize: Fonts.spotifyButton.fontSize,
          paddingTop: 12,
          paddingBottom: 12,
          marginLeft: "auto",
          marginRight: "auto",
          width: 300,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Entypo
          style={{ textAlign: "center" }}
          name="spotify"
          size={24}
          color="white"
        />
        <Text
          style={{
            color: "white",
            fontFamily: Fonts.spotifyButton.fontFamily,
            marginLeft: 10,
          }}
        >
          {lang.loginButton}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({});
