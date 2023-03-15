import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {Button, RadioButton, RadioGroup, Slider} from 'react-native-ui-lib';

interface Props {
  navigation: any;
}

export default function CasterSettingsScreen({navigation}: Props) {
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
          Settings Screen
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <View style={{padding: 25}}>
        <Slider
          value={0}
          minimumValue={0}
          maximumValue={10}
          onValueChange={() => console.log('value changed')}
        />
        <RadioGroup
          initialValue={'yes'}
          onValueChange={() => console.log('YES')}>
          <RadioButton value={'yes'} label={'NTRIPV1'} />
          <RadioButton value={'no'} label={'NTRIPV2'} />
        </RadioGroup>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  TabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
