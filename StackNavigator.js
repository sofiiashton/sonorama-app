import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import LibraryScreen from "./screens/LibraryScreen";
import AllPlaylistsScreen from "./screens/AllPlaylistsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SetMoodsScreen from "./screens/SetMoodsScreen";
import { HomeFilled, HomeRegular, LibraryFilled, LibraryRegular, SettingsFilled, SettingsRegular} from "@fluentui/react-native-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {
        backgroundColor:"white",
        position:"absolute",
        borderTopColor:"rgba(0,0,0,0.05)",
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
        //   tabBarLabelStyle: { color: "black" },
        //   tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeFilled color="black"/>
            ) : (
              <HomeRegular color="black"/>
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
        //   tabBarLabelStyle: { color: "black" },
        //   tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <LibraryFilled color="black"/>
            ) : (
              <LibraryRegular color="black"/>
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
        //   tabBarLabelStyle: { color: "black" },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <SettingsFilled color="black"/>
            ) : (
              <SettingsRegular color="black"/>
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
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation