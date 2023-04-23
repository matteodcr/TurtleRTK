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
    filter(store, selectedSorter, searchText, latitude, longitude),
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

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  item: {
    backgroundColor: '#3F4141',
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  itemConnected: {
    backgroundColor: 'green',
    padding: 12,
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  baseText: {
    fontSize: 20,
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modal: {
    margin: 0, // This is the important style you need to set
  },
  sortButton: {
    flex: 1,
    backgroundColor: '#151515',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  textinput: {
    height: 50,
    borderColor: '#919191',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 15,
    borderRadius: 10,
    color: 'white',
  },
  TabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerTab: {
    backgroundColor: '#111111',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: '#151515',
    borderBottomWidth: 1,
    height: 50,
    alignItems: 'center',
  },
  chipsContainer: {
    paddingTop: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
  },
  header: {
    fontSize: 25,
    color: 'white',
    marginLeft: 15,
    paddingTop: 20,
    paddingBottom: 5,
  },
});
