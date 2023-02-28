import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  RefreshControl,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FlashList} from '@shopify/flash-list';
import CountryFlag from 'react-native-country-flag';

import {getDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';

import {Searchbar} from 'react-native-paper';
import {useStoreContext} from './Store';
import {observer} from 'mobx-react-lite';

let myLatitude = 45.184434;
let MyLongitude = 5.75397;

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

const limitCityName = (name: string) => {
  if (name.length < 20) {
    return name;
  }
  return name.substring(0, 20) + '...';
};

const itemOnPress = () => {
  Alert.alert('TODO');
};

const Item = ({mountpoint, country, identifier, latitude, longitude}) => (
  <View style={styles.item}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {country == null ? (
            <MaterialCommunityIcons
              name="map-marker-question-outline"
              color={'white'}
              size={30}
            />
          ) : (
            <CountryFlag isoCode={country} size={21} />
          )}
          <Text style={styles.title}>{'  ' + mountpoint}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontStyle: 'italic', fontSize: 15, color: 'lightgrey'}}>
            {limitCityName(identifier)}
          </Text>
          <Text
            style={{fontStyle: 'italic', fontSize: 15, color: 'darksalmon'}}>
            {' '}
            {Math.floor(
              getDistance(
                {latitude: latitude, longitude: longitude},
                {latitude: myLatitude, longitude: MyLongitude},
              ) / 1000,
            )}{' '}
            km
          </Text>
        </View>
      </View>
      <Pressable onPress={itemOnPress}>
        <Text style={{color: 'white', fontSize: 25}}>...</Text>
      </Pressable>
    </View>
  </View>
);

interface Props {
  navigation: any;
}

export default observer(function CasterScreen({navigation}: Props) {
  // our hooks and enums
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
  const store = useStoreContext();
  const [searchText, onChangeSearch] = useState('');
  const [favs, setFavsFilter] = useState(true); //show favorites
  const [sorting, setsortingFilter] = useState(SorterTypes.distance); //sorter type selected
  const [selectedSorterType, setselectedSorterType] = useState(
    SorterKey.mountpoint,
  ); //sorter key selected
  const [isFocus, setIsFocus] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const sorterTypeData = [
    {label: 'City', value: SorterKey.city},
    {label: 'Country', value: SorterKey.country},
    {label: 'Mountpoint', value: SorterKey.mountpoint},
  ];

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      store.basePool.generate(store.casterPool);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, store.basePool, store.casterPool]);

  //filter for bases
  const filter = item => {
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

  const filteredBaseList = store.basePool.baseList.filter(filter);

  const sorter = (Base1, Base2) => {
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

  const sortedBaseList = filteredBaseList.sort(sorter);

  //how is the item shown in list

  const renderItem = ({item}) => (
    <Item
      mountpoint={item.mountpoint}
      country={item.country}
      identifier={item.identifier}
      latitude={item.latitude}
      longitude={item.longitude}
    />
  );

  const sortertypesIcon = () => {
    switch (sorting) {
      case SorterTypes.alphabetical:
        return 'sort-alphabetical-ascending';
      case SorterTypes.anti_alphabetical:
        return 'sort-alphabetical-descending';
      case SorterTypes.distance:
        return 'map-marker-distance';
    }
  };

  const cycleSortertypes = (type: SorterTypes) => {
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
              cycleSortertypes(sorting);
            }}>
            <MaterialCommunityIcons
              name={sortertypesIcon()}
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
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    color: 'white',
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
});
