import {RefreshControl} from 'react-native';

import React from 'react';
import {FlashList} from '@shopify/flash-list';
import BaseListItem from './BaseListItem';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../fc/Store';
import Base from '../../../fc/Caster/Base';

interface BaseListProps {
  sortedBaseList: Base[];
  showBaseInfo: (Base) => void;
  latitude: number;
  longitude: number;
}
export default observer(function BaseList({
  sortedBaseList,
  showBaseInfo,
  latitude,
  longitude,
}: BaseListProps) {
  const store = useStoreContext();

  const renderItem = ({item}) => (
    <BaseListItem
      item={item}
      showBaseInfo={showBaseInfo}
      latitude={latitude}
      longitude={longitude}
    />
  );

  return (
    <FlashList
      data={sortedBaseList}
      renderItem={renderItem}
      keyExtractor={item => item.key}
      estimatedItemSize={100}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={async () => {
            store.basePool.generate(store.casterPool);
          }}
        />
      }
    />
  );
});
