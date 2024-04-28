import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Fonts, Colors } from "../config/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OpenRegular } from "@fluentui/react-native-icons";

const SettingsScreen = () => {
  const [userProfile, setUserProfile] = useState(null);

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
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const username = userProfile ? userProfile.display_name : "";
  const userEmail = userProfile ? userProfile.email : "";
  const profilePicture = userProfile ? userProfile.images[0]?.url : null;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: 150,
          borderBottomWidth: 1,
          borderBottomColor: Colors.stroke,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 94,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.screenTitle.fontFamily,
            fontSize: Fonts.screenTitle.fontSize,
            color: Colors.screenTitle,
          }}
        >
          Settings
        </Text>
      </View>

      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
          marginTop: 30,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.sectionTitle.fontFamily,
            fontSize: Fonts.sectionTitle.fontSize,
            marginBottom: 24,
          }}
        >
          Connected account
        </Text>
        <View
          style={{
            height: 134,
            borderWidth: 1,
            borderColor: Colors.stroke,
            borderRadius: 20,
            flexDirection: "row",
          }}
        >
          {profilePicture && (
            <View
              style={{
                alignItems: "center",
                paddingBottom: 16,
                paddingTop: 16,
                paddingLeft: 24,
                paddingRight: 24,
              }}
            >
              <Image
                source={{ uri: profilePicture }}
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 50,
                }}
              />
            </View>
          )}
          <View style={{ paddingTop: 16 }}>
            <Text
              style={{ fontFamily: Fonts.baseFont.fontFamily, fontSize: 18 }}
            >
              {username}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.cardParagraph.fontFamily,
                fontSize: Fonts.cardParagraph.fontSize,
                color: Colors.textSecondary,
                marginTop: 4,
              }}
            >
              {userEmail}
            </Text>
            <Pressable
              style={{
                backgroundColor: Colors.openInSpotifyFill,
                borderColor: Colors.openInSpotifyStroke,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 12,
                paddingRight: 12,
                marginTop: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <OpenRegular color={Colors.textSeeAll} width={17} />
              <Text
                style={{
                  fontFamily: Fonts.openInSpotify.fontFamily,
                  fontSize: Fonts.openInSpotify.fontSize,
                  marginLeft: 6,
                  color: "rgba(0, 0, 0, 0.8)",
                }}
              >
                Open in Spotify
              </Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={{
            backgroundColor: Colors.logOutFill,
            borderColor: Colors.logOutStroke,
            borderWidth: 1,
            borderRadius: 10,
            width: 342,
            paddingTop: 12,
            paddingBottom: 12,
            marginTop: 18,
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.button.fontFamily,
              fontSize: Fonts.button.fontSize,
              color: Colors.logOutText,
              alignSelf: "center",
            }}
          >
            Log out
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
          marginTop: 42,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.sectionTitle.fontFamily,
            fontSize: Fonts.sectionTitle.fontSize,
          }}
        >
          Application Settings
        </Text>
      </View>
    </View>
  );
};

export default SettingsScreen;
