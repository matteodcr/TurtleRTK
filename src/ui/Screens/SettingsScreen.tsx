/* eslint-disable prettier/prettier */
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  NativeModules,
  Button
} from 'react-native';

const SettingsScreen = () => {
  const HeaderMoreButton = () => {
    Alert.alert('TODO Screen');
  };
  const UsbConnect = () => {
    Alert.alert('WIP');
  };
  const {UsbModule} = NativeModules;
  const onPress = () => {
    UsbModule.ouaip();
  };
  const attachUsb = () => {
    UsbModule.startUsbConnection();
  };
  const sendUsb = () => {
    UsbModule.sendData("zer");
  }
  const detachUsb = () => {
    UsbModule.disconnect();
  }

  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={{marginLeft: 15, fontSize: 18, fontWeight: 'bold'}}>
          Settings Screen
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
        <Text>Settings</Text>
        <Pressable style={styles.TabButton} onPress={UsbConnect}>
          <Text style={{color: 'white', fontSize: 25}}>USB</Text>
        </Pressable>
        <Button
        title='test logs'
        onPress={onPress}
        />
        <Button
        title='connect'
        onPress={attachUsb}
        />
        <Button
        title='send paquet'
        onPress={sendUsb}
        />
        <Button
        title='disconnect'
        onPress={detachUsb}
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

export default SettingsScreen;
