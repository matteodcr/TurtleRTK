import React from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {PeripheralInfo} from 'react-native-ble-manager';
import {Button, Chip} from 'react-native-paper';
import Modal from 'react-native-modal';

export interface PeripheralProp {
  device: PeripheralInfo;
  isVisible: boolean;
  toogleVisibility(): void;
}
/**
 * Creates the screen to see details of the BLE device
 * @param route - contains route.params with the device
 */
const BLEModal = ({device, isVisible, toogleVisibility}: PeripheralProp) => {
  return (
    <View>
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        useNativeDriver={true}
        onBackButtonPress={toogleVisibility}
        onSwipeComplete={toogleVisibility}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.header}>BLE Details</Text>
            <View style={styles.container}>
              <Chip style={styles.chip}>Id : {device.id}</Chip>
              {device.name && (
                <Chip style={styles.chip}>Name : {device.name}</Chip>
              )}
              <Chip style={styles.HeaderChip} textStyle={styles.headerChipText}>
                Advertising
              </Chip>
              <View style={styles.chipsContainer}>
                {device.advertising.isConnectable && (
                  <Chip style={styles.chip}>
                    Is connectable :{' '}
                    {device.advertising.isConnectable.toString()}
                  </Chip>
                )}
                {device.advertising.localName && (
                  <Chip style={styles.chip}>
                    Local name : {device.advertising.localName}
                  </Chip>
                )}
                {device.advertising.manufacturerData && (
                  <View>
                    <Chip style={styles.groupChip}>Manufacturer data : </Chip>
                    <View style={styles.chipsContainerList}>
                      <Chip style={styles.chip}>
                        CDVType : {device.advertising.manufacturerData.CDVType}
                      </Chip>
                      <Chip style={styles.chip}>
                        Bytes : {device.advertising.manufacturerData.bytes}
                      </Chip>
                      <Chip style={styles.chip}>
                        Data : {device.advertising.manufacturerData.data}
                      </Chip>
                    </View>
                  </View>
                )}
                {device.advertising.serviceData && (
                  <View>
                    <Chip style={styles.groupChip}>Service data : </Chip>
                    <View style={styles.chipsContainerList}>
                      <Chip style={styles.chip}>
                        CDVType : {device.advertising.serviceData.CDVType}
                      </Chip>
                      <Chip style={styles.chip}>
                        Bytes : {device.advertising.serviceData.bytes}
                      </Chip>
                      <Chip style={styles.chip}>
                        Data : {device.advertising.serviceData.data}
                      </Chip>
                    </View>
                  </View>
                )}
                {device.advertising.serviceUUIDs && (
                  <Chip style={styles.chip}>
                    Service UUIDs : {device.advertising.serviceUUIDs}
                  </Chip>
                )}
                {device.advertising.txPowerLevel && (
                  <Chip style={styles.chip}>
                    Tx power level : {device.advertising.txPowerLevel}
                  </Chip>
                )}
              </View>
              {device.characteristics && (
                <Chip style={styles.chip}>
                  Characteristics : {device.characteristics?.toString()}
                </Chip>
              )}
              <Chip style={styles.chip}>RSSI : {device.rssi}</Chip>
              {device.serviceUUIDs && (
                <Chip style={styles.chip}>
                  Service UUIDs : {device.serviceUUIDs.toString()}
                </Chip>
              )}
              {device.services && (
                <Chip style={styles.chip}>
                  Services : {device.services.toString()}
                </Chip>
              )}
            </View>

            <Button
              style={{marginHorizontal: 100, marginTop: 20}}
              mode="contained"
              onPress={() => {
                toogleVisibility();
              }}>
              Back
            </Button>
          </ScrollView>
        </View>
      </Modal>
    </View>
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
  header: {
    fontSize: 25,
    color: 'white',
    marginLeft: 15,
    paddingTop: 20,
    paddingBottom: 5,
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
  modal: {
    margin: 0, // This is the important style you need to set
  },
  chipsContainer: {
    paddingLeft: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipsContainerList: {
    paddingLeft: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
  },
  groupChip: {
    margin: 4,
    flexWrap: 'wrap',
  },
  HeaderChip: {
    margin: 4,
    backgroundColor: 'rgba(6, 209, 250, 0.5)',
  },
  headerChipText: {
    color: 'lightblue',
  },
});

export default BLEModal;
