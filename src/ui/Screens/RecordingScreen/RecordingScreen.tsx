import {observer} from 'mobx-react-lite';
import React from 'react';
import {Button} from 'react-native-paper';
import {SafeAreaView, View, Text, StyleSheet, ScrollView} from 'react-native';
import {useStoreContext} from '../../../fc/Store';
import {recStyle} from '../Styles';
const styles = recStyle;

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
        <Text style={styles.boldText}>Recording Screen</Text>
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
          <Text style={styles.boldText}>
            {store.bluetoothManager.outputData.toString()}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});
