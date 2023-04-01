import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {Button} from 'react-native-paper';
import {SafeAreaView, View, Text, StyleSheet, ScrollView} from 'react-native';
import {useStoreContext} from '../../../fc/Store';

interface Props {
  navigation: any;
}

export default observer(function RecordingScreen({navigation}: Props) {
  const store = useStoreContext();

  const [isRunning, setRunning] = useState(false);
  const [buttonText, setButtonText] = useState('Run');

  const HeaderButton = () => {
    navigation.navigate('LogScr');
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
          Recording Screen
        </Text>
        <Button onPress={HeaderButton}>View Logs</Button>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <View>
        <View style={{marginHorizontal: 20}}>
          <Button
            style={{marginVertical: 10}}
            mode="contained"
            onPress={() => {
              if (isRunning) {
                store.logManager.write(
                  store.bluetoothManager.outputData.toString(),
                );
                store.casterConnection.closeConnection();
                store.casterConnection.clear();
                store.bluetoothManager.stopNotification();
                store.bluetoothManager.clearOutput();
                setRunning(false);
                setButtonText('Run');
              } else {
                if (store.casterConnection.connectedBase !== null) {
                  setRunning(true);
                  setButtonText('Pause');
                  store.casterConnection.getNTRIPData();
                } else {
                  store.errorManager.printError(
                    'Select a base before running.',
                  );
                }
              }
            }}>
            {buttonText}
          </Button>

          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 15,
              color: 'white',
              padding: 15,
            }}>
            {'RTCM messsages received from caster : '}
            {store.casterConnection.inputData.length}
          </Text>
          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 15,
              color: 'white',
              padding: 15,
            }}>
            {'NMEA messages received from rover : '}
            {store.bluetoothManager.outputData.length}
          </Text>
        </View>
        <ScrollView>
          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 15,
              color: 'white',
              padding: 15,
            }}>
            {
              store.bluetoothManager.outputData[
                store.bluetoothManager.outputData.length - 1
              ]
            }
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  modal: {
    margin: 0, // This is the important style you need to set
  },
  item: {
    backgroundColor: '#3F4141',
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  header: {
    fontSize: 25,
    color: 'white',
    marginLeft: 15,
    paddingTop: 20,
    paddingBottom: 5,
  },

  title: {
    marginHorizontal: 10,
    fontSize: 20,
    color: 'white',
  },
  sortButton: {
    flex: 1,
    backgroundColor: '#151515',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  textinput: {
    margin: 10,
  },
  TabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
