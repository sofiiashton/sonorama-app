import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Fonts, Colors, Spacing } from "../config/index.js";

const SettingsScreen = () => {
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
      </View>
    )
}

export default SettingsScreen
const styles = StyleSheet.create({});