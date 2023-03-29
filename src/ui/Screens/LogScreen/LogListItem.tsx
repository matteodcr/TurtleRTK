import {Pressable, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../fc/Store';
import {styles} from '../CasterScreen/CasterScreen';
import {ReadDirItem} from 'react-native-fs';
import {Colors, Drawer} from 'react-native-ui-lib';
export interface ItemProp {
  item: ReadDirItem;
  modifySelectedLog: (string) => void;
}

export default observer(function BaseListItem({
  item,
  modifySelectedLog,
}: ItemProp) {
  const store = useStoreContext();

  return (
    <Drawer
      rightItems={[
        {
          text: 'Delete',
          background: Colors.red30,
          onPress: () => {
            store.logManager.delete(item.path);
            store.logManager.getLogs();
          },
        },
      ]}>
      <Pressable
        delayLongPress={300}
        // onLongPress={() => showBaseInfo(item)}
        onPress={() => {
          console.log(item.path);
          store.logManager.getFile(item.path);
          console.log(store.logManager.currentFile.infos);
          modifySelectedLog(item.path);
        }}>
        <View style={styles.item}>
          <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {
                <MaterialCommunityIcons
                  name="file-marker-outline"
                  color={'white'}
                  size={30}
                />
              }
              <Text style={styles.title}>{'  ' + item.name}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons
                name="clock-time-eight-outline"
                color={'white'}
                size={15}
              />
              <Text
                style={{
                  fontStyle: 'italic',
                  fontSize: 15,
                  color: 'darksalmon',
                }}>
                {' ' + item.mtime}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Pressable
                onPress={() => {
                  console.log(item.path);
                  store.logManager.getFile(item.path);
                  console.log(store.logManager.currentFile.infos);
                  modifySelectedLog(item.path);
                }}>
                <MaterialIcons name="more-horiz" color={'white'} size={40} />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Drawer>
  );
});
