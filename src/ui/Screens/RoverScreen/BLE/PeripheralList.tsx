import React from 'react';
import {FlashList} from '@shopify/flash-list';
import PeripheralListItem from './PeripheralListItem';
import {observer} from 'mobx-react-lite';

import {useStoreContext} from '../../../../fc/Store';
import {PeripheralInfo} from 'react-native-ble-manager';

/**
 * Describes the props of the PeripheralList class
 */
interface PeripheralListProps {
  setSelectedDevice(device: PeripheralInfo);
  toggleVisibleModal();
}

/**
 * Creates a list of the discovered peripherals
 */
export default observer(function PeripheralList({
  setSelectedDevice,
  toggleVisibleModal,
}: PeripheralListProps) {
  const store = useStoreContext();

  const peripheralsArray = store.bluetoothManager
    .getDiscoveredPeripherals()
    .map((item, index) => {
      return {
        ...item,
        key: index.toString(),
      };
    });

  const filter = () => item => {
    return store.bluetoothManager.displayNoNameDevices || item.name != null;
  };

  const filteredPeripheralsArray = peripheralsArray.filter(filter());

  return (
    <FlashList
      data={filteredPeripheralsArray}
      renderItem={({item}) => (
        <PeripheralListItem
          device={item}
          setSelectedDevice={setSelectedDevice}
          toggleVisibleModal={toggleVisibleModal}
        />
      )}
      keyExtractor={item => item.key}
      estimatedItemSize={20}
    />
  );
});
