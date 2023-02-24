import React, {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  LogBox,
} from 'react-native';
import { Observable, from } from 'rxjs';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

const RoverScreen = () => {
  const [devices, setDevices] = useState<Array<any>>([]);

  const scanDevices = () => {
    BleManager.scan([], 5, true).then(() => {
      console.log('Scan started');
    }).catch((error) => {
      console.log('Scan error:', error);
    });
  };
  
  useEffect(() => {
    // Initialise la librairie BLE Manager
    BleManager.start({ showAlert: false }).then(() => {
      // Success code
      console.log("Module initialized");
    });

    // Scanner les périphériques BLE à proximité
    const scanSubscription = from(
      BleManager.scan([], 5, true)
    ).subscribe({
      next: (device) => {
        console.log('Device found:', device);
        setDevices((prevDevices) => [...prevDevices, device]);
      },
      error: (error) => {
        console.log('Scan error:', error);
      },
    });

    // Déconnexion des périphériques lors de la fermeture de l'application
    return () => {
      scanSubscription?.unsubscribe();
      devices.forEach((device) => BleManager.disconnect(device.id));
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

  
  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <View>
        <Text style={{color: 'white'}}>Périphériques BLE à proximité :</Text>
        {devices.map((device) => {
          if (!device) {
            return null;
          }

          return (
            <View key={device.id} style={styles.deviceContainer}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceId}>{device.id}</Text>
            </View>
          );
        })}
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
