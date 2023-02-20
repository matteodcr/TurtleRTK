import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StatusBar,
  StyleSheet,
  Pressable,
  RefreshControl,
  Button,
  Alert,
} from 'react-native';
import SourceTable from '../../fc/Caster/SourceTable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CountryFlag from 'react-native-country-flag';
import {Dropdown} from 'react-native-element-dropdown';
import {getDistance} from 'geolib';
import Base from '../../fc/Caster/Base';
const net = require('react-native-tcp-socket');
global.Buffer = global.Buffer || require('buffer').Buffer;

let myLatitude = 45.184434;
let MyLongitude = 5.75397;


const CasterScreen = () => {
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
  const [DATA, setDATA] = useState<Base[]>([]); //data from sourcetable
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

  // refreshing datas
  useEffect(() => {
    try {
      getCasterData();
    } catch (e) {
      console.log(e);
    }
  }, []);

  //Allows caster screen to refresh its datas
  async function getCasterData() {
    let st: SourceTable = new SourceTable('caster.centipede.fr');
    try {
      st.entries = await st.getSourceTable(
        'caster.centipede.fr',
        2101,
        'centipede',
        'centipede',
      );
    } catch (e) {
      console.log(e);
    }
    setDATA(st.entries.baseList);
  }

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

  const filteredBaseList = DATA.filter(filter);

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
      case SorterKey.country:
        switch (sorting) {
          case SorterTypes.alphabetical:
            if (Base1.country == null && Base2.country == null) return 0;
            if (Base1.country == null) return 1;
            if (Base2.country == null) return -1;
            return Base1.country.toLowerCase() > Base2.country.toLowerCase()
              ? 1
              : -1;
          case SorterTypes.anti_alphabetical:
            if (Base1.country == null && Base2.country == null) return 0;
            if (Base1.country == null) return 1;
            if (Base2.country == null) return -1;
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

  const limitCityName = (name: string) => {
    if (name.length < 20) return name;
    return name.substring(0, 20) + '...';
  };

  const itemOnPress = () => {
    Alert.alert('TODO');
  };

  //how is the item shown in list
  const Item = ({mountpoint, country, identifier, latitude, longitude}) => (
    <View style={styles.item}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {country == null ? (
              <Icon
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
            <Text
              style={{fontStyle: 'italic', fontSize: 15, color: 'lightgrey'}}>
              {limitCityName(identifier)}
            </Text>
            <Text
              style={{fontStyle: 'italic', fontSize: 15, color: 'darksalmon'}}>
              {' '}
              {getDistance(
                {latitude: latitude, longitude: longitude},
                {latitude: myLatitude, longitude: MyLongitude},
              ) / 1000}{' '}
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
  }

  //rendering header
  const renderFilterView = () => {
    return (
      <View>
        {/*Research bar*/}
        <TextInput
          style={styles.textinput}
          onChangeText={newText => onChangeSearch(newText)}
          placeholder="Caster identifier ..."
        />

        <View style={{marginBottom: 15, flexDirection: 'row'}}>
          <Pressable
            style={styles.sortButton}
            onPress={() => {
              cycleSortertypes(sorting);
            }}>
            <Icon name={sortertypesIcon()} color="white" size={30} />
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
                  <Icon
                    name="filter-menu"
                    color="white"
                    size={28}
                    style={{marginRight: 5}}
                  />
                )}
                placeholderStyle={{fontSize: 16}}
                selectedTextStyle={{fontSize: 16}}
                inputSearchStyle={{height: 40, fontSize: 16}}
                style={styles.dropdown}
                data={sorterTypeData}
                activeColor='#444444'
                itemContainerStyle={{backgroundColor: '#222222'}}
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
            <Icon name="star" color={favs ? 'yellow' : 'darkgrey'} size={30} />
          </Pressable>
        </View>
      </View>
    );
  };

  const HeaderMoreButton = () => {
    Alert.alert('TODO Caster');
  };

  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={{marginLeft: 15, fontSize: 18, fontWeight: 'bold'}}>
          Caster Screen
        </Text>
        <Pressable style={styles.TabButton} onPress={HeaderMoreButton}>
          <Text style={{color: 'black', fontSize: 25}}>+</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}

      {renderFilterView()}

      {/*Filtered list display*/}
      <FlatList
        data={sortedBaseList}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        refreshControl={
          <RefreshControl
            refreshing={refreshList}
            onRefresh={() => {
              getCasterData;
            }}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  item: {
    backgroundColor: '#3F4141',
    padding: 20,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
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
  },
  TabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  headerTab: {
    backgroundColor: '#111111',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: '#151515',
    borderBottomWidth: 1,
    height: 50,
    alignItems: 'center'
  }
});

export default CasterScreen;
