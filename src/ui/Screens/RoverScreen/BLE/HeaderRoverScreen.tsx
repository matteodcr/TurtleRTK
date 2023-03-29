import {Pressable, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BleManager from 'react-native-ble-manager';
import React from 'react';
import {baseStyle} from '../../Styles';
const styles = baseStyle;

import {useStoreContext} from '../../../../fc/Store';

/**
 *
 * @returns Creates the header of the Rover screen
 */
export default function HeaderRoverScreen() {
  const store = useStoreContext();

  function scanDevices() {
    BleManager.enableBluetooth()
      .then(() => {
        store.bluetoothManager.setIsBluetoothActivated(true);
        store.bluetoothManager.scanDevices();
      })
      .catch(() => {
        store.bluetoothManager.setIsBluetoothActivated(false);
        store.bluetoothManager.setDisplayBluetoothActivatedError(true);
      });
  }

  return (
    <View style={styles.headerTab}>
      <Text style={styles.boldText}>Rover Screen</Text>
      <Pressable style={styles.TabButton} onPress={scanDevices}>
        <MaterialCommunityIcons
          name="reload"
          color={store.settings.darkTheme ? 'white' : 'dark'}
          size={25}
        />
      </Pressable>
    </View>
  );
}
