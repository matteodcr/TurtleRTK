import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../../fc/Store';

export interface ItemProp {
  device;
  navigation;
}

export default observer(function PeripheralListItem({
  device,
  navigation,
}: ItemProp) {
  const store = useStoreContext();

  function showBleDeviceDetails(device) {
    navigation.navigate('DetailsBLE', {device: device});
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
          device.connecting && {backgroundColor: 'orange'},
          device.connected && {backgroundColor: 'lightblue'},
          device.error && {backgroundColor: 'red'},
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
