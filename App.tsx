import 'react-native-gesture-handler';

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SettingsScreen from './src/ui/Screens/SettingsScreen';
import CasterScreen, { getCasterData } from './src/ui/Screens/CasterScreen';
import RoverScreen from './src/ui/Screens/RoverScreen';
import RecordingScreen from './src/ui/Screens/RecordingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: { backgroundColor: '#42f44b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="SettingsScr"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function RecordingStack() {
  return (
    <Stack.Navigator
      initialRouteName="Recording"
      screenOptions={{
        headerStyle: { backgroundColor: '#42f44b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="RecordingScr"
        component={RecordingScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function CasterStack() {
  return (
    <Stack.Navigator
      initialRouteName="Caster"
      screenOptions={{
        headerStyle: { backgroundColor: '#42f44b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="CasterScr"
        component={CasterScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function RoverStack() {
  return (
    <Stack.Navigator
      initialRouteName="Rover"
      screenOptions={{
        headerStyle: { backgroundColor: '#42f44b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="RoverScr"
        component={RoverScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function casterMoreButton() {
  getCasterData();
}

function roverMoreButton() {
  alert('TODO Rover')
}

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Rover"
          >
          <Tab.Screen
            name="Caster"
            component={CasterStack}
            options={{
              tabBarLabel: 'Caster',
              headerRight: () => (
                <Pressable style={styles.button} onPress={casterMoreButton}>
                  <Text style={{color: "white", fontSize: 25}}>+</Text>
                </Pressable>
              ),
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="server-network" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Rover"
            component={RoverStack}
            options={{
              tabBarLabel: "Rover",
              headerRight: () => (
                <Pressable style={styles.button} onPress={roverMoreButton}>
                  <Text style={{color: "white", fontSize: 25}}>+</Text>
                </Pressable>
              ),
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="antenna" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Recording"
            component={RecordingStack}
            options={{
              tabBarLabel: 'Recording',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="content-save" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsStack}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="setting" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#fff',
  }
});