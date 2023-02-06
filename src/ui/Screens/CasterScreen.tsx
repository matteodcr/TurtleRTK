import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, FlatList, StatusBar, StyleSheet } from "react-native";
import Base from "../../fc/Caster/Base";
import Caster from "../../fc/Caster/Caster";
import Network from "../../fc/Caster/Network";
import SourceTable, { SourceTableEntries } from "../../fc/Caster/SourceTable";

let DATA = [];
    
export async function getCasterData() {
  let st: SourceTable = new SourceTable("http://caster.centipede.fr:2101/");
    try{
      st.entries = await st.getSourceTable();
    }catch(e){
      console.log(e);
    }
    let dataList=[];
    for(var base of st.entries.baseList){
        dataList.push({title: base.mountpoint})
    }
    DATA = dataList;
}

const CasterScreen = () => {

    useEffect(() => {
      try{
        getCasterData();
      }catch(e){
        console.log(e);
      }
    }, []);
    
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, onChangeSearch] = useState('');

    useEffect(() => {
        const filtered = DATA.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()),
        );
        if (searchText === '') {
        return setFilteredData(DATA);
        }

        setFilteredData(filtered);
    }, [searchText]);

    const Item = ({title}) => (
        <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        </View>
    );

    const renderItem = ({item}) => <Item title={item.title} />;

    return (
        <SafeAreaView style={styles.container}>
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
    marginTop: StatusBar.currentHeight || 0,
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
});

export default CasterScreen;