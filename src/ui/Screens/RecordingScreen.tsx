import {observer} from 'mobx-react-lite';
import React from 'react';
import {Button} from 'react-native-paper';
import {SafeAreaView, View, Text, StyleSheet, ScrollView} from 'react-native';
import {useStoreContext} from '../../fc/Store';
import {recStyle} from './Styles';
const styles = recStyle;

export default observer(function RecordingScreen() {
  const store = useStoreContext();

  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={styles.text}>Recording Screen</Text>
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
              store.casterConnection.clear();
            }}>
            Clear
          </Button>
        </View>
        <ScrollView>
          <Text style={styles.text}>
            {
              store.casterConnection.inputData[
                store.casterConnection.inputData.length - 1
              ]
            }
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});
