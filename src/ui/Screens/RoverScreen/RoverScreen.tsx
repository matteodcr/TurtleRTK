import React from 'react';
import { Checkbox} from 'react-native-paper';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStoreContext } from '../../../fc/Store';
import ErrorPopUp, { ErrorType } from './BLE/ErrorPopUp';
import HeaderRoverScreen from './BLE/HeaderRoverScreen';
import PeripheralList from './BLE/PeripheralList';


interface RoverScreenProps {
  navigation,
}

export default observer(function RoverScreen({navigation}:RoverScreenProps){
  
  const store = useStoreContext();
  
  return (
    <SafeAreaView style={styles.container}>
      <HeaderRoverScreen/>
      <ErrorPopUp error={ErrorType.BLUETOOTH} title={"Bluetooth deactivated"} desc={"Please enable bluetooth for scanning peripherals."}/>
      <ErrorPopUp error={ErrorType.LOCALISATION} title={"Localisation deactivated"} desc={"Please enable localisation for scanning peripherals."}/>
      <View style = {styles.sortButton}>
        <Text style={{color: 'white', fontSize: 15}}>Display devices with no name : </Text>
        <Checkbox
          status={store.bluetoothManager.displayNoNameDevices ? 'checked' : 'unchecked'}
          onPress={() => {
            store.bluetoothManager.setDisplayNoNameDevices(!store.bluetoothManager.displayNoNameDevices);
          }}
        />
      </View>
      <Text style={{color: 'white', fontSize: 20, textAlign: 'center', marginVertical: 15}}>Périphériques BLE à proximité :</Text>
      <PeripheralList navigation={navigation}/>
    </SafeAreaView>
  );
}
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
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
    }
  });
