import React, {useEffect, useState} from 'react';
import BleManager, {PeripheralInfo} from 'react-native-ble-manager';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid
} from 'react-native';

const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);

const RoverScreen = () => {
  const [peripherals, setPeripherals] = useState(new Map<string, PeripheralInfo>());
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const updatePeripherals = (key, value) => {
    setPeripherals(new Map(peripherals.set(key, value)));
  };

  const scanDevices = () => {
    console.log("peripherals : "+Array.from(peripherals.values()));
    if (!isScanning) {
      try {
        console.log('Scanning...');
        setIsScanning(true);
        BleManager.scan([], 5, false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.log('Scan is stopped');
    console.log('Got ble peripheral', peripherals);
  };

  const handleDisconnectedPeripheral = data => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      updatePeripherals(peripheral.id, peripheral);
    }
    console.log('Disconnected from ' + data.peripheral);
  };

  const handleUpdateValueForCharacteristic = data => {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  };

  const handleDiscoverPeripheral = peripheral => {
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    updatePeripherals(peripheral.id, peripheral);
  };

  const togglePeripheralConnection = async peripheral => {
    if (peripheral && peripheral.connected) {
      BleManager.disconnect(peripheral.id);
    } else {
      connectPeripheral(peripheral);
    }
  };

  const connectPeripheral = async peripheral => {
    try {
      if (peripheral) {
        markPeripheral({connecting: true});
        await BleManager.connect(peripheral.id);
        markPeripheral({connecting: false, connected: true});
      }
    } catch (error) {
      console.log('Connection error', error);
    }
    function markPeripheral(props) {
      updatePeripherals(peripheral.id, {...peripheral, ...props});
    }
  };


  const handleAndroidPermissionCheck = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: 'Bluetooth Scan Permission',
          message: 'This app needs access to Bluetooth Scan in order to scan nearby Bluetooth devices.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Bluetooth Scan permission granted');
      } else {
        console.log('Bluetooth Scan permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  useEffect(() => {
    
    // Initialise la librairie BLE Manager
    BleManager.start({ showAlert: false }).then(() => {
      // Success code
      console.log("Module initialized");
    });

    const listeners = [
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral),
      bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic),
    ];

    handleAndroidPermissionCheck();

    return () => {
      console.log('unmount');
      for (const listener of listeners) {
        listener.remove();
      }
    };

  }, []);

  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={{marginLeft: 15, fontSize: 18, fontWeight: 'bold', color: 'white'}}>
          Rover Screen
        </Text>
        <Pressable style={styles.TabButton} onPress={scanDevices}>
          <Text style={{color: 'white', fontSize: 25}}>+</Text>
        </Pressable>
      </View>
    );
  };

  const Item = ({ device }: { device: PeripheralInfo }) => (
    <View key={device.id} style={styles.deviceContainer}>
      <Text style={styles.deviceName}>nom : {device.name}</Text>
      <Text style={styles.deviceId}>localname : {device.advertising.localName}</Text>
    </View>
  );
  
  const peripheralsArray = Array.from(peripherals.values()).map((item, index) => {
    return {
      ...item,
      key: index.toString() // définir une propriété "key" unique en utilisant l'index de l'élément
    };
  });

  
  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <View>
        <Text style={{color: 'white'}}>Périphériques BLE à proximité :</Text>
        <FlatList
          data={peripheralsArray}
          renderItem={({item}) => (<Item device={item}/>)}
          keyExtractor={item => item.key}
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
    },
    deviceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
    },
    deviceName: {
      marginRight: 10,
    },
    deviceId: {
      color: 'gray',
    },
  });

export default RoverScreen;
