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
import { ArrowLeftRegular } from "@fluentui/react-native-icons";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-virtualized-view";

const ForYouScreen = ({ navigation, route }) => {
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

  const [recommendations, setRecommendations] = useState(null);

  const fetchTopArtists = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/artists?limit=5",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch top artists");
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error("Error fetching top artists:", error.message);
      return [];
    }
  };

  const fetchRecommendations = async (topArtists) => {
    try {
      const artistIds = topArtists.map((artist) => artist.id).join(",");
      const accessToken = await AsyncStorage.getItem("token");
      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?seed_artists=${artistIds}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data.tracks);
    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
      setRecommendations([]);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
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

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const topArtists = await fetchTopArtists();
      if (topArtists.length > 0) {
        fetchRecommendations(topArtists);
      }
    };

    fetchData();
  }, []);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const openPlaylistInSpotify = (playlistId) => {
    const spotifyDeepLink = `https://open.spotify.com/playlist/${playlistId}`;
    Linking.openURL(spotifyDeepLink).catch((err) =>
      console.error("Failed to open link:", err)
    );
  };

  const [loading, setLoading] = useState(false);

  const createPlaylistInSpotify = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("token");

      const createPlaylistResponse = await fetch(
        "https://api.spotify.com/v1/me/playlists",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "For You Mix",
            description: "Created by Sonorama",
            public: true,
          }),
        }
      );

      if (!createPlaylistResponse.ok) {
        throw new Error("Failed to create playlist");
      }

      const playlistData = await createPlaylistResponse.json();
      const playlistId = playlistData.id;

      const trackUris = recommendations.map((track) => track.uri);
      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: trackUris,
          }),
        }
      );

      if (!addTracksResponse.ok) {
        throw new Error("Failed to add tracks to playlist");
      }

      openPlaylistInSpotify(playlistId);
    } catch (error) {
      console.error("Error creating playlist:", error.message);
      alert("Failed to create playlist. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
          For you
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
          Here are some recommendations based on your recent activity
        </Text>

        <Text
          style={{
            fontFamily: Fonts.cardParagraph.fontFamily,
            fontSize: Fonts.cardParagraph.fontSize,
            color: Colors.textSecondary,
            marginTop: 8,
          }}
        >
          Save them into a playlist to access them at any time.
        </Text>
      </View>

      <View
        style={{
          height: 422,
        }}
      >
        {recommendations ? (
          <ScrollView
            style={{
              marginTop: 24,
              height: 422,
              borderWidth: 1,
              borderColor: Colors.stroke,
              borderRadius: 10,
              padding: 20,
              marginLeft: 24,
              marginRight: 24,
            }}
          >
            {recommendations.map((track, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Image
                  source={{ uri: track.album.images[0].url }}
                  style={{
                    width: 40,
                    height: 40,
                    borderWidth: 1,
                    borderColor: Colors.stroke,
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
                    style={{
                      fontFamily: Fonts.trackTitle.fontFamily,
                      fontSize: Fonts.trackTitle.fontSize,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {track.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.trackArtist.fontFamily,
                      fontSize: Fonts.trackArtist.fontSize,
                      color: Colors.textSecondary,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </Text>
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
                      color: Colors.textSecondary,
                      marginLeft: 14,
                    }}
                  >
                    {formatDuration(track.duration_ms)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text
            style={{
              fontFamily: Fonts.cardParagraph.fontFamily,
              fontSize: Fonts.cardParagraph.fontSize,
              color: Colors.textSecondary,
              marginTop: 8,
              marginLeft: 24,
            }}
          >
            Loading recommendations...
          </Text>
        )}
      </View>

      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
          marginTop: 30,
        }}
      >
        <Pressable
          onPress={createPlaylistInSpotify}
          disabled={loading}
          style={{
            backgroundColor: Colors.buttonMainFill,
            borderWidth: 1,
            borderColor: Colors.buttonMainStroke,
            borderRadius: 10,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.button.fontFamily,
              fontSize: Fonts.button.fontSize,
              color: "white",
            }}
          >
            Save playlist to Spotify
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ForYouScreen;
const styles = StyleSheet.create({});
