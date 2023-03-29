import {Pressable, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {styles} from './CasterScreen';
import {useStoreContext} from '../../../fc/Store';

interface HeaderProps {
  navigation;
}

export default function HeaderCasterScreen({navigation}: HeaderProps) {
  const HeaderButton = () => {
    navigation.navigate('CasterPoolScreen');
  };
  const store = useStoreContext();

  return (
    <View style={styles.headerTab}>
      <Text
        style={styles.boldText}>
        Caster Screen
      </Text>
      <Pressable style={styles.TabButton} onPress={HeaderButton}>
        <MaterialIcons name="library-add" color={store.settings.darkTheme ? 'white' : 'green'} size={store.settings.bigFontEnabled ? 40 : 25} />
      </Pressable>
    </View>
  );
}
