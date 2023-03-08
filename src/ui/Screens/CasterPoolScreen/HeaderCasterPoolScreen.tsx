import {Pressable, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {styles} from './CasterPoolScreen';

interface HeaderCasterPoolScreenProps {
  toogleForm;
}
export default function HeaderCasterPoolScreen({
  toogleForm,
}: HeaderCasterPoolScreenProps) {
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
        onPress={() => {
          toogleForm();
        }}>
        <MaterialIcons name="add" color={'white'} size={25} />
      </Pressable>
    </View>
  );
}
