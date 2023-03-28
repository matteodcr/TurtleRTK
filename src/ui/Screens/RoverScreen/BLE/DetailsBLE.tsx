import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {PeripheralInfo} from 'react-native-ble-manager';

export interface PeripheralProp {
  device: PeripheralInfo;
}
/**
 * Creates the screen to see details of the BLE device
 * @param route - contains route.params with the device
 */
const DetailsBLE = ({device}: PeripheralProp) => {
  //const {device}: {device: PeripheralInfo} = route.params;

  console.log(device);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'column', margin: 15, marginRight: 100}}>
        <Text style={{fontSize: 30, color: 'white', marginBottom: 20}}>
          Details :
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>Name : </Text>
          <Text style={styles.details}>{device.name}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>Local name : </Text>
          <Text style={styles.details}>{device.advertising.localName}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>Id : </Text>
          <Text style={styles.details}>{device.id}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>RSSI : </Text>
          <Text style={styles.details}>{device.rssi}</Text>
        </View>
        <Text style={{fontSize: 18, color: 'white', marginTop: 15}}>
          Advertising
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>Is connectable : </Text>
          <Text style={styles.details}>
            {String(device.advertising.isConnectable)}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>Tx power level : </Text>
          <Text style={styles.details}>{device.advertising.txPowerLevel}</Text>
        </View>
        <Text style={{fontSize: 18, color: 'white', marginTop: 15}}>
          Manufacturer data
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>CDV type : </Text>
          <Text style={styles.details}>
            {device.advertising.manufacturerData?.CDVType}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>Bytes : </Text>
          {device.advertising.manufacturerData?.bytes != null ? (
            <Text style={styles.details}>
              {String.fromCharCode.apply(
                null,
                Array.from(device.advertising.manufacturerData?.bytes),
              )}
            </Text>
          ) : (
            <Text style={styles.details}>None</Text>
          )}
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>Data : </Text>
          {device.advertising.manufacturerData?.data != null ? (
            <Text style={styles.details}>
              {Array.from(
                Buffer.from(
                  device.advertising.manufacturerData?.data,
                  'base64',
                ),
              ).join('/')}
            </Text>
          ) : (
            <Text style={styles.details}>None</Text>
          )}
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>Service UUIDs : </Text>
          <Text style={styles.details}>{device.advertising.serviceUUIDs}</Text>
        </View>
        <Text style={{fontSize: 18, color: 'white', marginTop: 15}}>
          Service data
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>CDV type : </Text>
          <Text style={styles.details}>
            {device.advertising.serviceData?.CDVType}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>Bytes : </Text>
          <Text style={styles.details}>
            {device.advertising.serviceData?.bytes}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.detailsTitle}>Data : </Text>
          <Text style={styles.details}>
            {device.advertising.serviceData?.data}
          </Text>
        </View>
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
  headerTab: {
    backgroundColor: '#111111',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: '#151515',
    borderBottomWidth: 1,
    height: 50,
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  details: {
    fontSize: 15,
    color: 'white',
  },
});

export default DetailsBLE;
