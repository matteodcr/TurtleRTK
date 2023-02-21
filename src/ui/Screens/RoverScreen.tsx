import React, {useEffect, useState} from 'react';
import { BleManager, Device, State } from 'react-native-ble-plx';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  LogBox,
} from 'react-native';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

const RoverScreen = () => {
  let BLEmanager = new BleManager();
  const [state, setState] = useState(State.PoweredOff);
  const [devices, setDevices] = useState<Device[]>([]);

  async function reloadStateText(){
    setState(await BLEmanager.state());
    setDevices([]);
    BLEmanager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.log(error);
      }
      else if(device!=null){
        devices.push(device);
        console.log(device.name)
      }
    })
    console.log(devices);
  }

  const HeaderMoreButton = () => {
    reloadStateText();
  };

  const Item = ({item}) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
    </View>
  );
  const renderItem = ({item}) => (
    <Item
      item = {item}
    />
  );

  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={{marginLeft: 15, fontSize: 18, fontWeight: 'bold'}}>
          Rover Screen
        </Text>
        <Pressable style={styles.TabButton} onPress={HeaderMoreButton}>
          <Text style={{color: 'white', fontSize: 25}}>+</Text>
        </Pressable>
      </View>
    );
  };

  
  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <View>
        <Text>{state}</Text>
        <FlatList
          data={devices}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

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
    item: {
      backgroundColor: '#3F4141',
      padding: 20,
      marginVertical: 2,
      marginHorizontal: 10,
      borderRadius: 20,
    },
    headerTab: {
      backgroundColor: '#111111',
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderBottomColor: '#151515',
      borderBottomWidth: 1,
      height: 50,
      alignItems: 'center'
    }
  });

export default RoverScreen;
