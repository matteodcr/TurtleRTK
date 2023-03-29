import {Pressable, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BleManager from 'react-native-ble-manager';
import React from 'react';
import {useStoreContext} from '../../../../fc/Store';
import Geolocation from '@react-native-community/geolocation';
import {baseStyle} from '../../Styles';
const styles = baseStyle;

export default function HeaderRoverScreen() {

    const store = useStoreContext();

    function scanDevices() {
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
    }
    
  return (
    <View style={styles.headerTab}>
        <Text style={styles.boldText}>Rover Screen</Text>
        <Pressable style={styles.TabButton} onPress= {scanDevices}>
          <MaterialCommunityIcons name="reload" color={store.settings.darkTheme ? 'white' : 'dark'} size={store.settings.bigFontEnabled ? 40 : 25} />
        </Pressable>
      </View>
  );
}
