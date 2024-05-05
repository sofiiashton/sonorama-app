import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    Linking,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { Fonts, Colors } from "../config/index.js";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import {
    ArrowLeftRegular,
    ArrowRightRegular,
    QuestionCircleRegular,
  } from "@fluentui/react-native-icons";
  import { Picker } from "@react-native-picker/picker";
  
  const SetGenresScreen = ({ navigation, route }) => {
    const { selectedMoods } = route.params;

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
  
    const [selectedGenres, setSelectedGenres] = useState([]);
  
    const toggleGenre = (genre) => {
      if (selectedGenres.includes(genre)) {
        setSelectedGenres(selectedGenres.filter((item) => item !== genre));
      } else {
        if (selectedGenres.length < 5) {
            setSelectedGenres([...selectedGenres, genre]);
        } else {
            // to-do
        }
      }
    };
  
    const renderButton = (genre) => {
      const isSelected = selectedGenres.includes(genre);
      return (
        <Pressable
          key={genre}
          style={[isSelected ? styles.selectedGenre : styles.unselectedGenre]}
          onPress={() => toggleGenre(genre)}
        >
          <Text style={[isSelected ? {
            fontFamily: Fonts.baseFont.fontFamily,
            color: Colors.optionSelectedText,
          } : {
            fontFamily: Fonts.baseFont.fontFamily,
            color: Colors.optionDisabledText,
          }]}>{genre}</Text>
        </Pressable>
      );
    };
  
    useEffect(() => {
      console.log("Selected Genres:", selectedGenres);
    }, [selectedGenres]);
  
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
            What genres do you want to have in this playlist?
          </Text>
          <Text
            style={{
              fontFamily: Fonts.cardParagraph.fontFamily,
              fontSize: Fonts.cardParagraph.fontSize,
              color: Colors.textSecondary,
              marginTop: 8,
            }}
          >
            Select up to five genres.
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
          {renderButton("Alternative")}
          {renderButton("Pop")}
          {renderButton("Hip-Hop")}
          {renderButton("R&B")}
          {renderButton("Rock")}
          {renderButton("Electronic")}
          {renderButton("Trip-hop")}
          {renderButton("Art pop")}
          {renderButton("Jazz")}
          {renderButton("Soul")}
          {renderButton("Classical")}
        </View>
  
        <View
          style={{
            marginLeft: 24,
            marginRight: 24,
            marginTop: 38,
          }}
        >
          <Pressable
            onPress={() => {
              navigation.navigate('SetPlaylistSettings', { selectedGenres: selectedGenres , selectedMoods: selectedMoods});
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: Colors.buttonMainFill,
              borderColor: Colors.buttonMainStroke,
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
  
  export default SetGenresScreen;
  const styles = StyleSheet.create({
    selectedGenre: {
      backgroundColor: Colors.optionSelectedFill,
      marginRight: 6,
      marginBottom: 6,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 1,
      borderColor: Colors.optionSelectedStroke,
      borderRadius: 8,
      fontFamily: Fonts.baseFont.fontFamily,
      fontSize: Fonts.baseFont.fontSize,
      color: Colors.optionSelectedText,
    },
    unselectedGenre: {
      backgroundColor: Colors.optionDisabledFill,
      marginRight: 6,
      marginBottom: 6,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 1,
      borderColor: Colors.optionDisabledStroke,
      borderRadius: 8,
      fontFamily: Fonts.baseFont.fontFamily,
      fontSize: Fonts.baseFont.fontSize,
      color: Colors.optionDisabledText,
    },
  });
  