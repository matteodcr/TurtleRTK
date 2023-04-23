import {observer} from 'mobx-react-lite';
import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {useStoreContext} from '../../../../fc/Store';

export enum ErrorType {
  BLUETOOTH,
  LOCALISATION,
}

interface ErrorPopUpProps {
  error: ErrorType;
  title: string;
  desc: string;
}

export default observer(function ErrorPopUp({
  error,
  title,
  desc,
}: ErrorPopUpProps) {
  const store = useStoreContext();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={
        (error == ErrorType.BLUETOOTH &&
          !store.bluetoothManager.isBluetoothActivated &&
          store.bluetoothManager.displayBluetoothActivatedError) ||
        (error == ErrorType.LOCALISATION &&
          !store.bluetoothManager.isLocalisationActivated &&
          store.bluetoothManager.displayLocalisationActivatedError)
      }
      onRequestClose={() => {
        switch (error) {
          case ErrorType.BLUETOOTH:
            store.bluetoothManager.setDisplayBluetoothActivatedError(false);
            break;
          case ErrorType.LOCALISATION:
            store.bluetoothManager.setDisplayLocalisationActivatedError(false);
            break;
        }
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 22,
        }}>
        <View style={styles.errorView}>
          <Text
            style={{
              color: 'red',
              textAlign: 'center',
              fontSize: 20,
              paddingBottom: 30,
              fontWeight: 'bold',
            }}>
            {title}
          </Text>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 15,
              paddingBottom: 15,
            }}>
            {desc}
          </Text>
          <Pressable
            style={{
              borderRadius: 20,
              padding: 10,
              elevation: 2,
              backgroundColor: 'lightblue',
            }}
            onPress={() => {
              switch (error) {
                case ErrorType.BLUETOOTH:
                  store.bluetoothManager.setDisplayBluetoothActivatedError(
                    false,
                  );
                  break;
                case ErrorType.LOCALISATION:
                  store.bluetoothManager.setDisplayLocalisationActivatedError(
                    false,
                  );
                  break;
              }
            }}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: 15,
                marginHorizontal: 20,
              }}>
              Hide
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  errorView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
