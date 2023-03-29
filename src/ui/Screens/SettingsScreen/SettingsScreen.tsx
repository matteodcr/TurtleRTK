import {observer} from 'mobx-react-lite';
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import {List, Button, Switch} from 'react-native-paper';
import {baseStyle} from '../Styles';
import {useStoreContext} from '../../../fc/Store';
const styles = baseStyle;

interface Props {
  navigation: any;
}

export default function SettingsScreen({navigation}: Props) {


  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={styles.boldText}>Settings</Text>
      </View>
    );
  };
  
  const store = useStoreContext();

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <View>
        <List.Item
          title="Caster"
          titleStyle={styles.text}
          description="NTRIP, Auto-connect, ..."
          descriptionStyle={styles.text}
          left={props => <List.Icon {...props} icon="server" />}
          onPress={() => navigation.navigate('CasterSettingsScreen')}
        />
        <List.Item
          title="Rover"
          titleStyle={styles.text}
          description="BLE, Bluetooth, USB, ..."
          descriptionStyle={styles.text}
          left={props => <List.Icon {...props} icon="antenna" />}
          onPress={() => navigation.navigate('RoverSettingsScreen')}
        />
        <List.Item
          title="About"
          titleStyle={styles.text}
          left={props => <List.Icon {...props} icon="information" />}
          onPress={() => navigation.navigate('AboutScreen')}
        />
        <Button
          style={{marginVertical: 10}}
          mode="contained"
          onPress={() => {
            store.settings.changeTheme();
          }}>
          Switch appearence
        </Button>
      </View>
    </SafeAreaView>
  );
}
