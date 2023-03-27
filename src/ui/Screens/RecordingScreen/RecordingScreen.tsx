import {observer} from 'mobx-react-lite';
import React from 'react';
import {Button} from 'react-native-paper';
import {SafeAreaView, View, Text, StyleSheet, ScrollView} from 'react-native';
import {useStoreContext} from '../../../fc/Store';

interface Props {
  navigation: any;
}

export default observer(function RecordingScreen({navigation}: Props) {
  const store = useStoreContext();

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
              store.casterConnection.getNTRIPData();
            }}>
            Connection caster - Counter{' '}
            {store.casterConnection.inputData.length}
          </Button>
          <Button
            style={{marginVertical: 10}}
            mode="contained"
            onPress={() => {
              store.casterConnection.closeConnection();
            }}>
            Stop
          </Button>
          <Button
            style={{marginVertical: 10}}
            mode="contained"
            onPress={() => {
              store.logManager.write(
                store.bluetoothManager.outputData.toString(),
              );
              store.casterConnection.clear();
              store.bluetoothManager.clearOutput();
              store.casterConnection.closeConnection();
            }}>
            Clear & save
          </Button>
        </View>
        <ScrollView>
          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 15,
              color: 'white',
              padding: 15,
            }}>
            {store.bluetoothManager.outputData.toString()}
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
