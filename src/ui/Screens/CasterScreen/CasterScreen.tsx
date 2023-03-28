import React, {useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {observer} from 'mobx-react-lite';

import Geolocation from '@react-native-community/geolocation';

import Base from '../../../fc/Caster/Base';
import {useStoreContext} from '../../../fc/Store';
import SourceTable from '../../../fc/Caster/SourceTable';
import ResearchBase, {
  filter,
  sorter,
  SorterKey,
  SorterTypes,
} from './ResearchBase';
import HeaderCasterScreen from './HeaderCasterScreen';
import BaseList from './BaseList';
import BaseModal from './BaseModal';
import ConnectedBase from './ConnectedBase';
import {ConnectionStatusBar} from 'react-native-ui-lib';
import {styleCaster} from '../Styles';
export const styles = styleCaster;

let latitude = 45.184434;
let longitude = 5.75397;
Geolocation.getCurrentPosition(
  position => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude, longitude);
  },
  error => {
    console.log(error.code, error.message);
  },
  {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
    distanceFilter: 500,
  },
);

interface Props {
  navigation: any;
}

export default observer(function CasterScreen({navigation}: Props) {
  const store = useStoreContext();

  const mockBase = new Base(
    new SourceTable(store.casterPool, 'none', 2101, 'none', 'none', true),
    [],
  );

  const [searchText, onChangeSearch] = useState('');
  const [sorterFilter, setSorterFilter] = useState(SorterTypes.distance); //sorter type selected
  const [selectedSorter, setSelectedSorter] = useState(SorterKey.mountpoint); //sorter key selected
  const [isInfoVisible, setInfoVisible] = useState(false);
  const [selectedBase, setSelectedBase] = useState(mockBase);

  const modifySearch = (newSearch: string) => {
    onChangeSearch(newSearch);
  };

  const modifySorterFilter = (newSorterFilter: SorterTypes) => {
    setSorterFilter(newSorterFilter);
  };

  const modifySelectedSorter = (newSelectedSorter: SorterKey) => {
    setSelectedSorter(newSelectedSorter);
  };

  const toogleInfo = () => {
    setInfoVisible(!isInfoVisible);
  };

  function showBaseInfo(item) {
    setSelectedBase(item);
    toogleInfo();
  }

  const filteredBaseList: Base[] = store.basePool.baseList.filter(
    filter(selectedSorter, searchText),
  );

  const sortedBaseList: Base[] = filteredBaseList.sort(
    sorter(selectedSorter, sorterFilter, latitude, longitude),
  );

  React.useEffect(() => {
    return navigation.addListener('focus', () => {
      store.basePool.generate(store.casterPool);
    });
  }, [navigation, store.basePool, store.casterPool]);

  return (
    <SafeAreaView style={styles.container}>
      <BaseModal
        selectedBase={selectedBase}
        isInfoVisible={isInfoVisible}
        toogleInfo={toogleInfo}
      />
      <HeaderCasterScreen navigation={navigation} />
      <ConnectionStatusBar
        onConnectionChange={() => console.log('connection changed')}
      />

      <ConnectedBase
        showBaseInfo={showBaseInfo}
        latitude={latitude}
        longitude={longitude}
      />
      <ResearchBase
        search={searchText}
        modifySearch={modifySearch}
        sorterFilter={sorterFilter}
        modifySorterFilter={modifySorterFilter}
        selectedSorter={selectedSorter}
        modifySelectedSorter={modifySelectedSorter}
      />
      <BaseList
        sortedBaseList={sortedBaseList}
        showBaseInfo={showBaseInfo}
        latitude={latitude}
        longitude={longitude}
      />
    </SafeAreaView>
  );
});
