import {observer} from 'mobx-react-lite';
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import {List} from 'react-native-paper';
import {baseStyle} from '../Styles';
const styles = baseStyle;

interface Props {
  navigation: any;
}

export default function SettingsScreen({navigation}: Props) {
  darkTheme: boolean = true;


  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={styles.boldText}>Settings</Text>
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
