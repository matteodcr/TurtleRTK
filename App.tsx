import React from 'react';
import 'react-native-gesture-handler';
import {StyleSheet, View, PermissionsAndroid, Alert} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider, MD3DarkTheme, Snackbar} from 'react-native-paper';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import SettingsScreen from './src/ui/Screens/SettingsScreen';
import RecordingScreen from './src/ui/Screens/RecordingScreen';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from './src/fc/Store';

function createIcon(iconName: string) {
  return ({color}: {color: string}) => (
    <MaterialCommunityIcons name={iconName} color={color} size={26} />
  );
}

const SettingsStack = createStackNavigator();
function SettingsRoute() {
  return (
    <SettingsStack.Navigator initialRouteName="Settings">
      <SettingsStack.Screen
        name="SettingsScr"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
    </SettingsStack.Navigator>
  );
}

const RecordingStack = createStackNavigator();
function RecordingRoute() {
  return (
    <RecordingStack.Navigator initialRouteName="Recording">
      <RecordingStack.Screen
        name="RecordingScr"
        component={RecordingScreen}
        options={{headerShown: false}}
      />
    </RecordingStack.Navigator>
  );
}

const CasterStack = createStackNavigator();
function CasterRoute() {
  return (
    <CasterStack.Navigator initialRouteName="Caster">
      <CasterStack.Screen
        name="CasterScr"
        getComponent={() =>
          require('./src/ui/Screens/CasterScreen/CasterScreen').default
        }
        options={{headerShown: false}}
      />
      <CasterStack.Screen
        name="CasterPoolScreen"
        getComponent={() =>
          require('./src/ui/Screens/CasterPoolScreen/CasterPoolScreen').default
        }
        options={{headerShown: false}}
      />
    </CasterStack.Navigator>
  );
}

const RoverStack = createStackNavigator();
function RoverRoute() {
  return (
    <RoverStack.Navigator initialRouteName="Rover">
      <RoverStack.Screen
        name="RoverScr"
        getComponent={() => require('./src/ui/Screens/RoverScreen/RoverScreen').default}
        options={{headerShown: false}}
      />
      <RoverStack.Screen
        name="DetailsBLE"
        getComponent={() => require('./src/ui/Screens/RoverScreen/BLE/DetailsBLE').default}
        options={{headerShown: false}}
      />
    </RoverStack.Navigator>
  );
}

const Tab = createMaterialBottomTabNavigator();

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
      Alert.alert("You won't be able to use location and Bluetooth");
    }
  } catch (err) {
    console.warn(err);
  }
}

export async function requestBluetoothScanPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Bluetooth Scan permission granted');
    } else {
      console.log('Bluetooth Scan permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

export async function requestBluetoothConnectPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Bluetooth connexion permission granted');
    } else {
      console.log('Bluetooth connextion permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

export default observer(function App() {
  var store = useStoreContext();
  try {
    requestLocationPermission();
  } catch (e) {
    console.log(e);
  }
  try {
    requestBluetoothConnectPermission();
  } catch (e) {
    console.log(e);
  }
  return (
    <Provider theme={MD3DarkTheme}>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Caster">
          <Tab.Screen
            name="Caster"
            component={CasterRoute}
            options={{
              tabBarLabel: 'Caster',
              tabBarIcon: createIcon('server-network'),
            }}
          />
          <Tab.Screen
            name="Rover"
            component={RoverRoute}
            options={{
              tabBarLabel: 'Rover',
              tabBarIcon: createIcon('antenna'),
            }}
          />
          <Tab.Screen
            name="Recordings"
            component={RecordingRoute}
            options={{
              tabBarLabel: 'Recordings',
              tabBarIcon: createIcon('crosshairs-gps'),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsRoute}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: createIcon('cog'),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <Snackbar
        visible={store.errorManager.isError}
        onDismiss={() => store.errorManager.modifyErrorVisibility(false)}
        wrapperStyle={{paddingBottom: 80}}
        action={{
          label: 'Close',
          onPress: () => {
            store.errorManager.modifyErrorVisibility(false);
          },
        }}>
        {store.errorManager.currentError}
      </Snackbar>
    </Provider>
  );
});
