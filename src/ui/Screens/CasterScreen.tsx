import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, FlatList, StatusBar, StyleSheet, Pressable } from "react-native";
import SourceTable from "../../fc/Caster/SourceTable";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryFlag from "react-native-country-flag";
import { countryToAlpha2 } from "country-to-iso";
import { Dropdown } from 'react-native-element-dropdown';

const CasterScreen = () => {

  //Allows caster screen to refresh its datas
  async function getCasterData() {
  
    let st: SourceTable = new SourceTable("http://caster.centipede.fr:2101/");
    try{
      st.entries = await st.getSourceTable();
    }catch(e){
      console.log(e);
    }
    let dataList=[];
    for(var base of st.entries.baseList){
        dataList.push({key: base.identifier+':'+base.mountpoint, 
                      title: base.mountpoint, 
                      country: countryToAlpha2(base.country),
                      identifier: base.identifier})
    }
    setDATA(dataList);
  }

  //filter for bases
  const filter = (item) => {
    switch (selectedSorterType) {
      case SorterKey.city :
        return item.identifier.toLowerCase().includes(searchText.toLowerCase());
      case SorterKey.country :
        if(item.country!=null){
          return item.country.toLowerCase().includes(searchText.toLowerCase());
        }else{
          return false;
        }
      case SorterKey.mountpoint :
        return item.title.toLowerCase().includes(searchText.toLowerCase());            
    }
  }

  // refreshing datas
  useEffect(() => {
    console.log('test1');
    try{
      getCasterData();
    }catch(e){
      console.log(e);
    }
  }, []);
  
  // our hooks and enums
  enum SorterKey {city='city', country='country', mountpoint='mountpoint'}
  enum SorterTypes { anti_alphabetical,alphabetical, distance}
  const [DATA, setDATA] = useState([]);                           //data from sourcetable
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, onChangeSearch] = useState('');
  const [favs, setFavsFilter] = useState(true);                   //show favorites
  const [sorting, setsortingFilter] = useState(SorterTypes.alphabetical);               //sorter type selected
  const [selectedSorterType, setselectedSorterType] = useState(SorterKey.mountpoint);   //sorter key selected
  const [isFocus, setIsFocus] = useState(false);

  const sorterTypeData = [
    { label: 'By City', value: SorterKey.city },
    { label: 'By Country', value: SorterKey.country },
    { label: 'By Mountpoint', value: SorterKey.mountpoint },
  ];

  //used to filter items by sorter key
  useEffect(() => {
      const filtered = DATA.filter(filter);
      if (searchText === '') {
        return setFilteredData(DATA);
      }
      setFilteredData(filtered);
  }, [searchText, selectedSorterType, DATA]);

  //how is the item shown in list
  const Item = ({title, country, identifier}) => (
      <View style={styles.item}>
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        {country==null ? 
            <Icon name="map-marker-question-outline" color={'white'} size={30} /> :
            <CountryFlag isoCode={country} size={21} />}
          <Text style={styles.title}>{'  '+title}</Text>
        </View>
        <Text style={{fontStyle: 'italic', fontSize: 15, color: 'lightgrey'}}>{identifier}</Text>
      </View>
  );

  const renderItem = ({item}) => <Item title={item.title} country={item.country} identifier={item.identifier} />;

  return (
    <SafeAreaView style={styles.container}>

    {/*Sorting types selection*/}
    <View style={{ flexDirection: 'row'}}>
      <Pressable style={styles.sortButton} onPress={() => {setsortingFilter(SorterTypes.alphabetical)}}>
        <Icon name="sort-alphabetical-ascending" color={sorting==SorterTypes.alphabetical ? 'white' :'darkgrey'} size={30} />
      </Pressable>
      <Pressable style={styles.sortButton} onPress={() => {setsortingFilter(SorterTypes.anti_alphabetical)}}>
        <Icon name="sort-alphabetical-descending" color={sorting==SorterTypes.anti_alphabetical ? 'white' :'darkgrey'} size={30} />
      </Pressable>
      <Pressable style={styles.sortButton} onPress={() => {setsortingFilter(SorterTypes.distance)}}>
        <Icon name="map-marker-distance" color={sorting==SorterTypes.distance ? 'white' :'darkgrey'} size={30} />
      </Pressable>
      <Pressable style={styles.sortButton} onPress={() => {setFavsFilter(!favs)}}>
        <Icon name="star" color={favs ? 'yellow' :'darkgrey'} size={30} />
      </Pressable>
    </View>

    {/*Sorting keys selection*/}
    <View style={{alignContent: 'center', flexDirection: 'row', marginTop: 15}}>
      <Text style={{alignSelf: 'center', marginLeft: 20}}>Filter key :</Text>
      {/*displays every radio button for sorting keys*/}
      <View style={{marginLeft: 20, flex: 1, marginRight: 20}}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'white' }]}
          placeholderStyle={{fontSize: 16}}
          selectedTextStyle={{fontSize: 16}}
          inputSearchStyle={{height: 40, fontSize: 16}}
          iconStyle={{backgroundColor: 'invisible'}}
          data={sorterTypeData}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={selectedSorterType}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setselectedSorterType(item.value);
            setIsFocus(false);
          }}
          
        />
      </View>
    </View>

    {/*Research bar*/}
    <TextInput
        style={{
        height: 50,
        borderColor: '#919191',
        borderWidth: 1,
        margin: 10,
        paddingLeft: 15,
        borderRadius: 10,
        }}
        onChangeText={newText => onChangeSearch(newText)}
        placeholder="Caster identifier ..."
    />
    
    {/*Filtered list display*/}
    <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.key}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight/2 || 0,
    marginBottom: 75,
  },
  item: {
    backgroundColor: '#ededed',
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
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    alignItems: 'center'
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});

export default CasterScreen;