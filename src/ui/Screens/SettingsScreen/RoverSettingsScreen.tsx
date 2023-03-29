import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import {baseStyle} from '../Styles';
const styles = baseStyle;

export default function RoverSettingsScreen() {
  const HeaderMoreButton = () => {
    Alert.alert('TODO Screen');
  };

  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={styles.text}>Rover Settings</Text>
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
        <Text style={{color: 'white'}}>Rover Settings</Text>
      </View>
    </SafeAreaView>
  );
}
