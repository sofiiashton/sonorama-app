import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Linking,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Fonts } from "../config/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLeftRegular,
  ArrowRightRegular,
  QuestionCircleRegular,
  ImageAddRegular,
} from "@fluentui/react-native-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import Slider from "@react-native-community/slider";
import CheckBox from "@react-native-community/checkbox";
import LoadingSpinner from "../assets/loading.gif";
import themeContext from "../theme/themeContext.js";
import theme from "../theme/theme.js";
import langContext from "../lang/langContext.js";

const SetPlaylistSettingsScreen = ({ navigation, route }) => {
  const theme = useContext(themeContext);
  const lang = useContext(langContext);

  const moodParameters = {
    Chill: { target_energy: 0.2, max_energy: 0.5, max_tempo: 120 },
    Acoustic: { target_acousticness: 0.8, min_acousticness: 0.5 },
    Energetic: {
      target_energy: 0.8,
      min_energy: 0.6,
      min_tempo: 100,
      target_danceability: 0.7,
    },
    Melancholic: { target_valence: 0.2, max_valence: 0.4, max_energy: 0.6 },
    Triumphant: { target_energy: 0.8, target_valence: 0.8 },
    Soothing: { target_valence: 0.7, max_energy: 0.4 },
    "Feel-good": {
      target_valence: 0.8,
      target_energy: 0.7,
      target_danceability: 0.8,
    },
    Instrumental: { min_instrumentalness: 0.7, max_speechiness: 0.2 },
  };

  const genreParameters = {
    Alternative: "alternative",
    Pop: "pop",
    "R&B": "r-n-b",
    "Hip-Hop": "hip-hop",
    Rock: "rock",
    Electronic: "electronic",
    "Art pop": "art-pop",
    Jazz: "jazz",
    Soul: "soul",
    "Trip-hop": "trip-hop",
    Classical: "classical",
  };

  const calculateAverage = (values) => {
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  };

  const mergeMoodParameters = (selectedMoods) => {
    const mergedParameters = {};

    selectedMoods.forEach((mood) => {
      Object.entries(moodParameters[mood]).forEach(([key, value]) => {
        if (mergedParameters[key] === undefined) {
          mergedParameters[key] = [value];
        } else {
          mergedParameters[key].push(value);
        }
      });
    });

    const averagedParameters = {};
    Object.entries(mergedParameters).forEach(([key, values]) => {
      averagedParameters[key] = calculateAverage(values);
    });

    return averagedParameters;
  };

  const { selectedMoods, selectedGenres } = route.params;

  useEffect(() => {
    if (selectedMoods) {
      console.log("Selected Moods from previous:", selectedMoods);
    }
    if (selectedGenres) {
      console.log("Selected Genres from previous:", selectedGenres);
    }
  }, [selectedMoods, selectedGenres]);

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

  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.05,
      base64: true,
    });

    console.log("base64:", result.assets[0].base64);

    if (!result.canceled) {
      setBase64Image(result.assets[0].base64);

      setImage(result.assets[0].uri);
    }
  };

  const [playlistName, setPlaylistName] = useState("SonoMix");
  const [isInputFocused, setInputFocused] = useState(false);

  const [playlistSize, setPlaylistSize] = useState(50);

  const generateRecommendations = async (
    selectedMoods,
    selectedGenres,
    playlistSize
  ) => {
    const token = await AsyncStorage.getItem("token");
    const moodParameters = mergeMoodParameters(selectedMoods);
    const formattedGenres = selectedGenres.map(
      (genre) => genreParameters[genre]
    );

    async function getTopArtists() {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=20",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch top artists");
      }

      const data = await response.json();
      return data.items;
    }

    const topArtists = await getTopArtists();

    const filteredArtists = topArtists.filter((artist) =>
      artist.genres.some((genre) =>
        formattedGenres.map((genre) => genre.replace(/-/g, " ")).includes(genre)
      )
    );

    console.log(filteredArtists);

    const topArtistIds = filteredArtists.map(({ id }) => id);

    let seedArtists = [];
    let seedGenres = [];

    if (selectedGenres.length === 0) {
      seedArtists = topArtistIds;
    } else if (selectedGenres.length <= 4) {
      seedGenres = formattedGenres;
      seedArtists = topArtistIds.slice(0, 5 - selectedGenres.length);
    } else {
      seedGenres = formattedGenres;
    }

    const recommendationBody = {
      limit: playlistSize,
      seed_genres: formattedGenres.join(","),
      seed_artists: seedArtists.join(","),
      ...moodParameters,
    };

    const res = await fetch(
      "https://api.spotify.com/v1/recommendations?" +
        new URLSearchParams(recommendationBody),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res);
    if (!res.ok) {
      throw new Error("Failed to fetch recommendations");
    }
    const data = await res.json();
    return data.tracks;
  };

  const createPlaylistFromRecommendations = async (
    selectedMoods,
    selectedGenres,
    playlistSize,
    playlistName,
  ) => {
    try {
      const tracks = await generateRecommendations(
        selectedMoods,
        selectedGenres,
        playlistSize
      );

      const trackUris = tracks.map((track) => track.uri);

      const token = await AsyncStorage.getItem("token");
      const userProfileResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userProfileResponse.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userProfile = await userProfileResponse.json();
      const userId = userProfile.id;

      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playlistName,
            description: "Playlist created by Sonorama",
            public: false,
          }),
        }
      );

      if (!createPlaylistResponse.ok) {
        throw new Error("Failed to create playlist");
      }

      const createdPlaylist = await createPlaylistResponse.json();
      const playlistId = createdPlaylist.id;

      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: trackUris }),
        }
      );

      if (!addTracksResponse.ok) {
        throw new Error("Failed to add tracks to playlist");
      }

      navigation.navigate("PlaylistCreated", { playlistId });
    } catch (error) {
      console.error("Error creating playlist:", error.message);
    }
  };

  const [isLoading, setLoading] = useState(false);

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
          {lang.playlistGeneratorTitle}
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
            color: theme.textDefault,
          }}
        >
          {lang.givePlaylistName}
        </Text>

        <Text
          style={{
            fontFamily: Fonts.cardParagraph.fontFamily,
            fontSize: Fonts.cardParagraph.fontSize,
            color: theme.textSecondary,
            marginTop: 8,
          }}
        >
          {lang.optionalStep}
        </Text>
      </View>

      {/* <View
        style={{
          height: 136,
          width: 340,
          marginTop: 16,
          marginLeft: 24,
          marginRight: 24,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: theme.optionDisabledStroke,
        }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              flex: 1,
              borderRadius: 20,
              resizeMode: "cover",
            }}
          />
        ) : (
          <Pressable
            onPress={pickImage}
            style={{
              flex: 1,
              backgroundColor: theme.optionDisabledFill,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageAddRegular width={24} color="grey"></ImageAddRegular>
            <Text
              style={{
                fontFamily: Fonts.cardParagraph.fontFamily,
                fontSize: Fonts.baseFont.fontSize,
                color: "grey",
                marginTop: 4,
              }}
            >
              Upload image
            </Text>
          </Pressable>
        )}
      </View> */}

      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
          marginTop: 20,
        }}
      >
        <TextInput
          style={{
            borderColor: isInputFocused
              ? theme.buttonMainFill
              : theme.optionDisabledStroke,
            borderWidth: 1,
            borderRadius: 10,
            width: 342,
            height: 40,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 12,
            paddingBottom: 12,
            color: isInputFocused ? theme.textDefault : theme.optionDisabledText,
          }}
          onChangeText={(text) => setPlaylistName(text)} // Update playlistName when user types
          value={playlistName}
          placeholder="SonoMix"
          placeholderTextColor={theme.optionDisabledText} // Set placeholder text color to grey
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
      </View>

      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
          marginTop: 40,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.sectionTitle.fontFamily,
            fontSize: Fonts.sectionTitle.fontSize,
            color: theme.textDefault,
          }}
        >
          {lang.playlistSize} {playlistSize} {lang.songs}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.cardParagraph.fontFamily,
              color: theme.optionDisabledText,
            }}
          >
            2
          </Text>

          <Slider
            minimumValue={2}
            maximumValue={100}
            step={1}
            value={playlistSize}
            onValueChange={(value) => setPlaylistSize(value)}
            minimumTrackTintColor="rgba(240, 153, 50, 1)"
            maximumTrackTintColor={theme.optionDisabledStroke}
            style={{
              flex: 1,
              height: 40,
              marginHorizontal: 8,
            }}
          />

          <Text
            style={{
              fontFamily: Fonts.cardParagraph.fontFamily,
              color: theme.optionDisabledText,
            }}
          >
            100
          </Text>
        </View>
      </View>

      {/* <View
        style={{
          marginLeft: 24,
          marginBottom: 24,
          marginTop: 24,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CheckBox
          disabled={false}
          value={toggleCheckBox}
          onValueChange={(newValue) => setToggleCheckBox(newValue)}
          onCheckColor={theme.buttonMainFill}
          onTintColor={theme.buttonMainFill}
          style={{
            width: 24,
            height: 24,
          }}
        />
        <Text
          style={{
            fontFamily: Fonts.cardParagraph.fontFamily,
            fontSize: Fonts.button.fontSize,
            marginLeft: 12,
          }}
        >
          Make playlist private
        </Text>
      </View> */}

      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
          marginTop: 296,
        }}
      >
        <Pressable
          onPress={async () => {
            setLoading(true);
            await createPlaylistFromRecommendations(
              selectedMoods,
              selectedGenres,
              playlistSize,
              playlistName,
              base64Image
            );
            setLoading(false);
          }}
          style={{
            backgroundColor: theme.buttonMainFill,
            height: 48,
            borderColor: theme.buttonMainStroke,
            borderWidth: 1,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <Image source={LoadingSpinner} style={{ width: 24, height: 24 }} />
          ) : (
            <Text
              style={{
                color: "white",
                fontFamily: Fonts.button.fontFamily,
                fontSize: Fonts.button.fontSize,
              }}
            >
              {lang.generatePlaylistButton}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default SetPlaylistSettingsScreen;
const styles = StyleSheet.create({
  selectedGenre: {
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
  },
  unselectedGenre: {
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
});
