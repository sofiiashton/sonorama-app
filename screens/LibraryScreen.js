import { FlatList, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import React, { useEffect, useState } from "react";
import { Fonts, Colors, Spacing } from "../config/index.js";
import {
  ArrowSortRegular,
  ArrowRightRegular,
} from "@fluentui/react-native-icons";
import { Linking, Pressable, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useIsFocused,  useNavigation } from "@react-navigation/native";

const LibraryScreen = () => {
  const navigation = useNavigation();

  const isFocused = useIsFocused();

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

  const [recentPlaylists, setRecentPlaylists] = useState([]);
  const getRecentPlaylists = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/playlists?limit=4",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const spotifyPlaylists = response.data.items;
      setRecentPlaylists(spotifyPlaylists);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getRecentPlaylists();
  }, []);

  const [allPlaylists, setAllPlaylists] = useState([]);
  const getAllPlaylists = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/playlists",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const spotifyPlaylists = response.data.items;
      setAllPlaylists(spotifyPlaylists);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getAllPlaylists();
  }, []);

  const [sortBy, setSortBy] = useState("Recent");
  const sortPlaylists = (playlists) => {
    if (sortBy === "Recent") {
      return playlists.sort((a, b) => b.tracks.total - a.tracks.total);
    } else if (sortBy === "A-Z") {
      return playlists.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Z-A") {
      return playlists.sort((a, b) => b.name.localeCompare(a.name));
    }
    return playlists;
  };

  useEffect(() => {
    if (isFocused) {
      getRecentPlaylists();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => {
    const openPlaylistInSpotify = () => {
      const playlistURI = item.uri;
      const playlistID = playlistURI.substring("spotify:playlist:".length);

      const spotifyDeepLink = `https://open.spotify.com/playlist/${playlistID}`;

      Linking.openURL(spotifyDeepLink).catch((err) =>
        console.error("Failed to open link:", err)
      );
    };

    return (
      <Pressable
        style={{
          marginBottom: 24,
        }}
        onPress={openPlaylistInSpotify}
      >
        {/* <Image
          style={{
            height: 163,
            width: 161,
            borderRadius: 10,
          }}
          source={{ uri: item.images[0].url }}
        /> */}
        {item.images && item.images.length > 0 ? (
          <Image
            style={{
              height: 163,
              width: 161,
              borderRadius: 10,
            }}
            source={{ uri: item.images[0].url }}
          />
        ) : (
          <Image
            style={{
              height: 163,
              width: 161,
              borderRadius: 10,
              backgroundColor: Colors.optionDisabledFill,
            }}
          />
        )}
        <Text
          numberOfLines={1}
          style={{
            fontFamily: Fonts.cardTitle.fontFamily,
            fontSize: Fonts.cardTitle.fontSize,
            marginTop: 12,
            width: 145,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.cardParagraph.fontFamily,
            fontSize: Fonts.cardParagraph.fontSize,
            color: Colors.textSecondary,
            marginTop: 2,
          }}
        >
          {item.tracks.total} songs
        </Text>
      </Pressable>
    );
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
          Your library
        </Text>
      </View>

      <View>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            marginLeft: 24,
            marginRight: 24,
            marginTop: 18,
          }}
        >
          <ArrowSortRegular color="rgba(0, 0, 0, 0.4)" width={20} />
          <Text
            style={{
              marginLeft: 6,
              marginRight: 12,
              color: Colors.textSecondary,
            }}
          >
            Sort by:
          </Text>
          <Pressable
            style={{
              backgroundColor:
                sortBy === "Recent"
                  ? Colors.optionSelectedFill
                  : Colors.optionDisabledFill,
              borderColor:
                sortBy === "Recent"
                  ? Colors.optionSelectedStroke
                  : Colors.optionDisabledStroke,
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 14,
              paddingRight: 14,
              paddingTop: 6,
              paddingBottom: 6,
              marginRight: 6,
            }}
            onPress={() => setSortBy("Recent")}
          >
            <Text
              style={{
                color:
                  sortBy === "Recent"
                    ? Colors.optionSelectedText
                    : Colors.optionDisabledText,
                fontFamily: Fonts.baseFont.fontFamily,
                fontSize: Fonts.baseFont.fontSize,
              }}
            >
              Recent
            </Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor:
                sortBy === "A-Z"
                  ? Colors.optionSelectedFill
                  : Colors.optionDisabledFill,
              borderColor:
                sortBy === "A-Z"
                  ? Colors.optionSelectedStroke
                  : Colors.optionDisabledStroke,
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 6,
              paddingBottom: 6,
              marginRight: 6,
            }}
            onPress={() => setSortBy("A-Z")}
          >
            <Text
              style={{
                color:
                  sortBy === "A-Z"
                    ? Colors.optionSelectedText
                    : Colors.optionDisabledText,
                fontFamily: Fonts.baseFont.fontFamily,
                fontSize: Fonts.baseFont.fontSize,
              }}
            >
              A-Z
            </Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor:
                sortBy === "Z-A"
                  ? Colors.optionSelectedFill
                  : Colors.optionDisabledFill,
              borderColor:
                sortBy === "Z-A"
                  ? Colors.optionSelectedStroke
                  : Colors.optionDisabledStroke,
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 6,
              paddingBottom: 6,
              marginRight: 6,
            }}
            onPress={() => setSortBy("Z-A")}
          >
            <Text
              style={{
                color:
                  sortBy === "Z-A"
                    ? Colors.optionSelectedText
                    : Colors.optionDisabledText,
                fontFamily: Fonts.baseFont.fontFamily,
                fontSize: Fonts.baseFont.fontSize,
              }}
            >
              Z-A
            </Text>
          </Pressable>
        </View>

        {/* <View
          style={{
            marginLeft: 24,
            marginRight: 24,
            marginTop: 24,
          }}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.sectionTitle.fontFamily,
                fontSize: Fonts.sectionTitle.fontSize,
                color: "black",
              }}
            >
              Generated playlists
            </Text>
            <Pressable
              style={{
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.seeAll.fontFamily,
                  fontSize: Fonts.seeAll.fontSize,
                  color: Colors.textSeeAll,
                  marginRight: 6,
                }}
              >
                See all
              </Text>
              <ArrowRightRegular color={Colors.textSeeAll} width={17} />
            </Pressable>
          </View>
        </View> */}

        <View
          style={{
            marginLeft: 24,
            marginRight: 24,
            marginTop: 24,
          }}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.sectionTitle.fontFamily,
                fontSize: Fonts.sectionTitle.fontSize,
                color: "black",
              }}
            >
              Recent playlists
            </Text>
            <Pressable
              style={{
                alignItems: "center",
                flexDirection: "row",
              }}
              onPress={() => navigation.navigate("AllPlaylists")}
            >
              <Text
                style={{
                  fontFamily: Fonts.seeAll.fontFamily,
                  fontSize: Fonts.seeAll.fontSize,
                  color: Colors.textSeeAll,
                  marginRight: 6,
                }}
              >
                See all
              </Text>
              <ArrowRightRegular color={Colors.textSeeAll} width={17} />
            </Pressable>
          </View>
        </View>

        {/* <View>
          {recentPlaylists.length > 0 ? (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginLeft: 24,
                marginTop: 18,
              }}
            >
              <FlatList
                horizontal={true}
                data={
                  sortBy === "Recent"
                    ? recentPlaylists
                    : sortPlaylists(allPlaylists).slice(0, 5)
                }
                renderItem={renderItem}
              />
            </View>
          ) : (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/img/no-playlists.png")}
                style={{
                  width: 145,
                  height: 145,
                  resizeMode: "contain",
                  borderRadius: 10,
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.cardTitle.fontFamily,
                  fontSize: Fonts.cardTitle.fontSize,
                  marginTop: 12,
                }}
              >
                You haven't saved any playlists yet
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.cardParagraph.fontFamily,
                  fontSize: Fonts.cardParagraph.fontSize,
                  color: Colors.textSecondary,
                  alignSelf: "center",
                  marginTop: 6,
                  marginBottom: 12,
                }}
              >
                Use the Playlist Generator to create playlists.
              </Text>
            </View>
          )}
        </View> */}

        <View>
          {recentPlaylists.length > 0 ? (
            <FlatList
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              data={
                sortBy === "Recent"
                  ? recentPlaylists
                  : sortPlaylists(allPlaylists)
              }
              renderItem={renderItem}
              style={{
                marginLeft: 24,
                marginRight: 24,
                marginTop: 30,
                marginBottom: 40,
              }}
            />
          ) : (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/img/no-playlists.png")}
                style={{
                  width: 145,
                  height: 145,
                  resizeMode: "contain",
                  borderRadius: 10,
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.cardTitle.fontFamily,
                  fontSize: Fonts.cardTitle.fontSize,
                  marginTop: 12,
                }}
              >
                You haven't saved any playlists yet
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.cardParagraph.fontFamily,
                  fontSize: Fonts.cardParagraph.fontSize,
                  color: Colors.textSecondary,
                  alignSelf: "center",
                  marginTop: 6,
                  marginBottom: 12,
                }}
              >
                Use the Playlist Generator to create playlists.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default LibraryScreen;
const styles = StyleSheet.create({});
