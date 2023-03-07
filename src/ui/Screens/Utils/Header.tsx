import {Pressable, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {styles} from '../CasterScreen/CasterScreen';

interface HeaderProps {
  navigation;
}

export default function Header({navigation}: HeaderProps) {
  const HeaderButton = () => {
    navigation.navigate('CasterPoolScreen');
  };
  return (
    <View style={styles.headerTab}>
      <Text
        style={{
          marginLeft: 15,
          fontSize: 18,
          fontWeight: 'bold',
          color: 'white',
        }}>
        Caster Screen
      </Text>
      <Pressable style={styles.TabButton} onPress={HeaderButton}>
        <MaterialIcons name="library-add" color={'white'} size={25} />
      </Pressable>
    </View>
  );
}
