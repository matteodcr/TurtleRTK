import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, FlatList, StatusBar, StyleSheet } from "react-native";
import Caster from "../../fc/Caster/Caster";
import SourceTable from "../../fc/Caster/SourceTable";

let DATA: Array<string>  = [];
    
export async function getCasterData() {
    let st: SourceTable = new SourceTable("http://caster.centipede.fr:2101/");
    st.entries = await st.getSourceTable();
    let dataList: Array<string>;
    for(var caster of st.entries.casterList){
        dataList.push(caster.identifier)
    }
    DATA = dataList;
}

const CasterScreen = () => {
    getCasterData();
    const [searchText, onChangeSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const filtered = DATA.filter(item =>
        item.toLowerCase().includes(searchText.toLowerCase()),
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