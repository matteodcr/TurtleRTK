import {Pressable, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import SourceTable from '../../../fc/Caster/SourceTable';
import {useStoreContext} from '../../../fc/Store';
import {styles} from './CasterPoolScreen';
import {observer} from 'mobx-react-lite';
import {Colors, Drawer} from 'react-native-ui-lib';

interface CasterListItem {
  item: SourceTable;
  showCasterInfo(Caster): void;
}

export default observer(function CasterListItem({
  item,
  showCasterInfo,
}: CasterListItem) {
  const store = useStoreContext();

  function upArrow() {
    store.casterPool.subscribe(item);
  }

  function downArrow() {
    store.casterPool.unsubscribe(item);
  }

  function handleShowCasterInfo() {
    showCasterInfo(item);
  }
  return (
    <Drawer
      rightItems={[
        {
          text: 'Delete',
          background: Colors.red30,
          onPress: () => store.casterPool.removeCaster(item),
        },
      ]}>
      <View style={styles.item}>
        <Text style={styles.title}>{item.adress}</Text>
        <View
          style={{
            marginRight: 10,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          {store.casterPool.findCaster(item, store.casterPool.unsubscribed) !==
          -1 ? (
            <Pressable
              style={{padding: 3}}
              onPress={() => {
                upArrow();
              }}>
              <MaterialIcons name="arrow-upward" color={'#5bcf70'} size={25} />
            </Pressable>
          ) : (
            <Pressable
              style={{padding: 3}}
              onPress={() => {
                downArrow();
              }}>
              <MaterialIcons
                name="arrow-downward"
                color={'#d43f35'}
                size={25}
              />
            </Pressable>
          )}
          <View>
            <Pressable
              style={{padding: 3}}
              onPress={() => {
                handleShowCasterInfo();
              }}>
              <MaterialIcons name="info" color={'white'} size={25} />
            </Pressable>
          </View>
        </View>
      </View>
    </Drawer>
  );
});
