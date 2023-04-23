import React from 'react';
import {FlashList} from '@shopify/flash-list';
import PeripheralListItem from './PeripheralListItem';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../../fc/Store';

interface PeripheralListProps {
  navigation;
}

export default observer(function PeripheralList({
  navigation,
}: PeripheralListProps) {
  const store = useStoreContext();

  const peripheralsArray = Array.from(store.bluetoothManager.peripherals).map(
    (item, index) => {
      return {
        ...item,
        key: index.toString(), // définir une propriété "key" unique en utilisant l'index de l'élément
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
