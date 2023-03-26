import {RefreshControl} from 'react-native';

import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../fc/Store';

import LogListItem from './LogListItem';

interface LogListProps {
  modifySelectedLog: (string) => void;
}
export default observer(function LogList({modifySelectedLog}: LogListProps) {
  const store = useStoreContext();

  const renderItem = ({item}) => (
    <LogListItem item={item} modifySelectedLog={modifySelectedLog} />
  );

  return (
    <FlashList
      data={store.logManager.logList}
      renderItem={renderItem}
      keyExtractor={item => item.name + item.size}
      estimatedItemSize={100}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={async () => {
            store.logManager.getLogs();
          }}
        />
      }
    />
  );
});
