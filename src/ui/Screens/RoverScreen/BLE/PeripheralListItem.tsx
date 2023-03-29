import {Pressable, Text, View} from 'react-native';
import React from 'react';
import {observer} from 'mobx-react-lite';

import {useStoreContext} from '../../../../fc/Store';
import {PeripheralListItemStyle} from '../../Styles';
const styles = PeripheralListItemStyle;
import {PeripheralInfo} from 'react-native-ble-manager';

/**
 * Describes the props of the PeripheralListItem class
 */
export interface ItemProp {
  device;
  setSelectedDevice(device: PeripheralInfo);
  toggleVisibleModal();
}

/**
 * Creates the Item of a peripheral list
 */
export default observer(function PeripheralListItem({
  device,
  setSelectedDevice,
  toggleVisibleModal,
}: ItemProp) {
  const store = useStoreContext();

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
                setSelectedDevice(device);
                toggleVisibleModal();
              }}>
              <Text style={{color: 'white', fontSize: 25}}>...</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
});
