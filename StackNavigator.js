import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import LibraryScreen from "./screens/LibraryScreen";
import AllPlaylistsScreen from "./screens/AllPlaylistsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SetMoodsScreen from "./screens/SetMoodsScreen";
import { HomeFilled, HomeRegular, LibraryFilled, LibraryRegular, SettingsFilled, SettingsRegular} from "@fluentui/react-native-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import SetGenresScreen from "./screens/SetGenresScreen";
import SetPlaylistSettingsScreen from "./screens/SetPlaylistSettingsScreen";
import PlaylistCreatedScreen from "./screens/PlaylistCreatedScreen";
import ForYouScreen from "./screens/ForYouScreen";
import themeContext from "./theme/themeContext";
import React, { useContext } from "react";

const Tab = createBottomTabNavigator();

function BottomTabs() {
  const theme = useContext(themeContext);
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {
        backgroundColor: theme.navBar,
        position:"absolute",
        borderTopColor: theme.stroke,
        borderTopWidth: 1,
        paddingTop:18,
        paddingBottom:42
      }
    }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeFilled color={theme.textDefault}/>
            ) : (
              <HomeRegular color={theme.textDefault}/>
            ),
        }}
      />
        <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarLabel: "Library",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <LibraryFilled color={theme.textDefault}/>
            ) : (
              <LibraryRegular color={theme.textDefault}/>
            ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <SettingsFilled color={theme.textDefault}/>
            ) : (
              <SettingsRegular color={theme.textDefault}/>
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function Navigation(){
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
                <Stack.Screen name="Main" component={BottomTabs} options={{headerShown:false}}/>
                <Stack.Screen name="AllPlaylists" component={AllPlaylistsScreen} options={{headerShown:false}}/>
                <Stack.Screen name="SetMoods" component={SetMoodsScreen} options={{headerShown:false}}/>
                <Stack.Screen name="SetGenres" component={SetGenresScreen} options={{headerShown:false}}/>
                <Stack.Screen name="SetPlaylistSettings" component={SetPlaylistSettingsScreen} options={{headerShown:false}}/>
                <Stack.Screen name="PlaylistCreated" component={PlaylistCreatedScreen} options={{headerShown:false}}/>
                <Stack.Screen name="ForYou" component={ForYouScreen} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation