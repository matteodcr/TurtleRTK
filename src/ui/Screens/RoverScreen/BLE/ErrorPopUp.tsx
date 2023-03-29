import React from 'react';
import {observer} from 'mobx-react-lite';
import {Modal, Pressable, Text, View} from 'react-native';
import {errorStyle} from '../../Styles';
const styles = errorStyle;

import {useStoreContext} from '../../../../fc/Store';

/**
 * Enum of possible errors for BLE
 */
export enum ErrorType {
  BLUETOOTH,
}

/**
 * Describes the props of the ErrorPopUp class
 */
interface ErrorPopUpProps {
  error: ErrorType;
  title: string;
  desc: string;
}

/**
 * Creates the Error Popup Screen
 */
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
        error === ErrorType.BLUETOOTH &&
        !store.bluetoothManager.isBluetoothActivated &&
        store.bluetoothManager.displayBluetoothActivatedError
      }
      onRequestClose={() => {
        switch (error) {
          case ErrorType.BLUETOOTH:
            store.bluetoothManager.setDisplayBluetoothActivatedError(false);
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
