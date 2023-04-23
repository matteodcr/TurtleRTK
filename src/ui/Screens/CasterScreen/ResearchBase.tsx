import Base from '../../../fc/Caster/Base';
import {getDistance} from 'geolib';
import React from 'react';
import {Pressable, View} from 'react-native';
import {Searchbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';
import {styles} from './CasterScreen';
import {AppStore, useStoreContext} from '../../../fc/Store';

export enum SorterKey {
  city = 'city',
  country = 'country',
  mountpoint = 'mountpoint',
}
export enum SorterTypes {
  anti_alphabetical,
  alphabetical,
  distance,
}
export const sorter =
  (
    selectedSorterType: SorterKey,
    sorting: SorterTypes,
    latitude: number,
    longitude: number,
  ) =>
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
              {latitude: latitude, longitude: longitude},
            ) >
              getDistance(
                {latitude: Base2.latitude, longitude: Base2.longitude},
                {latitude: latitude, longitude: longitude},
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
              {latitude: latitude, longitude: longitude},
            ) >
              getDistance(
                {latitude: Base2.latitude, longitude: Base2.longitude},
                {latitude: latitude, longitude: longitude},
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
              {latitude: latitude, longitude: longitude},
            ) >
              getDistance(
                {latitude: Base2.latitude, longitude: Base2.longitude},
                {latitude: latitude, longitude: longitude},
              )
              ? 1
              : -1;
        }
    }
  };

export const filter =
  (
    store: AppStore,
    selectedSorterType: SorterKey,
    searchText: string,
    latitude: number,
    longitude: number,
  ) =>
  item => {
    if (store.basePool.favs) {
      if (store.basePool.favoriteList.includes(item.key)) {
        if (store.basePool.favsDisplayDistance) {
          switch (selectedSorterType) {
            case SorterKey.city:
              return item.identifier
                .toLowerCase()
                .includes(searchText.toLowerCase());
            case SorterKey.country:
              if (item.country != null) {
                return item.country
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
              } else {
                return false;
              }
            case SorterKey.mountpoint:
              return item.mountpoint
                .toLowerCase()
                .includes(searchText.toLowerCase());
          }
        } else if (
          getDistance(
            {latitude: item.latitude, longitude: item.longitude},
            {latitude: latitude, longitude: longitude},
          ) /
            1000 <=
          store.basePool.distance
        ) {
          switch (selectedSorterType) {
            case SorterKey.city:
              return item.identifier
                .toLowerCase()
                .includes(searchText.toLowerCase());
            case SorterKey.country:
              if (item.country != null) {
                return item.country
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
              } else {
                return false;
              }
            case SorterKey.mountpoint:
              return item.mountpoint
                .toLowerCase()
                .includes(searchText.toLowerCase());
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      if (
        getDistance(
          {latitude: item.latitude, longitude: item.longitude},
          {latitude: latitude, longitude: longitude},
        ) /
          1000 <=
        store.basePool.distance
      ) {
        switch (selectedSorterType) {
          case SorterKey.city:
            return item.identifier
              .toLowerCase()
              .includes(searchText.toLowerCase());
          case SorterKey.country:
            if (item.country != null) {
              return item.country
                .toLowerCase()
                .includes(searchText.toLowerCase());
            } else {
              return false;
            }
          case SorterKey.mountpoint:
            return item.mountpoint
              .toLowerCase()
              .includes(searchText.toLowerCase());
        }
      } else {
        return false;
      }
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

export interface ResearchBaseProps {
  search: string;
  modifySearch: (string) => void;
  sorterFilter: SorterTypes;
  modifySorterFilter: (SorterTypes) => void;
  selectedSorter: SorterKey;
  modifySelectedSorter: (SorterKey) => void;
}

export default function ResearchBase({
  search,
  modifySearch,
  sorterFilter,
  modifySorterFilter,
  selectedSorter,
  modifySelectedSorter,
}: ResearchBaseProps) {
  const store = useStoreContext();
  return (
    <View>
      {/*Research bar*/}
      <Searchbar
        style={{
          height: 50,
          borderWidth: 1,
          margin: 10,
          paddingLeft: 15,
          borderRadius: 10,
          color: 'white',
        }}
        onChangeText={newText => modifySearch(newText)}
        placeholder="Search"
        placeholderTextColor={'white'}
        value={search}
      />

      <View style={{marginBottom: 15, flexDirection: 'row'}}>
        <Pressable
          style={styles.sortButton}
          onPress={() => {
            cycleSortertypes(sorterFilter, modifySorterFilter);
          }}>
          <MaterialCommunityIcons
            name={sortertypesIcon(sorterFilter)}
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
              value={selectedSorter}
              onChange={item => {
                modifySelectedSorter(item.value);
              }}
            />
          </View>
        </View>
        <Pressable
          style={styles.sortButton}
          onPress={() => {
            store.basePool.setFavs();
          }}>
          <MaterialCommunityIcons
            name="star"
            color={store.basePool.favs ? 'yellow' : 'darkgrey'}
            size={30}
          />
        </Pressable>
      </View>
    </View>
  );
}

const sorterTypeData = [
  {label: 'City', value: SorterKey.city},
  {label: 'Country', value: SorterKey.country},
  {label: 'Mountpoint', value: SorterKey.mountpoint},
];
