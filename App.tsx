import 'react-native-gesture-handler';

import React from 'react';
import {StyleSheet, View, PermissionsAndroid, Alert} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import SettingsScreen from './src/ui/Screens/SettingsScreen';
import RoverScreen from './src/ui/Screens/RoverScreen';
import RecordingScreen from './src/ui/Screens/RecordingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator initialRouteName="Settings">
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
    <Stack.Navigator initialRouteName="Recording">
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
    <Stack.Navigator initialRouteName="Caster">
      <Stack.Screen
        name="CasterScr"
        getComponent={() => require('./src/ui/Screens/CasterScreen').default}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CasterPoolScreen"
        getComponent={() =>
          require('./src/ui/Screens/CasterPoolScreen').default
        }
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function RoverStack() {
  return (
    <Stack.Navigator initialRouteName="Rover">
      <Stack.Screen
        name="RoverScr"
        getComponent={() => require('./src/ui/Screens/RoverScreen').default}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailsBLE"
        getComponent={() => require('./src/ui/Screens/DetailsBLE').default}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export async function requestLocationPermission() 
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
      Alert.alert("You won't be able to use location and Bluetooth");
    }
  } catch (err) {
    console.warn(err)
  }
}

async function requestBluetoothScanPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Bluetooth Scan Permission',
        message: 'This app needs access to Bluetooth Scan in order to scan nearby Bluetooth devices.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Bluetooth Scan permission granted');
    } else {
      console.log('Bluetooth Scan permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export default function App() {
  try {
    requestLocationPermission();
  } catch (e) {
    console.log(e);
  }
  /*try {
    requestBluetoothScanPermission();
  } catch (e) {
    console.log(e);
  }*/
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Rover"
          screenOptions={{
            tabBarStyle: {
              backgroundColor: '#151515',
            },
          }}>
          <Tab.Screen
            name="Caster"
            component={CasterStack}
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name="server-network"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Rover"
            component={RoverStack}
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name="antenna"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Recording"
            component={RecordingStack}
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name="content-save"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsStack}
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
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
  },
});
