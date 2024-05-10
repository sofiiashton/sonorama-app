import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Fonts } from "../config/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  OpenRegular,
  GlobeRegular,
  ColorRegular,
} from "@fluentui/react-native-icons";
import SwitchToggle from "react-native-switch-toggle";

import { EventRegister } from "react-native-event-listeners";
import themeContext from "../theme/themeContext.js";
import langContext from "../lang/langContext.js";
import DropDownPicker from "react-native-dropdown-picker";

const SettingsScreen = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [darkMode, setDarkMode] = useState(false);

  const lang = useContext(langContext);
  const [eng, setEng] = useState(false);

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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("Login");
    } catch (err) {
      console.log(err.message);
    }
  };

  const username = userProfile ? userProfile.display_name : "";
  const userEmail = userProfile ? userProfile.email : "";
  const profilePicture = userProfile ? userProfile.images[0]?.url : null;
  const userId = userProfile ? userProfile.id.toString() : "";

  const openInSpotify = () => {
    const spotifyDeepLink = `https://open.spotify.com/user/${userId}`;

    Linking.openURL(spotifyDeepLink).catch((err) =>
      console.error("Failed to open link:", err)
    );
  };

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor:
        //   theme === "light" ? theme.background : themeDark.background,
        backgroundColor: theme.background,
      }}
    >
      <View
        style={{
          height: 150,
          borderBottomWidth: 1,
          borderBottomColor: theme.stroke,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 94,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.screenTitle.fontFamily,
            fontSize: Fonts.screenTitle.fontSize,
            color: theme.textDefault,
          }}
        >
          {lang.settingsTitle}
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
            color: theme.textDefault,
          }}
        >
          {lang.connectedAccount}
        </Text>
        <View
          style={{
            height: 134,
            borderWidth: 1,
            borderColor: theme.stroke,
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
              style={{
                fontFamily: Fonts.baseFont.fontFamily,
                fontSize: 18,
                color: theme.textDefault,
              }}
            >
              {username}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.cardParagraph.fontFamily,
                fontSize: Fonts.cardParagraph.fontSize,
                color: theme.textSecondary,
                marginTop: 4,
              }}
            >
              {userEmail}
            </Text>
            <Pressable
              style={{
                backgroundColor: theme.openInSpotifyFill,
                borderColor: theme.openInSpotifyStroke,
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
              onPress={openInSpotify}
            >
              <OpenRegular color={theme.textSeeAll} width={17} />
              <Text
                style={{
                  fontFamily: Fonts.openInSpotify.fontFamily,
                  fontSize: Fonts.openInSpotify.fontSize,
                  marginLeft: 6,
                  color: theme.openInSpotifyText,
                }}
              >
                {lang.openInSpotify}
              </Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={{
            backgroundColor: theme.logOutFill,
            borderColor: theme.logOutStroke,
            borderWidth: 1,
            borderRadius: 10,
            width: 342,
            paddingTop: 12,
            paddingBottom: 12,
            marginTop: 18,
          }}
          onPress={handleLogout}
        >
          <Text
            style={{
              fontFamily: Fonts.button.fontFamily,
              fontSize: Fonts.button.fontSize,
              color: theme.logOutText,
              alignSelf: "center",
            }}
          >
            {lang.logOut}
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
            color: theme.textDefault,
          }}
        >
          {lang.applicationSettings}
        </Text>

        <View
          style={{
            marginTop: 30,
          }}
        >
          <View
            style={{
              borderBottomColor: theme.stroke,
              borderBottomWidth: 1,
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <GlobeRegular color={theme.settingsIcons} width={20} />
                <Text
                  style={{
                    fontFamily: Fonts.cardTitle.fontFamily,
                    fontSize: Fonts.cardTitle.fontSize,
                    marginLeft: 12,
                    color: theme.textDefault,
                  }}
                >
                  {lang.language}
                </Text>
              </View>

              <View>
                <Pressable style={{
                  backgroundColor: theme.optionDisabledFill,
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: theme.optionDisabledStroke,
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  overflow: 'hidden',
                }}>
                  <Text
                    onPress={() => {
                      setEng(!eng);
                      EventRegister.emit("Change Language", !eng);
                    }}
                    style={{
                      fontFamily: Fonts.button.fontFamily,
                      fontSize: Fonts.button.fontSize,
                      color: theme.textDefault,
                    }}
                  >
                    {lang.changeLanguage}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View>
            <View
              style={{
                justifyContent: "space-between",
                marginTop: 16,
                marginBottom: 16,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <ColorRegular color={theme.settingsIcons} width={20} />
                <Text
                  style={{
                    fontFamily: Fonts.cardTitle.fontFamily,
                    fontSize: Fonts.cardTitle.fontSize,
                    marginLeft: 12,
                    color: theme.textDefault,
                  }}
                >
                  {lang.darkMode}
                </Text>
              </View>

              <View>
                <SwitchToggle
                  containerStyle={{
                    width: 45,
                    height: 24,
                    borderRadius: 25,
                    padding: 4,
                    marginRight: 2,
                  }}
                  circleStyle={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: "white",
                  }}
                  switchOn={darkMode}
                  onPress={() => {
                    setDarkMode(!darkMode);
                    EventRegister.emit("Change Theme", !darkMode);
                  }}
                  backgroundColorOn={theme.buttonMainFill}
                  backgroundColorOff={theme.tooltipText}
                  circleColorOff="white"
                  circleColorOn="white"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;
