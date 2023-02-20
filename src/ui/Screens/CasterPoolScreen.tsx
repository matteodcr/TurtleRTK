import React, {useEffect, useState} from 'react';
import {
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

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={formatData()}
        keyExtractor={(item, index) => item.sourceTable.adress + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.sourceTable.adress}</Text>
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
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#222',
  },
  item: {
    backgroundColor: '#3F4141',
    padding: 20,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  header: {
    fontSize: 32,
    color: 'white',
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
