import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, FlatList, StatusBar, StyleSheet, Pressable } from "react-native";
import SourceTable from "../../fc/Caster/SourceTable";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryFlag from "react-native-country-flag";
import { countryToAlpha2 } from "country-to-iso";
import { RadioButton } from 'react-native-paper';

let DATA = [];    //data from sourcetable

export async function getCasterData() {
  /**
   * Allows caster screen to refresh its datas
   */
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
  DATA = dataList;
}

const CasterScreen = () => {
  // refreshing datas
  useEffect(() => {
    try{
      getCasterData();
    }catch(e){
      console.log(e);
    }
  }, []);
  
  // our hooks and enums
  enum SorterKey {city='city', country='country', mountpoint='mountpoint'}
  enum SorterTypes { anti_alphabetical,alphabetical, distance}
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, onChangeSearch] = useState('');
  const [filterTarget, setFilterTarget] = useState('city');       //sorter key selected
  const [favs, setFavsFilter] = useState(true);                   //show favorites
  const [sorting, setsortingFilter] = useState(SorterTypes.alphabetical); //sorter type selected

  //used to filter items by sorter key
  useEffect(() => {
      const filtered = DATA.filter(item => {
        switch (filterTarget) {
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
      });
      if (searchText === '') {
        return setFilteredData(DATA);
      }
      setFilteredData(filtered);
  }, [searchText]);

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

  //Array of [n,v] where n are names of sorting keys and v the value of the key when selected
  let RadioButtonsFilter = [['By City', SorterKey.city], ['By Country', SorterKey.country], ['By Mountpoint', SorterKey.mountpoint]];

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
    <View style={{alignSelf: 'flex-start', alignContent: 'center'}}>
      <Text style={{marginTop: 15, alignSelf: 'center'}}>Filter :</Text>
      <RadioButton.Group onValueChange={newValue => setFilterTarget(newValue)} value={filterTarget}>
        {/*displays every radio button for sorting keys*/}
        <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginLeft: 20}}>
          {RadioButtonsFilter.map((item,index)=>{
            return (<View key={index} style={{flexDirection: 'row'}}>
                      <RadioButton value={item[1]} />
                      <Text style={{alignSelf: 'center'}}>{item[0]}</Text>
                    </View>)})}
        </View>
      </RadioButton.Group>
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
});

export default CasterScreen;