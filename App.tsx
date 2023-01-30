import 'react-native-gesture-handler';

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SettingsScreen from './src/ui/Screens/SettingsScreen';
import CasterScreen from './src/ui/Screens/CasterScreen';
import BluetoothScreen from './src/ui/Screens/BluetoothScreen';
import LogScreen from './src/ui/Screens/LogScreen';

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

function LogStack() {
  return (
    <Stack.Navigator
      initialRouteName="Logs"
      screenOptions={{
        headerStyle: { backgroundColor: '#42f44b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="LogsScr"
        component={LogScreen}
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

function BluetoothStack() {
  return (
    <Stack.Navigator
      initialRouteName="Bluetooth"
      screenOptions={{
        headerStyle: { backgroundColor: '#42f44b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="BluetoothScr"
        component={BluetoothScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Feed"
          >
          <Tab.Screen
            name="Caster"
            component={CasterStack}
            options={{
              tabBarLabel: 'Caster',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="server-network" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Bluetooth"
            component={BluetoothStack}
            options={{
              tabBarLabel: 'Bluetooth',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="bluetooth" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Logs"
            component={LogStack}
            options={{
              tabBarLabel: 'Log',
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
  title: {
    flex: 1,
    marginTop: 40,
    fontSize: 20,
    color: 'red',
  },
  header: {
    flex: 1,
    backgroundColor: "#666",
    alignContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 10,
    backgroundColor: "#165",
  },
  toolBar: {
    backgroundColor: "#aaa",
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  buttonIcon: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    width: 50,
    height: 25,
  }
});