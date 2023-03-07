import {RefreshControl} from 'react-native';

import React from 'react';
import {FlashList} from '@shopify/flash-list';
import Geolocation from '@react-native-community/geolocation';

interface BaseListProps {
  sortedBaseList;
}
const BaseList = ({item}) => (
  <FlashList
    data={sortedBaseList}
    renderItem={renderItem}
    keyExtractor={item => item.key}
    estimatedItemSize={100}
    refreshControl={
      <RefreshControl
        refreshing={refreshList}
        onRefresh={async () => {
          store.basePool.generate(store.casterPool);
          Geolocation.getCurrentPosition(
            position => {
              myLatitude = position.coords.latitude;
              MyLongitude = position.coords.longitude;
              console.log(myLatitude, MyLongitude);
            },
            error => {
              console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
          );
        }}
      />
    }
  />
);
