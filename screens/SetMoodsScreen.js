import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Fonts, Colors, Spacing } from "../config/index.js";
import {
  ArrowLeftRegular,
  QuestionCircleRegular,
} from "@fluentui/react-native-icons";
import { Linking, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const SetMoodsScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState([]);

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

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: 150,
          borderBottomWidth: 1,
          borderBottomColor: Colors.stroke,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 76,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            marginRight: 12,
          }}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftRegular color="rgba(0, 0, 0, 0.4)" width={20} />
        </Pressable>
        <Text
          style={{
            fontFamily: Fonts.screenTitle.fontFamily,
            fontSize: Fonts.screenTitle.fontSize,
            color: Colors.screenTitle,
          }}
        >
          Playlist Generator
        </Text>
      </View>

      <View
        style={{
          backgroundColor: Colors.tooltipFill,
          marginLeft: 24,
          marginRight: 24,
          marginTop: 20,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 10,
          paddingBottom: 10,
          borderWidth: 1,
          borderColor: Colors.tooltipStroke,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <QuestionCircleRegular color={Colors.iconTooltip} width={20} />
        <Text
          style={{
            fontFamily: Fonts.tooltip.fontFamily,
            fontSize: Fonts.tooltip.fontSize,
            color: Colors.textTooltip,
            marginLeft: 10,
            flexWrap: "wrap",
          }}
        >
          Sonorama analyzes your Spotify profile to give you personalized
          playlists catered to your tastes.
        </Text>
      </View>

      <View
        style={{
          marginTop: 30,
          marginLeft: 24,
          marginRight: 24,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.sectionTitle.fontFamily,
            fontSize: Fonts.sectionTitle.fontSize,
          }}
        >
          What moods do you want to have in this playlist?
        </Text>
        <Text
          style={{
            fontFamily: Fonts.cardParagraph.fontFamily,
            fontSize: Fonts.cardParagraph.fontSize,
            color: Colors.textSecondary,
            marginTop: 8,
          }}
        >
          Select up to five moods.
        </Text>
      </View>

      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
          marginTop: 20,
          height: 160,
        }}
      >
        <Image
          source={require("../assets/img/no-playlists.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        ></Image>
      </View>
    </View>
  );
};

export default SetMoodsScreen;
const styles = StyleSheet.create({});