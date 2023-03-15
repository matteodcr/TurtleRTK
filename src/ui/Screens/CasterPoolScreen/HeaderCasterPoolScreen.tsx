import {Pressable, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {styles} from './CasterPoolScreen';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../fc/Store';

interface HeaderCasterPoolScreenProps {
  toogleForm;
}
export default observer(function HeaderCasterPoolScreen({
  toogleForm,
}: HeaderCasterPoolScreenProps) {
  const store = useStoreContext();
  return (
    <View style={styles.headerTab}>
      <Text
        style={{
          marginLeft: 15,
          fontSize: 18,
          fontWeight: 'bold',
          color: 'white',
        }}>
        Manage casters
      </Text>
      <Pressable
        style={styles.TabButton}
        onPress={() => store.casterPool.setTyping(true)}>
        <MaterialIcons name="add" color={'white'} size={25} />
      </Pressable>
    </View>
  );
});
