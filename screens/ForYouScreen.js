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
  import { ArrowLeftRegular, } from "@fluentui/react-native-icons";
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
  
      </View>
    );
  };
  
  export default ForYouScreen;
  const styles = StyleSheet.create({});