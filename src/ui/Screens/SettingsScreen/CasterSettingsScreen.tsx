import React, {useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {RadioButton, RadioGroup} from 'react-native-ui-lib';
import Slider from '@react-native-community/slider';
import {observer} from 'mobx-react-lite';
import {AppStore, useStoreContext} from '../../../fc/Store';
import {baseStyle} from '../Styles';
const styles = baseStyle;
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
        <Text style={styles.boldText}>Caster Settings</Text>
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
            Value of slider is : {sliderValue}
          </Text>
          <Slider
            maximumValue={1000}
            minimumValue={50}
            minimumTrackTintColor="#5215d6"
            maximumTrackTintColor="#000000"
            step={10}
            value={sliderValue}
            onValueChange={sliderValue => setSliderValue(sliderValue)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
});
