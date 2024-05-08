import { StyleSheet, Text, SafeAreaView, View, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Fonts, Colors, Spacing } from "../config/index.js";
import * as AppAuth from "expo-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";

const LoginScreen = () => {
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
          // token is still valid
          navigation.replace("Main");
        } else {
          // token is expired, remove it from async storage
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("expirationDate");
          navigation.replace('Login');
        }
      }
    };

    checkTokenValidity();
  }, []);
  async function authenticate() {
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
  }

  const [fontsLoaded] = useFonts({
    ProximaNovaRegular: require("../assets/fonts/ProximaNovaRegular.otf"),
    ProximaNovaSemibold: require("../assets/fonts/ProximaNovaSemibold.otf"),
  });

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
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
          color: Colors.textDefault,
          fontSize: Fonts.screenTitle.fontSize,
          fontWeight: Fonts.screenTitle.fontWeight,
          fontFamily: Fonts.screenTitle.fontFamily,
          marginTop: 56,
          textAlign: "center",
        }}
      >
        Welcome to Sonorama!
      </Text>

      <Text
        style={{
          color: Colors.textSecondary,
          fontSize: Fonts.cardParagraph.fontSize,
          textAlign: "center",
          marginTop: 16,
          marginLeft: 36,
          marginRight: 36,
        }}
      >
        An application for discovering music and generating playlists catered to
        your mood and tastes.
      </Text>

      <View style={{ marginTop: 178 }} />
      <Pressable
        onPress={authenticate}
        style={{
          backgroundColor: Colors.spotifyButtonFill,
          borderColor: Colors.spotifyButtonStroke,
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
          Sign in with Spotify
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({});
