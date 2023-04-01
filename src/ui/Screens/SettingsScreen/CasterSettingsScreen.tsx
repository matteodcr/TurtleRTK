import React, {useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet,} from 'react-native';
import {RadioButton, RadioGroup} from 'react-native-ui-lib';
import Slider from '@react-native-community/slider';
import {observer} from 'mobx-react-lite';
import {AppStore, useStoreContext} from '../../../fc/Store';
import { Checkbox} from 'react-native-paper';


interface Props {
  navigation: any;
}

function matchProtocol(store: AppStore, protocol: string) {
  if (protocol === 'NTRIPv2') {
    store.casterPool.setProtocol(false);
  } else {
    store.casterPool.setProtocol(true);
  }
}

export default observer(function CasterSettingsScreen({navigation}: Props) {
  const [sliderValue, setSliderValue] = useState(15);
  const store = useStoreContext();
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
          Caster Settings
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <View style={{padding: 25}}>
        <View style={{marginBottom: 10}}>
          <Text
            style={{
              fontSize: 20,
              color: 'white',
              paddingBottom: 5,
            }}>
            Protocole NTRIP
          </Text>
          <RadioGroup
            initialValue={'NTRIPv1'}
            onValueChange={string => matchProtocol(store, string)}>
            <RadioButton
              value={'NTRIPv1'}
              label={'NTRIPv1'}
              labelStyle={{color: 'white'}}
              containerStyle={{paddingBottom: 8}}
            />
            <RadioButton
              value={'NTRIPv2'}
              label={'NTRIPv2'}
              labelStyle={{color: 'white'}}
            />
          </RadioGroup>
        </View>
        <Text
          style={{
            fontSize: 20,
            color: 'white',
            paddingBottom: 5,
          }}>
          Max NTRIP distance
        </Text>
        <View style={styles.slider}>
          <Text style={{color: 'white'}}>
            searching area : {store.basePool.distance} km
          </Text>
          <Slider
            maximumValue={1000}
            minimumValue={50}
            minimumTrackTintColor="#5215d6"
            maximumTrackTintColor="#000000"
            step={10}
            value={store.basePool.distance}
            onValueChange={sliderValue => store.basePool.setDistance(sliderValue)}
          />
        </View>
        <View style = {styles.sortButton}>
        <Text style={{color: 'white', fontSize: 15}}>Display favorites devices outside of range ? : </Text>
        <Checkbox
          status={store.basePool.favsDisplayDistance ? 'checked' : 'unchecked'}
          onPress={() => {
            store.basePool.setFavsDisplayDistance();
          }}
        />
        </View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  slider: {},
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
  sortButton: {
    flexDirection: 'row',
    backgroundColor: '#151515',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
