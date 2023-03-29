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
            Connection caster
          </Button>
          <Button
            style={{marginVertical: 10}}
            mode="contained"
            onPress={() => {
              store.logManager.write(
                store.bluetoothManager.outputData.toString(),
              );
              store.casterConnection.closeConnection();
              store.casterConnection.clear();
              store.bluetoothManager.stopAllNotifications();
              store.bluetoothManager.clearOutput();
            }}>
            Clear & save
          </Button>
          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 15,
              color: 'white',
              padding: 15,
            }}>
            {'RTCM files received from caster : '}
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
          <Text style={styles.boldText}>
            {store.bluetoothManager.outputData.toString()}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});
