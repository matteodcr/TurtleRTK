import React from 'react';
import {FlashList} from '@shopify/flash-list';
import PeripheralListItem from './PeripheralListItem';
import {observer} from 'mobx-react-lite';

import {useStoreContext} from '../../../../fc/Store';

/**
 * Describes the props of the PeripheralList class
 */
interface PeripheralListProps {
  navigation;
}

/**
 * Creates a list of the discovered peripherals
 */
export default observer(function PeripheralList({
  navigation,
}: PeripheralListProps) {
  const store = useStoreContext();

  const peripheralsArray = Array.from(store.bluetoothManager.peripherals).map(
    (item, index) => {
      return {
        ...item,
        key: index.toString(),
      };
    },
  );

  const filter = () => item => {
    return store.bluetoothManager.displayNoNameDevices || item.name != null;
  };

  const filteredPeripheralsArray = peripheralsArray.filter(filter());

  return (
    <FlashList
      data={filteredPeripheralsArray}
      renderItem={({item}) => (
        <PeripheralListItem device={item} navigation={navigation} />
      )}
      keyExtractor={item => item.key}
      estimatedItemSize={20}
    />
  );
});
