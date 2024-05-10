import { StyleSheet, Text, SafeAreaView, View, ScrollView } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fonts } from "../config/index.js";
import { Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import themeContext from "../theme/themeContext.js";
import langContext from "../lang/langContext.js";

const HomeScreen = () => { 
  const theme = useContext(themeContext);
  const lang = useContext(langContext);

  const navigation = useNavigation();

  const [userProfile, setUserProfile] = useState([]);

  const greetingMsg = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return lang.goodMorning;
    } else if (currentTime < 17) {
      return lang.goodAfternoon;
    } else {
      return lang.goodEvening;
    }
  };
  const message = greetingMsg();

  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const username = userProfile["display_name"];

  console.log(userProfile);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          height: 150,
          borderBottomWidth: 1,
          borderBottomColor: theme.stroke,
          paddingBottom: 24,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 70,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.screenTitleSecondary.fontFamily,
            fontSize: Fonts.screenTitleSecondary.fontSize,
            color: theme.textGreeting,
          }}
        >
          {message}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.screenTitle.fontFamily,
            fontSize: Fonts.screenTitle.fontSize,
            color: theme.textDefault,
          }}
        >
          {username}
        </Text>
      </View>

      <View
        style={{
          height: 30,
        }}
      />

      <View
        style={{
          backgroundColor: theme.blueCardBackground,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: theme.blueCardStroke,
          marginLeft: 24,
          marginRight: 24,
        }}
      >
        <Pressable onPress={() => navigation.navigate("ForYou")}>
          <View
            style={{
              height: 160,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
              source={require("../assets/img/for-you.png")}
            />
          </View>

          <View
            style={{
              borderTopColor: theme.stroke,
              borderTopWidth: 1,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.cardTitle.fontFamily,
                fontSize: Fonts.cardTitle.fontSize,
                color: theme.textDefault,
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: 16,
              }}
            >
              {lang.homeForYouTitle}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.cardParagraph.fontFamily,
                fontSize: Fonts.cardParagraph.fontSize,
                color: theme.textSecondary,
                marginTop: 6,
                marginBottom: 20,
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              {lang.homeForYouParagraph}
            </Text>
          </View>
        </Pressable>
      </View>

      <View
        style={{
          height: 24,
        }}
      />

      <View
        style={{
          backgroundColor: theme.cardBackground,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: theme.cardStroke,
          marginLeft: 24,
          marginRight: 24,
        }}
      >
        <Pressable>
          <View
            style={{
              height: 160,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
              source={require("../assets/img/playlist-generator.png")}
            />
          </View>

          <View>
            <Text
              style={{
                fontFamily: Fonts.cardTitle.fontFamily,
                fontSize: Fonts.cardTitle.fontSize,
                color: theme.textDefault,
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              {lang.homePlaylistGeneratorTitle}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.cardParagraph.fontFamily,
                fontSize: Fonts.cardParagraph.fontSize,
                color: theme.textSecondary,
                marginTop: 6,
                marginBottom: 20,
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              {lang.homePlaylistGeneratorParagraph}
            </Text>
            <Pressable
              style={{
                backgroundColor: theme.buttonMainFill,
                borderColor: theme.buttonMainStroke,
                borderWidth: 1,
                textAlign: "center",
                fontFamily: Fonts.button.fontFamily,
                fontSize: Fonts.button.fontSize,
                paddingTop: 12,
                paddingBottom: 12,
                marginLeft: "auto",
                marginRight: "auto",
                width: 300,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 26,
              }}
              onPress={() => navigation.navigate("SetMoods")}
            >
              <Text
                style={{
                  fontFamily: Fonts.button.fontFamily,
                  fontSize: Fonts.button.fontSize,
                  color: theme.buttonMainText,
                }}
              >
                {lang.homeStartGenerating}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({});
