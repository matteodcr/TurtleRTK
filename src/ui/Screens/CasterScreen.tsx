import React, {useState} from 'react';
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FlashList} from '@shopify/flash-list';
import CountryFlag from 'react-native-country-flag';

import {getDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';

import {Chip, Paragraph, Searchbar} from 'react-native-paper';
import {observer} from 'mobx-react-lite';
import Base from '../../fc/Caster/Base';
import {useStoreContext} from '../../fc/Store';
import Modal from 'react-native-modal';
import SourceTable from '../../fc/Caster/SourceTable';

let myLatitude = 45.184434;
let MyLongitude = 5.75397;

enum SorterKey {
  city = 'city',
  country = 'country',
  mountpoint = 'mountpoint',
}
enum SorterTypes {
  anti_alphabetical,
  alphabetical,
  distance,
}

interface Props {
  navigation: any;
}

const limitCityName = (name: string) => {
  if (name.length < 20) {
    return name;
  }
  return name.substring(0, 20) + '...';
};

const sorter =
  (selectedSorterType: SorterKey, sorting: SorterTypes) =>
  (Base1: Base, Base2) => {
    switch (selectedSorterType) {
      case SorterKey.city:
        switch (sorting) {
          case SorterTypes.alphabetical:
            return Base1.identifier.toLowerCase() >
              Base2.identifier.toLowerCase()
              ? 1
              : -1;
          case SorterTypes.anti_alphabetical:
            return Base1.identifier.toLowerCase() <
              Base2.identifier.toLowerCase()
              ? 1
              : -1;
          case SorterTypes.distance:
            return getDistance(
              {latitude: Base1.latitude, longitude: Base1.longitude},
              {latitude: myLatitude, longitude: MyLongitude},
            ) >
              getDistance(
                {latitude: Base2.latitude, longitude: Base2.longitude},
                {latitude: myLatitude, longitude: MyLongitude},
              )
              ? 1
              : -1;
        }
        break;
      case SorterKey.country:
        switch (sorting) {
          case SorterTypes.alphabetical:
            if (Base1.country == null && Base2.country == null) {
              return 0;
            }
            if (Base1.country == null) {
              return 1;
            }
            if (Base2.country == null) {
              return -1;
            }
            return Base1.country.toLowerCase() > Base2.country.toLowerCase()
              ? 1
              : -1;
          case SorterTypes.anti_alphabetical:
            if (Base1.country == null && Base2.country == null) {
              return 0;
            }
            if (Base1.country == null) {
              return 1;
            }
            if (Base2.country == null) {
              return -1;
            }
            return Base1.country.toLowerCase() < Base2.country.toLowerCase()
              ? 1
              : -1;
          case SorterTypes.distance:
            return getDistance(
              {latitude: Base1.latitude, longitude: Base1.longitude},
              {latitude: myLatitude, longitude: MyLongitude},
            ) >
              getDistance(
                {latitude: Base2.latitude, longitude: Base2.longitude},
                {latitude: myLatitude, longitude: MyLongitude},
              )
              ? 1
              : -1;
        }
        break;
      case SorterKey.mountpoint:
        switch (sorting) {
          case SorterTypes.alphabetical:
            return Base1.mountpoint.toLowerCase() >
              Base2.mountpoint.toLowerCase()
              ? 1
              : -1;
          case SorterTypes.anti_alphabetical:
            return Base1.mountpoint.toLowerCase() <
              Base2.mountpoint.toLowerCase()
              ? 1
              : -1;
          case SorterTypes.distance:
            return getDistance(
              {latitude: Base1.latitude, longitude: Base1.longitude},
              {latitude: myLatitude, longitude: MyLongitude},
            ) >
              getDistance(
                {latitude: Base2.latitude, longitude: Base2.longitude},
                {latitude: myLatitude, longitude: MyLongitude},
              )
              ? 1
              : -1;
        }
    }
  };

//filter for bases
const filter = (selectedSorterType: SorterKey, searchText: string) => item => {
  switch (selectedSorterType) {
    case SorterKey.city:
      return item.identifier.toLowerCase().includes(searchText.toLowerCase());
    case SorterKey.country:
      if (item.country != null) {
        return item.country.toLowerCase().includes(searchText.toLowerCase());
      } else {
        return false;
      }
    case SorterKey.mountpoint:
      return item.mountpoint.toLowerCase().includes(searchText.toLowerCase());
  }
};

const sortertypesIcon = (sorting: SorterTypes) => {
  switch (sorting) {
    case SorterTypes.alphabetical:
      return 'sort-alphabetical-ascending';
    case SorterTypes.anti_alphabetical:
      return 'sort-alphabetical-descending';
    case SorterTypes.distance:
      return 'map-marker-distance';
  }
};

const cycleSortertypes = (
  type: SorterTypes,
  setsortingFilter: React.Dispatch<React.SetStateAction<SorterTypes>>,
) => {
  switch (type) {
    case SorterTypes.alphabetical:
      setsortingFilter(SorterTypes.anti_alphabetical);
      break;
    case SorterTypes.anti_alphabetical:
      setsortingFilter(SorterTypes.distance);
      break;
    case SorterTypes.distance:
      setsortingFilter(SorterTypes.alphabetical);
      break;
  }
};

const sorterTypeData = [
  {label: 'City', value: SorterKey.city},
  {label: 'Country', value: SorterKey.country},
  {label: 'Mountpoint', value: SorterKey.mountpoint},
];

export default observer(function CasterScreen({navigation}: Props) {
  // our hooks and enums
  const mockBase = new Base(new SourceTable('none', 2101, 'none', 'none'), []);
  const store = useStoreContext();
  const [searchText, onChangeSearch] = useState('');
  const [favs, setFavsFilter] = useState(true); //show favorites
  const [sorting, setsortingFilter] = useState(SorterTypes.distance); //sorter type selected
  const [selectedSorterType, setselectedSorterType] = useState(
    SorterKey.mountpoint,
  ); //sorter key selected
  const [isInfoVisible, setInfoVisible] = useState(false);
  const [selectedBase, setSelectedBase] = useState(mockBase);
  const [isPressed, setIsPressed] = useState(false);
  var refreshList = false;

  React.useEffect(() => {
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return navigation.addListener('focus', () => {
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
    });
  }, [navigation, store.basePool, store.casterPool]);

  const filteredBaseList = store.basePool.baseList.filter(
    filter(selectedSorterType, searchText),
  );

  const sortedBaseList = filteredBaseList.sort(
    sorter(selectedSorterType, sorting),
  );

  function showBaseInfo(item) {
    setSelectedBase(item);
    toogleInfo();
  }

  const itemOnConnect = (item: Base) => () => {
    store.casterConnection.configureConnection(
      item.parentSourceTable.adress,
      item.parentSourceTable.port,
      item.mountpoint,
      item.parentSourceTable.username,
      item.parentSourceTable.password,
    );
    console.log(store.casterConnection.options);
  };

  const toogleInfo = () => {
    setInfoVisible(!isInfoVisible);
  };
  const renderBaseModal = () => {
    const base = selectedBase;
    return (
      <Modal
        style={styles.modal}
        isVisible={isInfoVisible}
        onBackButtonPress={toogleInfo}
        onSwipeComplete={toogleInfo}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <View style={styles.headerTab}>
          <Text
            style={{
              marginLeft: 15,
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {base.mountpoint}
          </Text>
        </View>
        <View style={styles.container}>
          <ScrollView>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            />
            <View style={styles.container}>
              <View style={styles.chipsContainer}>
                <Chip style={styles.chip} icon="dns">
                  Identifier : {base.identifier}
                </Chip>
                <Chip style={styles.chip} icon="account-key">
                  Authentification : {base.authentification}
                </Chip>
                <Chip style={styles.chip} icon="arrow-u-left-top-bold">
                  VRS : {String(String(base.nmea))}
                </Chip>
                <Chip style={styles.chip} icon="earth">
                  Country : {base.country}
                </Chip>
                <Chip style={styles.chip} icon="wallet">
                  Fee : {String(base.fee)}
                </Chip>
                <Chip style={styles.chip} icon="vector-triangle">
                  Network of base : {String(base.solution)}
                </Chip>
                <Chip style={styles.chip} icon="human-queue">
                  Network : {base.network}
                </Chip>
              </View>
              <View style={styles.baseText}>
                <Paragraph style={styles.baseText}>
                  Position : {base.latitude}, {base.longitude}
                </Paragraph>
                <Paragraph style={styles.baseText}>
                  Bitrate : {base.bitrate} bits per second
                </Paragraph>
                <Paragraph style={styles.baseText}>
                  Network : {base.network}
                </Paragraph>
                <Paragraph style={styles.baseText}>
                  Format : {base.format + ' (' + base.formatDetails + ')'}
                </Paragraph>
                <Paragraph style={styles.baseText}>
                  Carrier : {base.carrier}
                </Paragraph>
                <Paragraph style={styles.baseText}>
                  NavSystem : {base.navSystem}
                </Paragraph>
                <Paragraph style={styles.baseText}>
                  Compression : {base.compression}
                </Paragraph>
                <Paragraph style={styles.baseText}>
                  Misc : {base.misc}
                </Paragraph>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  //how is the item shown in list
  const Item = ({item}) => (
    <TouchableWithoutFeedback
      delayLongPress={300}
      onLongPress={() => showBaseInfo(item)}
      onPress={itemOnConnect(item)}>
      <View style={styles.item}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item.country == null ? (
              <MaterialCommunityIcons
                name="map-marker-question-outline"
                color={'white'}
                size={30}
              />
            ) : (
              <CountryFlag isoCode={item.country} size={21} />
            )}
            <Text style={styles.title}>{'  ' + item.mountpoint}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{fontStyle: 'italic', fontSize: 15, color: 'lightgrey'}}>
              {limitCityName(item.identifier)}
            </Text>
            <Text
              style={{
                fontStyle: 'italic',
                fontSize: 15,
                color: 'darksalmon',
              }}>
              {' '}
              {Math.floor(
                getDistance(
                  {latitude: item.latitude, longitude: item.longitude},
                  {latitude: myLatitude, longitude: MyLongitude},
                ) / 1000,
              )}{' '}
              km
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Pressable
              onPress={() => {
                showBaseInfo(item);
              }}>
              <MaterialIcons name="more-horiz" color={'white'} size={40} />
            </Pressable>
          </View>
          <View style={{marginLeft: 10}}>
            <Pressable onPress={itemOnConnect(item)}>
              <MaterialCommunityIcons
                name="connection"
                color="green"
                size={40}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderItem = ({item}) => <Item item={item} />;

  //rendering header
  const renderFilterView = () => {
    return (
      <View>
        {/*Research bar*/}
        <Searchbar
          style={styles.textinput}
          onChangeText={newText => onChangeSearch(newText)}
          placeholder="Caster identifier ..."
          placeholderTextColor={'white'}
          value={searchText}
        />

        <View style={{marginBottom: 15, flexDirection: 'row'}}>
          <Pressable
            style={styles.sortButton}
            onPress={() => {
              cycleSortertypes(sorting, setsortingFilter);
            }}>
            <MaterialCommunityIcons
              name={sortertypesIcon(sorting)}
              color="white"
              size={30}
            />
          </Pressable>
          <View
            style={{
              flex: 3,
              alignContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginLeft: 5, flex: 1}}>
              <Dropdown
                renderRightIcon={() => (
                  <MaterialCommunityIcons
                    name="filter-menu"
                    color="white"
                    size={28}
                    style={{marginRight: 5}}
                  />
                )}
                placeholderStyle={{fontSize: 16}}
                selectedTextStyle={{fontSize: 16, color: 'white'}}
                inputSearchStyle={{height: 40, fontSize: 16}}
                style={styles.dropdown}
                data={sorterTypeData}
                activeColor="#444444"
                itemContainerStyle={{backgroundColor: '#222222'}}
                itemTextStyle={{color: 'white'}}
                valueField="value"
                labelField="label"
                maxHeight={300}
                value={selectedSorterType}
                onChange={item => {
                  setselectedSorterType(item.value);
                }}
              />
            </View>
          </View>
          <Pressable
            style={styles.sortButton}
            onPress={() => {
              setFavsFilter(!favs);
            }}>
            <MaterialCommunityIcons
              name="star"
              color={favs ? 'yellow' : 'darkgrey'}
              size={30}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const HeaderMoreButton = () => {
    navigation.navigate('CasterPoolScreen');
  };

  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text
          style={{
            marginLeft: 15,
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Caster Screen
        </Text>
        <Pressable style={styles.TabButton} onPress={HeaderMoreButton}>
          <MaterialIcons name="library-add" color={'white'} size={25} />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      {renderFilterView()}
      {renderBaseModal()}

      {/*Filtered list display*/}
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
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  item: {
    backgroundColor: '#3F4141',
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
