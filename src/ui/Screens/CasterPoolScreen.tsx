import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Alert,
  Pressable,
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CasterPool, {CasterPoolEntry} from '../../fc/Caster/CasterPool';
import SourceTable from '../../fc/Caster/SourceTable';

const CasterPoolScreen = () => {
  const casterPool: CasterPool = new CasterPool();
  casterPool.addCaster(
    new SourceTable('caster.centipede.fr'),
    'centipede',
    'centipede',
  );
  casterPool.addCaster(new SourceTable('rtk2go.com'), 'centipede', 'centipede');
  casterPool.addCaster(new SourceTable('caster.rus'), 'centipede', 'centipede');
  casterPool.unsubscribe(new SourceTable('caster.rus'));
  const [subscribed, setSubscribed] = useState<CasterPoolEntry[]>([]);
  const [unsubscribed, setUnsubscribed] = useState<CasterPoolEntry[]>([]);

  useEffect(() => {
    try {
      setSubscribed(casterPool.subscribed);
      setUnsubscribed(casterPool.unsubscribed);
    } catch (e) {
      console.log(e);
    }
  }, []);

  function formatData() {
    return [
      {
        title: 'Active casters',
        data: subscribed,
      },
      {
        title: 'Saved casters',
        data: unsubscribed,
      },
    ];
  }

  function showCasterInfo(item:CasterPoolEntry){
    return(
      Alert.alert('TODO')
    )
  }

  function upArrow(item:CasterPoolEntry){
    setUnsubscribed(unsubscribed.filter((i) => i!=item));
    setSubscribed(subscribed => [...subscribed, item]);
  }

  function downArrow(item:CasterPoolEntry){
    setSubscribed(subscribed.filter((i) => i!=item));
    setUnsubscribed(unsubscribed => [...unsubscribed, item]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={formatData()}
        keyExtractor={(item, index) => item.sourceTable.adress + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.sourceTable.adress}</Text>
            <View style={{marginRight: 10, flexDirection: 'row'}}>
              {unsubscribed.includes(item) ? 
              <Pressable style={{padding: 3}} onPress={() => {upArrow(item)}}>
                <MaterialIcons name="arrow-upward" color={'#5bcf70'} size={25} />
              </Pressable> :
              <Pressable style={{padding: 3}} onPress={() => {downArrow(item)}}>
                <MaterialIcons name="arrow-downward" color={'#d43f35'} size={25} />
              </Pressable>}
              <Pressable style={{padding: 3}} onPress={() => {showCasterInfo(item)}}>
                <MaterialIcons name="info" color={'white'} size={25} />
              </Pressable>
            </View>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
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
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
  },
  header: {
    fontSize: 25,
    color: 'white',
    marginLeft: 15,
    paddingTop: 20,
    paddingBottom: 5,
  },

  title: {
    marginHorizontal: 10,
    backgroundColor: '#3F4141',
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

export default CasterPoolScreen;
