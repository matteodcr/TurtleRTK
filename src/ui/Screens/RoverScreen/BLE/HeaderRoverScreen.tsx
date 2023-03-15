import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BleManager from 'react-native-ble-manager';
import React from 'react';
import { useStoreContext } from '../../../../fc/Store';
import Geolocation from '@react-native-community/geolocation';

export default function HeaderRoverScreen() {

    const store = useStoreContext();

    function scanDevices() {
        Geolocation.getCurrentPosition(
          position => {
            store.bluetoothManager.setIsLocalisationActivated(true);
            BleManager.enableBluetooth()
            .then(() => {
              store.bluetoothManager.setIsBluetoothActivated(true);
              store.bluetoothManager.scanDevices();
              })
            .catch((error) => {
              store.bluetoothManager.setIsBluetoothActivated(false);
              store.bluetoothManager.setDisplayBluetoothActivatedError(true);
            });
          },
          error => {
            store.bluetoothManager.setIsLocalisationActivated(false);
            store.bluetoothManager.setDisplayLocalisationActivatedError(true);
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
            distanceFilter: 500,
          },
        )
      }
    
  return (
    <View style={styles.headerTab}>
        <Text style={{marginLeft: 15, fontSize: 18, fontWeight: 'bold', color: 'white'}}>
          Rover Screen
        </Text>
        <Pressable style={styles.TabButton} onPress= {scanDevices}>
          <MaterialCommunityIcons name="reload" color={'white'} size={25} />
        </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
    TabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    headerTab: {
      backgroundColor: '#111111',
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderBottomColor: '#151515',
      borderBottomWidth: 1,
      height: 50,
      alignItems: 'center'
    }
  });
