import {observer} from 'mobx-react-lite';
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import {List} from 'react-native-paper';

interface Props {
  navigation: any;
}

export default function SettingsScreen({navigation}: Props) {
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
          Settings
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <View>
        <List.Item
          title="Caster"
          description="NTRIP, Auto-connect, ..."
          left={props => <List.Icon {...props} icon="server" />}
          onPress={() => navigation.navigate('CasterSettingsScreen')}
        />
        <List.Item
          title="Rover"
          description="BLE, Bluetooth, USB, ..."
          left={props => <List.Icon {...props} icon="antenna" />}
          onPress={() => navigation.navigate('RoverSettingsScreen')}
        />
        <List.Item
          title="About"
          left={props => <List.Icon {...props} icon="information" />}
          onPress={() => navigation.navigate('AboutScreen')}
        />
      </View>
    </SafeAreaView>
  );
}

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
    alignItems: 'center',
  },
});
