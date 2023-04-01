import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../fc/Store';
import {Checkbox} from 'react-native-paper';

export default observer(function RoverSettingsScreen() {
  const store = useStoreContext();
  const HeaderMoreButton = () => {
    Alert.alert('TODO Screen');
  };

  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text
          style={{
            marginLeft: 15,
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Rover Settings
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
      <View style={styles.sortButton}>
        <Text style={{color: 'white', fontSize: 15}}>
          Display devices with no name :{' '}
        </Text>
        <Checkbox
          status={
            store.bluetoothManager.displayNoNameDevices
              ? 'checked'
              : 'unchecked'
          }
          onPress={() => {
            store.bluetoothManager.setDisplayNoNameDevices(
              !store.bluetoothManager.displayNoNameDevices,
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
});

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
});
