import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Linking,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Fonts } from "../config/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DismissRegular } from "@fluentui/react-native-icons";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-virtualized-view";
import themeContext from "../theme/themeContext.js";

const PlaylistCreatedScreen = ({ navigation, route }) => {
  const theme = useContext(themeContext);

  const playlistId = route.params.playlistId;

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

  const [playlistDetails, setPlaylistDetails] = useState(null);

  const fetchPlaylistDetails = async (playlistId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch playlist details");
      }

      const data = await response.json();
      setPlaylistDetails(data);
    } catch (error) {
      console.error("Error fetching playlist details:", error.message);
    }
  };

  useEffect(() => {
    const playlistId = route.params.playlistId;
    fetchPlaylistDetails(playlistId);
  }, []);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const renderTrack = (track, index) => {
    const formattedDuration = formatDuration(track.duration_ms);

    return (
      <View
        key={index}
        style={{
          marginBottom: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Image
            source={{ uri: track.album.images[0].url }}
            style={{
              width: 40,
              height: 40,
              borderWidth: 1,
              borderColor: theme.stroke,
              borderRadius: 4,
            }}
          />
          <View
            style={{
              marginLeft: 14,
              flex: 1,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: Fonts.trackTitle.fontFamily,
                fontSize: Fonts.trackTitle.fontSize,
                flex: 1,
                color: theme.textDefault,
              }}
            >
              {track.name}
            </Text>

            <Text
              style={{
                fontFamily: Fonts.trackArtist.fontFamily,
                fontSize: Fonts.trackArtist.fontSize,
                color: theme.textSecondary,
                marginTop: 2,
              }}
            >
              {track.artists.map((artist) => artist.name).join(", ")}
            </Text>
          </View>
        </View>

        <View
          style={{
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.trackArtist.fontFamily,
              fontSize: Fonts.trackArtist.fontSize,
              color: theme.textSecondary,
            }}
          >
            {formattedDuration}
          </Text>
        </View>
      </View>
    );
  };

  const openPlaylistInSpotify = () => {
    if (playlistDetails) {
      const playlistID = playlistDetails.id;
      const spotifyDeepLink = `https://open.spotify.com/playlist/${playlistID}`;
      Linking.openURL(spotifyDeepLink).catch((err) =>
        console.error("Failed to open link:", err)
      );
    }
  };

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
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.screenTitle.fontFamily,
            fontSize: Fonts.screenTitle.fontSize,
            color: theme.textDefault,
          }}
        >
          Your playlist
        </Text>
        <Pressable
          style={{
            marginRight: 12,
          }}
          onPress={() => navigation.navigate("Home")}
        >
          <DismissRegular color={theme.textSecondary} width={24} />
        </Pressable>
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
            color: theme.textDefault,
          }}
        >
          Playlist created!
        </Text>

        {playlistDetails ? (
          <View>
            <Text
              style={{
                fontFamily: Fonts.cardParagraph.fontFamily,
                fontSize: Fonts.cardParagraph.fontSize,
                color: theme.textSecondary,
                marginTop: 8,
              }}
            >
              You can now access '{playlistDetails.name}' on Spotify.
            </Text>
            <View
              style={{
                height: 430,
              }}
            >
              <ScrollView
                style={{
                  marginTop: 20,
                  height: 424,
                  borderWidth: 1,
                  borderColor: theme.stroke,
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                {playlistDetails.tracks.items.map((item, index) =>
                  renderTrack(item.track, index)
                )}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Text
            style={{
              fontFamily: Fonts.cardParagraph.fontFamily,
              fontSize: Fonts.cardParagraph.fontSize,
              color: theme.textSecondary,
              marginTop: 8,
            }}
          >
            Loading playlist details...
          </Text>
        )}
      </View>

      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
          marginTop: 42,
        }}
      >
        <Pressable
          onPress={() => navigation.navigate("Home")}
          style={{
            height: 48,
            backgroundColor: theme.buttonSecondaryFill,
            borderWidth: 1,
            borderColor: theme.buttonSecondaryStroke,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.button.fontFamily,
              fontSize: Fonts.button.fontSize,
              color: theme.buttonSecondaryText,
            }}
          >
            Go back to Home
          </Text>
        </Pressable>

        <View
          style={{
            height: 10,
          }}
        ></View>

        <Pressable
          onPress={openPlaylistInSpotify}
          style={{
            height: 48,
            backgroundColor: theme.buttonMainFill,
            borderWidth: 1,
            borderColor: theme.buttonMainStroke,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.button.fontFamily,
              fontSize: Fonts.button.fontSize,
              color: theme.buttonMainText,
            }}
          >
            Open in Spotify
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PlaylistCreatedScreen;
const styles = StyleSheet.create({});
