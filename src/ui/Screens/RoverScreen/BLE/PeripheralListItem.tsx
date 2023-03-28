import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {observer} from 'mobx-react-lite';

import {useStoreContext} from '../../../../fc/Store';

/**
 * Describes the props of the PeripheralListItem class
 */
export interface ItemProp {
  device;
  navigation;
}

/**
 * Creates the Item of a peripheral list
 */
export default observer(function PeripheralListItem({
  device,
  navigation,
}: ItemProp) {
  const store = useStoreContext();

  /**
   * Shows a screen with details of the given peripheral
   * @param peripheral the given peripheral
   */
  function showBleDeviceDetails(peripheral) {
    navigation.navigate('DetailsBLE', {peripheral});
  }

  return (
    <Pressable
      onPress={() => {
        store.bluetoothManager.togglePeripheralConnection(device);
      }}>
      <View
        key={device.id}
        style={[
          styles.item,
          store.bluetoothManager.connectedPeripherals.has(device.id) && {
            backgroundColor: 'lightblue',
          },
        ]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.deviceName}>
              Name : {device.advertising.localName}
            </Text>
            <Text style={styles.deviceId}>Id : {device.id}</Text>
          </View>
          <View style={{flexDirection: 'row', columnGap: 10}}>
            <Pressable
              onPress={() => {
                showBleDeviceDetails(device);
              }}>
              <Text style={{color: 'white', fontSize: 25}}>...</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#3F4141',
    padding: 20,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  deviceName: {
    marginRight: 10,
    color: 'white',
  },
  deviceId: {
    color: 'gray',
  },
});
