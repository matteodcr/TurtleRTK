import {Pressable, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';

const HeaderMoreButton = () => {
  navigation.navigate('CasterPoolScreen');
};

const renderHeaderTab = () => {
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
      <Pressable style={styles.TabButton} onPress={HeaderMoreButton}>
        <MaterialIcons name="library-add" color={'white'} size={25} />
      </Pressable>
    </View>
  );
};
