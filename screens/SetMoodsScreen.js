import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Fonts } from "../config/index.js";
import {
  ArrowLeftRegular,
  ArrowRightRegular,
  QuestionCircleRegular,
} from "@fluentui/react-native-icons";
import { Linking, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import themeContext from "../theme/themeContext.js";
import theme from "../theme/theme.js";

const SetMoodsScreen = ({ navigation }) => {
  const theme = useContext(themeContext);

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

  const [selectedMoods, setSelectedMoods] = useState([]);

  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((item) => item !== mood));
    } else {
      if (selectedMoods.length < 5) {
        setSelectedMoods([...selectedMoods, mood]);
      } else {
        // You can display a message or handle the case where the user tries to select more than 5 moods
      }
    }
  };

  const renderButton = (mood) => {
    const isSelected = selectedMoods.includes(mood);
    return (
      <Pressable
        key={mood}
        style={[
          isSelected
            ? {
                backgroundColor: theme.optionSelectedFill,
                marginRight: 6,
                marginBottom: 6,
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,
                borderWidth: 1,
                borderColor: theme.optionSelectedStroke,
                borderRadius: 8,
                fontFamily: Fonts.baseFont.fontFamily,
                fontSize: Fonts.baseFont.fontSize,
                color: theme.optionSelectedText,
              }
            : {
                backgroundColor: theme.optionDisabledFill,
                marginRight: 6,
                marginBottom: 6,
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,
                borderWidth: 1,
                borderColor: theme.optionDisabledStroke,
                borderRadius: 8,
                fontFamily: Fonts.baseFont.fontFamily,
                fontSize: Fonts.baseFont.fontSize,
                color: theme.optionDisabledText,
              },
        ]}
        onPress={() => toggleMood(mood)}
      >
        <Text
          style={[
            isSelected
              ? {
                  fontFamily: Fonts.baseFont.fontFamily,
                  color: theme.optionSelectedText,
                }
              : {
                  fontFamily: Fonts.baseFont.fontFamily,
                  color: theme.optionDisabledText,
                },
          ]}
        >
          {mood}
        </Text>
      </Pressable>
    );
  };

  useEffect(() => {
    console.log("Selected Moods:", selectedMoods);
  }, [selectedMoods]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          height: 150,
          borderBottomWidth: 1,
          borderBottomColor: theme.stroke,
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
          <ArrowLeftRegular color={theme.textSecondary} width={20} />
        </Pressable>
        <Text
          style={{
            fontFamily: Fonts.screenTitle.fontFamily,
            fontSize: Fonts.screenTitle.fontSize,
            color: theme.textDefault,
          }}
        >
          Playlist Generator
        </Text>
      </View>

      <View
        style={{
          backgroundColor: theme.tooltipFill,
          marginLeft: 24,
          marginRight: 24,
          marginTop: 20,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 10,
          paddingBottom: 10,
          borderWidth: 1,
          borderColor: theme.tooltipStroke,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <QuestionCircleRegular color={theme.iconTooltip} width={20} />
        <Text
          style={{
            fontFamily: Fonts.tooltip.fontFamily,
            fontSize: Fonts.tooltip.fontSize,
            color: theme.textTooltip,
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
            color: theme.textDefault,
          }}
        >
          What moods do you want to have in this playlist?
        </Text>
        <Text
          style={{
            fontFamily: Fonts.cardParagraph.fontFamily,
            fontSize: Fonts.cardParagraph.fontSize,
            color: theme.textSecondary,
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
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/img/generate-playlist.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        ></Image>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 34,
          marginLeft: 24,
          marginRight: 24,
        }}
      >
        {renderButton("Melancholic")}
        {renderButton("Acoustic")}
        {renderButton("Energetic")}
        {renderButton("Triumphant")}
        {renderButton("Soothing")}
        {renderButton("Chill")}
        {renderButton("Feel-good")}
        {renderButton("Instrumental")}
      </View>

      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
          marginTop: 34,
        }}
      >
        <Pressable
          onPress={() => {
            navigation.navigate("SetGenres", { selectedMoods: selectedMoods });
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: theme.buttonMainFill,
            borderColor: theme.buttonMainStroke,
            borderRadius: 10,
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: Fonts.button.fontFamily,
              fontSize: Fonts.button.fontSize,
              marginRight: 4,
            }}
          >
            Continue
          </Text>
          <ArrowRightRegular width={16} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default SetMoodsScreen;
const styles = StyleSheet.create({});
